/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
 *                                                                            *
 * See the AUTHORS.txt, DEVELOPER-AGREEMENT.txt and LICENSE.txt files at      *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Nxt software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

package xin.api;

import static xin.api.JSONResponses.INCORRECT_ADMIN_PASSWORD;
import static xin.api.JSONResponses.NO_PASSWORD_IN_CONFIG;

import java.io.IOException;
import java.math.BigInteger;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.gzip.GzipHandler;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.eclipse.jetty.util.ssl.SslContextFactory;

import xin.Xin;
import xin.util.Logger;
import xin.util.ThreadPool;
import xin.util.UPnP;

public final class API {

    public static final int openAPIPort;
    public static final int openAPISSLPort;

    public static final List<String> disabledAPIs;
    public static final List<APITag> disabledAPITags;

    private static final Set<String> allowedBotHosts;
    private static final Set<String> allowedBotLocalhosts;
    private static final List<NetworkAddress> allowedBotNets;
    private static final List<NetworkAddress> allowedBotLocalNets;
    public static final String adminPassword = Xin.getStringProperty("xin.adminPassword", "", true);
    static final boolean disableAdminPassword;
    static final int maxRecords = Xin.getIntProperty("xin.maxAPIRecords");
    static final boolean enableAPIUPnP = Xin.getBooleanProperty("xin.enableAPIUPnP");

    private static final Server apiServer;
    private static URI welcomePageUri;
    private static URI serverRootUri;

