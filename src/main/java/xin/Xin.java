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

package xin;

import org.apache.commons.lang.StringUtils;
import xin.api.API;
import xin.crypto.Crypto;
import xin.env.DirProvider;
import xin.env.RuntimeEnvironment;
import xin.env.RuntimeMode;
import xin.env.ServerStatus;
import xin.peer.Peers;
import xin.util.Convert;
import xin.util.Logger;
import xin.util.ThreadPool;
import xin.util.Time;
import org.json.simple.JSONObject;

import java.io.*;
import java.lang.management.ManagementFactory;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.AccessControlException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

public final class Xin {

    public static final String VERSION = "0.3.2";
    public static final String APPLICATION = "XIN";
    public static final int STRONG_PASSWORD_LENGTH = 5;

    private static volatile Time time = new Time.EpochTime();

    public static final String XIN_STORAGE_PROPERTIES = "storage.properties";
    public static final String XIN_GATEWAY_PROPERTIES = "gateways.properties";
    public static final String XIN_PROXIES_PROPERTIES = "proxies.properties";

    public static final String XIN_API_PROPERTIES = "api.properties";
    public static final String XIN_BLOCK_PROPERTIES = "block.properties";
    public static final String XIN_DBS_PROPERTIES = "dbs.properties";
    public static final String XIN_DEBUG_PROPERTIES = "debug.properties";
    public static final String XIN_DEV_PROPERTIES = "dev.properties";
    public static final String XIN_JETTY_PROPERTIES = "jetty.properties";
    public static final String XIN_MISC_PROPERTIES = "misc.properties";
    public static final String XIN_PEER_PROPERTIES = "peer.properties";
    public static final String XIN_SYSTEM_PROPERTIES = "system.properties";

    public static final String XIN_CUSTOM_PROPERTIES = "custom.properties";

    public static final String CONFIG_DIR = "conf";

    private static final RuntimeMode runtimeMode;
    private static final DirProvider dirProvider;

    private static final Properties defaultProperties = new Properties();

    static {
        redirectSystemStreams("out");
        redirectSystemStreams("err");
        System.out.println("Initializing XIN server version " + Xin.VERSION);
        runtimeMode = RuntimeEnvironment.getRuntimeMode();
        System.out.printf("Runtime mode %s\n", runtimeMode.getClass().getName());
        dirProvider = RuntimeEnvironment.getDirProvider();
        System.out.println("User home folder " + dirProvider.getUserHomeDir());

        loadProperties(defaultProperties, XIN_STORAGE_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_PROXIES_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_GATEWAY_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_API_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_BLOCK_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_DBS_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_DEBUG_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_DEV_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_JETTY_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_MISC_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_PEER_PROPERTIES, true);
        loadProperties(defaultProperties, XIN_SYSTEM_PROPERTIES, true);

        if (!VERSION.equals(Xin.defaultProperties.getProperty("xin.version"))) {
            throw new RuntimeException("Using a property file from a version other than " + VERSION + " is not supported!!!");
        }
    }

