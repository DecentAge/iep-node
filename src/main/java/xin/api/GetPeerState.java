/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
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

import xin.Xin;
import xin.peer.Peers;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;

public final class GetPeerState extends APIServlet.APIRequestHandler {

    static final GetPeerState instance = new GetPeerState();

    private GetPeerState() {
        super(new APITag[]{APITag.INFO}, "includeCounts", "adminPassword");
    }

    static final OperatingSystemMXBean mbean = ManagementFactory.getOperatingSystemMXBean();

    ThreadMXBean threadMXBean = java.lang.management.ManagementFactory.getThreadMXBean();
    RuntimeMXBean runtimeMXBean = java.lang.management.ManagementFactory.getRuntimeMXBean();

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {

        JSONObject response = GetBlockchainStatus.instance.processRequest(req);

        response.put("numberOfPeers", Peers.getAllPeers().size());
        response.put("numberOfActivePeers", Peers.getActivePeers().size());
        response.put("useWebsocket", Xin.getBooleanProperty("xin.useWebSockets"));

        response.put("apiServerEnable", Xin.getBooleanProperty("xin.enableAPIServer"));
        response.put("apiServerPort", Xin.getIntProperty("xin.apiServerPort"));
        response.put("apiServerSSLPort", Xin.getIntProperty("xin.apiServerSSLPort"));
        response.put("apiServerIdleTimeout", Xin.getIntProperty("xin.apiServerIdleTimeout"));

        response.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        response.put("maxMemory", Runtime.getRuntime().maxMemory());
        response.put("totalMemory", Runtime.getRuntime().totalMemory());
        response.put("freeMemory", Runtime.getRuntime().freeMemory());
        response.put("SystemLoadAverage", mbean.getSystemLoadAverage());
        response.put("Uptime", runtimeMXBean.getUptime());
        response.put("ThreadCount", threadMXBean.getThreadCount());
        response.put("osArch", mbean.getArch());
        response.put("osName", mbean.getName());
        response.put("osVersion", mbean.getVersion());
        response.put("enableHallmarkProtection", Xin.getBooleanProperty("xin.enableHallmarkProtection"));
        response.put("myHallmark", Xin.getStringProperty("xin.myHallmark"));
        response.put("myAddress", Xin.getStringProperty("xin.myAddress"));
        response.put("myPlatform", Xin.getStringProperty("xin.myPlatform"));
        response.put("correctInvalidFees", Xin.getBooleanProperty("xin.correctInvalidFees"));
        response.put("maxUploadFileSize", Xin.getIntProperty("xin.maxUploadFileSize"));
        response.put("apiSSL", Xin.getBooleanProperty("xin.apiSSL"));
        response.put("apiServerCORS", Xin.getBooleanProperty("xin.apiServerCORS"));
        response.put("maxUnconfirmedTransactions", Xin.getIntProperty("xin.maxUploadFileSize"));

        response.put("gatewayTendermint", Xin.getBooleanProperty("xin.gateway.tendermint.enable"));
        response.put("gatewayZeroNet", Xin.getBooleanProperty("xin.gateway.zeronet.enable"));
        response.put("gatewayIPFS", Xin.getBooleanProperty("xin.gateway.ipfs.enable"));

        response.put("storageMySQL", Xin.getBooleanProperty("xin.storage.mysql.enable"));
        response.put("storagePSQL", Xin.getBooleanProperty("xin.storage.psql.enable"));
        response.put("storageRethink", Xin.getBooleanProperty("xin.storage.rethinkdb.enable"));
        response.put("storageMongodb", Xin.getBooleanProperty("xin.storage.mongodb.enable"));

        response.put("proxyBTC", Xin.getBooleanProperty("xin.proxy.btc.enable"));
        response.put("proxyXRP", Xin.getBooleanProperty("xin.proxy.xrp.enable"));
        response.put("proxyETH", Xin.getBooleanProperty("xin.proxy.eth.enable"));
        response.put("proxyLTC", Xin.getBooleanProperty("xin.proxy.ltc.enable"));

        response.put("proxyMarket", Xin.getBooleanProperty("xin.proxy.market.enable"));

        return response;

    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

}