    static {
        List<String> disabled = Xin.getStringListProperty("xin.disabledAPIs");
        Collections.sort(disabled);
        disabledAPIs = Collections.unmodifiableList(disabled);
        disabled = Xin.getStringListProperty("xin.disabledAPITags");
        Collections.sort(disabled);
        List<APITag> apiTags = new ArrayList<>(disabled.size());
        disabled.forEach(tagName -> apiTags.add(APITag.fromDisplayName(tagName)));
        disabledAPITags = Collections.unmodifiableList(apiTags);
        List<String> allowedBotHostsList = Xin.getStringListProperty("xin.allowedBotHosts");
        if (!allowedBotHostsList.contains("*")) {
            Set<String> hosts = new HashSet<>();
            List<NetworkAddress> nets = new ArrayList<>();
            for (String host : allowedBotHostsList) {
                if (host.contains("/")) {
                    try {
                        nets.add(new NetworkAddress(host));
                    } catch (UnknownHostException e) {
                        Logger.logErrorMessage("Unknown network " + host, e);
                        throw new RuntimeException(e.toString(), e);
                    }
                } else {
                    hosts.add(host);
                }
            }
            allowedBotHosts = Collections.unmodifiableSet(hosts);
            allowedBotNets = Collections.unmodifiableList(nets);
        } else {
            allowedBotHosts = null;
            allowedBotNets = null;
        }

        List<String> allowedBotLocalHostsList = Xin.getStringListProperty("xin.allowedBotLocalhost");
        Set<String> hosts = new HashSet<>();
        List<NetworkAddress> nets = new ArrayList<>();
        for (String host : allowedBotLocalHostsList) {
            if (host.contains("/")) {
                try {
                    nets.add(new NetworkAddress(host));
                } catch (UnknownHostException e) {
                    Logger.logErrorMessage("Unknown network " + host, e);
                    throw new RuntimeException(e.toString(), e);
                }
            } else {
                hosts.add(host);
            }
        }
        allowedBotLocalhosts = Collections.unmodifiableSet(hosts);
        allowedBotLocalNets = Collections.unmodifiableList(nets);
        
        
        boolean enableAPIServer = Xin.getBooleanProperty("xin.enableAPIServer");

        if (enableAPIServer) {

            final int port = Xin.getIntProperty("xin.apiServerPort");
            final int sslPort = Xin.getIntProperty("xin.apiServerSSLPort");
            final String host = Xin.getStringProperty("xin.apiServerHost");
            disableAdminPassword = Xin.getBooleanProperty("xin.disableAdminPassword") || ("127.0.0.1".equals(host) && adminPassword.isEmpty());

            apiServer = new Server();
            ServerConnector connector;
            boolean enableSSL = Xin.getBooleanProperty("xin.apiSSL");
            //
            // Create the HTTP connector
            //
            if (!enableSSL || port != sslPort) {
                connector = new ServerConnector(apiServer);
                connector.setPort(port);
                connector.setHost(host);
                connector.setIdleTimeout(Xin.getIntProperty("xin.apiServerIdleTimeout"));
                connector.setReuseAddress(true);
                apiServer.addConnector(connector);
                Logger.logMessage("API server using HTTP port " + port);
            }
            //
            // Create the HTTPS connector
            //
            final SslContextFactory sslContextFactory;
            if (enableSSL) {
                HttpConfiguration https_config = new HttpConfiguration();
                https_config.setSendDateHeader(false);
                https_config.setSendServerVersion(false);
                https_config.setSecureScheme("https");
                https_config.setSecurePort(sslPort);
                https_config.addCustomizer(new SecureRequestCustomizer());
                sslContextFactory = new SslContextFactory();
                String keyStorePath = Paths.get(Xin.getUserHomeDir()).resolve(Paths.get(Xin.getStringProperty("xin.keyStorePath"))).toString();
                Logger.logInfoMessage("Using keystore: " + keyStorePath);
                sslContextFactory.setKeyStorePath(keyStorePath);
                sslContextFactory.setKeyStorePassword(Xin.getStringProperty("xin.keyStorePassword", null, true));
                sslContextFactory.addExcludeCipherSuites("SSL_RSA_WITH_DES_CBC_SHA", "SSL_DHE_RSA_WITH_DES_CBC_SHA",
                        "SSL_DHE_DSS_WITH_DES_CBC_SHA", "SSL_RSA_EXPORT_WITH_RC4_40_MD5", "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA",
                        "SSL_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA", "SSL_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA");
                sslContextFactory.addExcludeProtocols("SSLv3");
                sslContextFactory.setKeyStoreType(Xin.getStringProperty("xin.keyStoreType"));

                List<String> ciphers = Xin.getStringListProperty("xin.apiSSLCiphers");

                if (!ciphers.isEmpty()) {
                    sslContextFactory.setIncludeCipherSuites(ciphers.toArray(new String[ciphers.size()]));
                }
                connector = new ServerConnector(apiServer, new SslConnectionFactory(sslContextFactory, "http/1.1"),
                        new HttpConnectionFactory(https_config));
                connector.setPort(sslPort);
                connector.setHost(host);
                connector.setIdleTimeout(Xin.getIntProperty("xin.apiServerIdleTimeout"));
                connector.setReuseAddress(true);
                apiServer.addConnector(connector);
                Logger.logMessage("API server using HTTPS port " + sslPort);
            } else {
                sslContextFactory = null;
            }

            String localhost = "0.0.0.0".equals(host) || "127.0.0.1".equals(host) ? "localhost" : host;
            try {
                welcomePageUri = new URI(enableSSL ? "https" : "http", null, localhost, enableSSL ? sslPort : port, "/wallet/index.html", null, null);
                serverRootUri = new URI(enableSSL ? "https" : "http", null, localhost, enableSSL ? sslPort : port, "/wallet", null, null);
            } catch (URISyntaxException e) {
                Logger.logInfoMessage("Cannot resolve browser URI", e);
            }
            openAPIPort = "0.0.0.0".equals(host) && allowedBotHosts == null && (!enableSSL || port != sslPort) ? port : 0;
            openAPISSLPort = "0.0.0.0".equals(host) && allowedBotHosts == null && enableSSL ? sslPort : 0;

            HandlerList apiHandlers = new HandlerList();

            ServletContextHandler apiHandler = new ServletContextHandler();
            String apiResourceBase = Xin.getStringProperty("xin.apiResourceBase");
            if (apiResourceBase != null) {
                ServletHolder defaultServletHolder = new ServletHolder(new DefaultServlet());
                defaultServletHolder.setInitParameter("dirAllowed", "false");
                defaultServletHolder.setInitParameter("resourceBase", apiResourceBase);
                defaultServletHolder.setInitParameter("welcomeServlets", "true");
                defaultServletHolder.setInitParameter("redirectWelcome", "true");
                defaultServletHolder.setInitParameter("gzip", "true");
                defaultServletHolder.setInitParameter("etags", "true");
                apiHandler.addServlet(defaultServletHolder, "/wallet/*");
                apiHandler.setWelcomeFiles(new String[]{Xin.getStringProperty("xin.apiWelcomeFile")});
            }

            apiHandler.addServlet(APIServlet.class, "/api");
            
            ServletHolder envConfigServletHolder = new ServletHolder(new EnvConfigServlet());
            //apiHandler.addServlet(envConfigServletHolder, "/wallet/env.config.js");


            GzipHandler gzipHandler = new GzipHandler();
            if (!Xin.getBooleanProperty("xin.enableAPIServerGZIPFilter")) {
                gzipHandler.setExcludedPaths("/api");
            }
            gzipHandler.setIncludedMethods("GET", "POST");
            gzipHandler.setMinGzipSize(xin.peer.Peers.MIN_COMPRESS_SIZE);
            apiHandler.setGzipHandler(gzipHandler);

            if (Xin.getBooleanProperty("xin.apiServerCORS")) {
                FilterHolder filterHolder = apiHandler.addFilter(CrossOriginFilter.class, "/*", null);
                filterHolder.setInitParameter("allowedHeaders", "*");
                filterHolder.setAsyncSupported(true);
            }

            if (Xin.getBooleanProperty("xin.apiFrameOptionsSameOrigin")) {
                FilterHolder filterHolder = apiHandler.addFilter(XFrameOptionsFilter.class, "/*", null);
                filterHolder.setAsyncSupported(true);
            }

            apiHandlers.addHandler(apiHandler);
            apiHandlers.addHandler(new DefaultHandler());

            apiServer.setHandler(apiHandlers);
            apiServer.setStopAtShutdown(true);

            ThreadPool.runBeforeStart(() -> {
                try {
                    if (enableAPIUPnP) {
                        Connector[] apiConnectors = apiServer.getConnectors();
                        for (Connector apiConnector : apiConnectors) {
                            if (apiConnector instanceof ServerConnector)
                                UPnP.addPort(((ServerConnector) apiConnector).getPort());
                        }
                    }

                    APIServlet.initClass();

                    apiServer.start();

                    if (sslContextFactory != null) {
                        Logger.logDebugMessage("API SSL Protocols: " + Arrays.toString(sslContextFactory.getSelectedProtocols()));
                        Logger.logDebugMessage("API SSL Ciphers: " + Arrays.toString(sslContextFactory.getSelectedCipherSuites()));
                    }
                    Logger.logMessage("Started API server at " + host + ":" + port + (enableSSL && port != sslPort ? ", " + host + ":" + sslPort : ""));
                } catch (Exception e) {
                    Logger.logErrorMessage("Failed to start API server", e);
                    throw new RuntimeException(e.toString(), e);
                }

            }, true);

        } else {
            apiServer = null;
            disableAdminPassword = false;
            openAPIPort = 0;
            openAPISSLPort = 0;
            Logger.logMessage("API server not enabled");
        }

    }

