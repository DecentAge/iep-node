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
import xin.XinException;
import xin.gateways.ipfs.GatewayIpfsClient;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


public class GatewayIpfs extends APIServlet.APIRequestHandler {

    static final GatewayIpfs instance = new GatewayIpfs();

    private static final String COMMAND_GET_FILE_CCONTENT = "xGetFileContent";

    private static final String IPFS_AVAILABLE = Xin.getStringProperty("xin.gateway.ipfs.enable");

    private GatewayIpfs() {
        super(new APITag[]{APITag.GATEWAYS});
        gatewayIpfsClient = new GatewayIpfsClient();
    }

    private GatewayIpfsClient gatewayIpfsClient;

    @SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest request) throws XinException {
        if (!isGatewayAvailable()) {
            throw new XinException.XinProxyServiceException("IPFS gateway not available");
        }
        String command = request.getParameter("command");
        if (StringUtils.isEmpty(command)) {
            throw new XinException.NotValidException("command parameter cannot be empty for accessing gateway");
        }
        Map<String, String[]> requestParams = request.getParameterMap();
        JSONObject jsonObject;
        switch (command) {
            case COMMAND_GET_FILE_CCONTENT:
                jsonObject = gatewayIpfsClient.getFileContent(requestParams);
                break;
            default:
                throw new XinException.NotValidException(String.format("Command %s is not supported", command));
        }
        if (jsonObject == null) {
            jsonObject = new JSONObject();
        }
        jsonObject.put("ipfsAvailable", true);
        return jsonObject;
    }

    private boolean isGatewayAvailable() {
        return Xin.getBooleanProperty("xin.gateway.ipfs.enable"); 
    }

}