    private static void redirectSystemStreams(String streamName) {
        String isStandardRedirect = System.getProperty("xin.redirect.system." + streamName);

        Path path = null;

        if (isStandardRedirect != null) {
            try {
                path = Files.createTempFile("xin.system." + streamName + ".", ".log");
            } catch (IOException e) {
                e.printStackTrace();
                return;
            }
        } else {
            String explicitFileName = System.getProperty("xin.system." + streamName);
            if (explicitFileName != null) {
                path = Paths.get(explicitFileName);
            }
        }

        if (path != null) {
            try {
                PrintStream stream = new PrintStream(Files.newOutputStream(path));
                if (streamName.equals("out")) {
                    System.setOut(new PrintStream(stream));
                } else {
                    System.setErr(new PrintStream(stream));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    private static final Properties properties = new Properties(defaultProperties);

    static {
        loadProperties(properties, XIN_CUSTOM_PROPERTIES, false);

        //Add property validations here
        if (StringUtils.equalsIgnoreCase(getStringProperty("xin.enableAPIServer"), "true")) {
            if (StringUtils.length(getStringProperty("xin.adminPassword")) < STRONG_PASSWORD_LENGTH) {
                String errorMessage = "Admin password must be of length " + STRONG_PASSWORD_LENGTH;
                if (StringUtils.isEmpty(getStringProperty("xin.adminPassword"))) {
                    errorMessage = "Admin password need to be set for enabling api server";
                }
                throw new RuntimeException(errorMessage);
            }
        }
    }

    public static Properties loadProperties(Properties properties, String propertiesFile, boolean isDefault) {
        try {
            // Load properties from location specified as command line parameter
            String configFile = System.getProperty(propertiesFile);
            if (configFile != null) {
                System.out.printf("Loading %s from %s\n", propertiesFile, configFile);
                try (InputStream fis = new FileInputStream(configFile)) {
                    properties.load(fis);
                    return properties;
                } catch (IOException e) {
                    throw new IllegalArgumentException(String.format("Error loading %s from %s", propertiesFile, configFile));
                }
            } else {
                try (InputStream is = ClassLoader.getSystemResourceAsStream(propertiesFile)) {
                    // When running from a Windows installation we always have properties in the classpath but this is not the properties file
                    // Therefore we first load it from the classpath and then look for the real properties in the user folder.
                    if (is != null) {
                        System.out.printf("Loading %s from classpath\n", propertiesFile);
                        properties.load(is);
                        if (isDefault) {
                            return properties;
                        }
                    }
                    // load non-default properties files from the user folder
                    if (!dirProvider.isLoadPropertyFileFromUserDir()) {
                        return properties;
                    }
                    String homeDir = dirProvider.getUserHomeDir();
                    if (!Files.isReadable(Paths.get(homeDir))) {
                        System.out.printf("Creating dir %s\n", homeDir);
                        try {
                            Files.createDirectory(Paths.get(homeDir));
                        } catch (Exception e) {
                            if (!(e instanceof NoSuchFileException)) {
                                throw e;
                            }
                            // Fix for WinXP and 2003 which does have a roaming sub folder
                            Files.createDirectory(Paths.get(homeDir).getParent());
                            Files.createDirectory(Paths.get(homeDir));
                        }
                    }
                    Path confDir = Paths.get(homeDir, CONFIG_DIR);
                    if (!Files.isReadable(confDir)) {
                        System.out.printf("Creating dir %s\n", confDir);
                        Files.createDirectory(confDir);
                    }
                    Path propPath = Paths.get(confDir.toString()).resolve(Paths.get(propertiesFile));
                    if (Files.isReadable(propPath)) {
                        System.out.printf("Loading %s from dir %s\n", propertiesFile, confDir);
                        properties.load(Files.newInputStream(propPath));
                    } else {
                        System.out.printf("Creating property file %s\n", propPath);
                        Files.createFile(propPath);
                        Files.write(propPath, Convert.toBytes("# use this file for workstation specific " + propertiesFile));
                    }
                    return properties;
                } catch (IOException e) {
                    throw new IllegalArgumentException("Error loading " + propertiesFile, e);
                }
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace(); // make sure we log this exception
            throw e;
        }
    }

    private static void printCommandLineArguments() {
        try {
            List<String> inputArguments = ManagementFactory.getRuntimeMXBean().getInputArguments();
            if (inputArguments != null && inputArguments.size() > 0) {
                System.out.println("Command line arguments");
            } else {
                return;
            }
            inputArguments.forEach(System.out::println);
        } catch (AccessControlException e) {
            System.out.println("Cannot read input arguments " + e.getMessage());
        }
    }

    public static int getIntProperty(String name) {
        return getIntProperty(name, 0);
    }

    public static int getIntProperty(String name, int defaultValue) {
        try {
            int result = Integer.parseInt(properties.getProperty(name));
            return result;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public static String getStringProperty(String name) {
        return getStringProperty(name, null, false);
    }

    public static String getStringProperty(String name, String defaultValue) {
        return getStringProperty(name, defaultValue, false);
    }

    public static String getStringProperty(String name, String defaultValue, boolean doNotLog) {
        String value = properties.getProperty(name);
        if (value != null && !"".equals(value)) {
            return value;
        } else {
            return defaultValue;
        }
    }

    public static List<String> getStringListProperty(String name) {
        String value = getStringProperty(name);
        if (value == null || value.length() == 0) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        for (String s : value.split(";")) {
            s = s.trim();
            if (s.length() > 0) {
                result.add(s);
            }
        }
        return result;
    }

    public static Boolean getBooleanProperty(String name) {
        String value = properties.getProperty(name);
        if (Boolean.TRUE.toString().equals(value)) {
            return true;
        } else if (Boolean.FALSE.toString().equals(value)) {
            return false;
        }
        Logger.logMessage(name + " not defined, assuming false");
        return false;
    }

    public static Blockchain getBlockchain() {
        return BlockchainImpl.getInstance();
    }

    public static BlockchainProcessor getBlockchainProcessor() {
        return BlockchainProcessorImpl.getInstance();
    }

    public static TransactionProcessor getTransactionProcessor() {
        return TransactionProcessorImpl.getInstance();
    }

    public static Transaction.Builder newTransactionBuilder(byte[] senderPublicKey, long amountTQT, long feeTQT, short deadline, Attachment attachment) {
        return new TransactionImpl.BuilderImpl((byte) 1, senderPublicKey, amountTQT, feeTQT, deadline, (Attachment.AbstractAttachment) attachment);
    }

    public static Transaction.Builder newTransactionBuilder(byte[] transactionBytes) throws XinException.NotValidException {
        return TransactionImpl.newTransactionBuilder(transactionBytes);
    }

    public static Transaction.Builder newTransactionBuilder(JSONObject transactionJSON) throws XinException.NotValidException {
        return TransactionImpl.newTransactionBuilder(transactionJSON);
    }

    public static Transaction.Builder newTransactionBuilder(byte[] transactionBytes, JSONObject prunableAttachments) throws XinException.NotValidException {
        return TransactionImpl.newTransactionBuilder(transactionBytes, prunableAttachments);
    }

    public static int getEpochTime() {
        return time.getTime();
    }

    static void setTime(Time time) {
        Xin.time = time;
    }

    public static void main(String[] args) {
        try {
            Runtime.getRuntime().addShutdownHook(new Thread(Xin::shutdown));
            init();
        } catch (Throwable t) {
            System.out.println("Fatal error: " + t.toString());
            t.printStackTrace();
        }
    }

    public static void init(Properties customProperties) {
        properties.putAll(customProperties);
        init();
    }

    public static void init() {
        Init.init();
    }

    public static void shutdown() {
        Logger.logShutdownMessage("Shutting down...");
        API.shutdown();
        FundingMonitor.shutdown();
        ThreadPool.shutdown();
        BlockchainProcessorImpl.getInstance().shutdown();
        Peers.shutdown();
        Db.shutdown();
        Logger.logShutdownMessage("Server " + VERSION + " stopped.");
        Logger.shutdown();
        runtimeMode.shutdown();
    }

    private static class Init {

        private static volatile boolean initialized = false;

        static {
            try {
                long startTime = System.currentTimeMillis();


                Logger.init();

                setSystemProperties();
                logSystemProperties();

                runtimeMode.init();

                Thread secureRandomInitThread = initSecureRandom();

                setServerStatus(ServerStatus.BEFORE_DATABASE, null);
                Db.init();
                setServerStatus(ServerStatus.AFTER_DATABASE, null);

                TransactionProcessorImpl.getInstance();
                BlockchainProcessorImpl.getInstance();
                Account.init();
                AccountRestrictions.init();

                AccountLedger.init();

                Alias.init();
                Asset.init();
                Hub.init();
                Order.init();
                Poll.init();
                PhasingPoll.init();
                Trade.init();

                AssetTransfer.init();
                AssetDelete.init();
                AssetDividend.init();

                Vote.init();
                PhasingVote.init();

                Currency.init();
                CurrencyBuyOffer.init();
                CurrencySellOffer.init();
                CurrencyFounder.init();
                // CurrencyMint.init();
                CurrencyTransfer.init();
                Exchange.init();
                ExchangeRequest.init();

                Shuffling.init();
                ShufflingParticipant.init();

                PrunableMessage.init();

                Peers.init();
                Generator.init();
                API.init();

                AT.init();

                Subscription.init();
                Escrow.init();

                DebugTrace.init();

                int timeMultiplier = (Constants.isOffline) ? Math.max(Xin.getIntProperty("xin.timeMultiplier"), 1) : 1;

                ThreadPool.start(timeMultiplier);

                if (timeMultiplier > 1) {
                    setTime(new Time.FasterTime(Math.max(getEpochTime(), Xin.getBlockchain().getLastBlock().getTimestamp()), timeMultiplier));
                    Logger.logMessage("TIME WILL FLOW " + timeMultiplier + " TIMES FASTER!");
                }

                try {
                    secureRandomInitThread.join(10000);
                } catch (InterruptedException ignore) {
                }

                testSecureRandom();

                long currentTime = System.currentTimeMillis();

                Logger.logMessage("Initialization took " + (currentTime - startTime) / 1000 + " seconds");
                Logger.logMessage("Node " + VERSION + " started successfully.");
                Logger.logMessage("Copyright © 2013-2016 The Nxt Core Developers.");
                Logger.logMessage("Copyright © 2016-2018 The XIN Community.");
                Logger.logMessage("Distributed under GPLv2, with ABSOLUTELY NO WARRANTY.");

            } catch (Exception e) {
                Logger.logErrorMessage(e.getMessage(), e);
                System.exit(1);
            }
        }

        private static void init() {
            if (initialized) {
                throw new RuntimeException("Init has already been called");
            }
            initialized = true;
        }

        private Init() {
        } // never

    }

    private static void setSystemProperties() {
        // Override system settings that the user has define in properties file.
        String[] systemProperties = new String[]{
                "socksProxyHost",
                "socksProxyPort",
        };

        for (String propertyName : systemProperties) {
            String propertyValue;
            if ((propertyValue = getStringProperty(propertyName)) != null) {
                System.setProperty(propertyName, propertyValue);
            }
        }
    }

    private static void logSystemProperties() {
        String[] loggedProperties = new String[]{
                "java.version",
                "java.vm.version",
                "java.vm.name",
                "java.vendor",
                "java.vm.vendor",
                "java.home",
                "java.library.path",
                "java.class.path",
                "os.arch",
                "sun.arch.data.model",
                "os.name",
                "file.encoding",
                "java.security.policy",
                "java.security.manager",
                RuntimeEnvironment.RUNTIME_MODE_ARG,
                RuntimeEnvironment.DIRPROVIDER_ARG
        };

    }

    private static Thread initSecureRandom() {
        Thread secureRandomInitThread = new Thread(() -> {
            Crypto.getSecureRandom().nextBytes(new byte[1024]);
        });
        secureRandomInitThread.setDaemon(true);
        secureRandomInitThread.start();
        return secureRandomInitThread;
    }

    private static void testSecureRandom() {
        Thread thread = new Thread(() -> {
            Crypto.getSecureRandom().nextBytes(new byte[1024]);
        });
        thread.setDaemon(true);
        thread.start();
        try {
            thread.join(2000);
            if (thread.isAlive()) {
                throw new RuntimeException("SecureRandom implementation too slow!!! " +
                        "Install haveged if on linux, or set xin.useStrongSecureRandom=false.");
            }
        } catch (InterruptedException ignore) {
        }
    }

    public static String getProcessId() {
        String runtimeName = ManagementFactory.getRuntimeMXBean().getName();
        if (runtimeName == null) {
            return "";
        }
        String[] tokens = runtimeName.split("@");
        if (tokens.length == 2) {
            return tokens[0];
        }
        return "";
    }

    public static String getDbDir(String dbDir) {
        return dirProvider.getDbDir(dbDir);
    }

    public static void updateLogFileHandler(Properties loggingProperties) {
        dirProvider.updateLogFileHandler(loggingProperties);
    }

    public static String getUserHomeDir() {
        return dirProvider.getUserHomeDir();
    }

    public static File getConfDir() {
        return dirProvider.getConfDir();
    }

    private static void setServerStatus(ServerStatus status, URI wallet) {
        runtimeMode.setServerStatus(status, wallet, dirProvider.getLogFileDir());
    }

    private Xin() {
    } // never

}