    public static void init() {
    }

    public static void shutdown() {
        if (apiServer != null) {
            try {
                apiServer.stop();
                if (enableAPIUPnP) {
                    Connector[] apiConnectors = apiServer.getConnectors();
                    for (Connector apiConnector : apiConnectors) {
                        if (apiConnector instanceof ServerConnector)
                            UPnP.deletePort(((ServerConnector) apiConnector).getPort());
                    }
                }
            } catch (Exception e) {
                Logger.logShutdownMessage("Failed to stop API server", e);
            }
        }
    }

    public static void verifyPassword(HttpServletRequest req) throws ParameterException {
        if (API.disableAdminPassword) {
            return;
        }
        if (API.adminPassword.isEmpty()) {
            throw new ParameterException(NO_PASSWORD_IN_CONFIG);
        } else if (!API.adminPassword.equals(req.getParameter("adminPassword"))) {
            Logger.logWarningMessage("Incorrect adminPassword");
            throw new ParameterException(INCORRECT_ADMIN_PASSWORD);
        }
    }

    public static boolean checkPassword(HttpServletRequest req) {
        return (API.disableAdminPassword || (!API.adminPassword.isEmpty() && API.adminPassword.equals(req.getParameter("adminPassword"))));
    }

    static boolean isAllowed(String remoteHost) {
    	
        if (API.allowedBotHosts == null || API.allowedBotHosts.contains(remoteHost)) {
            return true;
        }
        try {
            BigInteger hostAddressToCheck = new BigInteger(InetAddress.getByName(remoteHost).getAddress());
            for (NetworkAddress network : API.allowedBotNets) {
                if (network.contains(hostAddressToCheck)) {
                    return true;
                }
            }
        } catch (UnknownHostException e) {
            // can't resolve, disallow
            Logger.logMessage("Unknown remote host " + remoteHost);
        }
        return false;

    }
    
