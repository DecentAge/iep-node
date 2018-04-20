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
import org.apache.commons.compress.utils.IOUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


public class GetNodeServices extends APIServlet.APIRequestHandler {

    static final GetNodeServices instance = new GetNodeServices();

    private GetNodeServices() {
        super(new APITag[]{APITag.SERVICES});
        this.parser = new JSONParser();
    }

    private JSONParser parser;

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest request) throws XinException {
        JSONObject jsonObject = null;
        InputStream in = ClassLoader.getSystemResourceAsStream("services.json");

        if (in != null) {
            try {
                Object object = parser.parse(new InputStreamReader(in));
                jsonObject = (JSONObject) object;

            } catch (IOException | ParseException ie) {
                throw new XinException.StopException(ie.getMessage(), ie);
            } finally {
                IOUtils.closeQuietly(in);
            }
        }
        if (jsonObject == null) {
            jsonObject = new JSONObject();
            jsonObject.put("services","");
        }
        return jsonObject;
    }

    private boolean isProxyAvailable() {
        return Xin.getBooleanProperty("xin.proxy.eth.enable"); 
    }

}
