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
import xin.storage.mongo.MongoDBUtil;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public final class StorageMongoDB extends APIServlet.APIRequestHandler {

    static final StorageMongoDB instance = new StorageMongoDB();

    private StorageMongoDB() {
        super(new APITag[]{APITag.STORAGE});
    }

    private static final Boolean GATEWAY_SUPPORTED = Xin.getBooleanProperty("xin.storage.mongodb.enable");
    private static final String COMMAND_DB_PING = "dbPing";

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest request) throws XinException {

        if (!isStorageAvailable()) {
            throw new XinException.XinProxyServiceException("Mongo DB not available");
        }
        String command = request.getParameter("command");
        if (StringUtils.isEmpty(command)) {
            throw new XinException.NotValidException("command parameter cannot be empty for accessing proxy");
        }
        Map<String, String[]> requestParams = request.getParameterMap();
        JSONObject jsonObject;
        switch (command) {
            case COMMAND_DB_PING:
                jsonObject = MongoDBUtil.pingMongoDb();
                break;
            default:
                throw new XinException.NotValidException(String.format("Command %s is not supported", command));
        }
        if (jsonObject == null) {
            jsonObject = new JSONObject();
        }
        jsonObject.put("mongoDbAvailable", true);
        return jsonObject;

    }

    private boolean isStorageAvailable() {
      return Xin.getBooleanProperty("xin.storage.mongodb.enable");
    }

}