    static boolean isAllowedLocalhost(String remoteHost) {
    	
        if (API.allowedBotLocalhosts == null || API.allowedBotLocalhosts.contains(remoteHost)) {
            return true;
        }
        try {
            BigInteger hostAddressToCheck = new BigInteger(InetAddress.getByName(remoteHost).getAddress());
            for (NetworkAddress network : API.allowedBotLocalNets) {
                if (network.contains(hostAddressToCheck)) {
                    return true;
                }
            }
        } catch (UnknownHostException e) {
            // can't resolve, disallow
            Logger.logMessage("Unknown remote host " + remoteHost);
        }
        return false;

    }

    private static class NetworkAddress {

        private BigInteger netAddress;
        private BigInteger netMask;

        private NetworkAddress(String address) throws UnknownHostException {
            String[] addressParts = address.split("/");
            if (addressParts.length == 2) {
                InetAddress targetHostAddress = InetAddress.getByName(addressParts[0]);
                byte[] srcBytes = targetHostAddress.getAddress();
                netAddress = new BigInteger(1, srcBytes);
                int maskBitLength = Integer.valueOf(addressParts[1]);
                int addressBitLength = (targetHostAddress instanceof Inet4Address) ? 32 : 128;
                netMask = BigInteger.ZERO
                        .setBit(addressBitLength)
                        .subtract(BigInteger.ONE)
                        .subtract(BigInteger.ZERO.setBit(addressBitLength - maskBitLength).subtract(BigInteger.ONE));
            } else {
                throw new IllegalArgumentException("Invalid address: " + address);
            }
        }

        private boolean contains(BigInteger hostAddressToCheck) {
            return hostAddressToCheck.and(netMask).equals(netAddress);
        }

    }

    public static final class XFrameOptionsFilter implements Filter {

        @Override
        public void init(FilterConfig filterConfig) throws ServletException {
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
            ((HttpServletResponse) response).setHeader("X-FRAME-OPTIONS", "SAMEORIGIN");
            chain.doFilter(request, response);
        }

        @Override
        public void destroy() {
        }

    }

    public static URI getWelcomePageUri() {
        return welcomePageUri;
    }

    public static URI getServerRootUri() {
        return serverRootUri;
    }
    
    private API() {
    } // never

}
