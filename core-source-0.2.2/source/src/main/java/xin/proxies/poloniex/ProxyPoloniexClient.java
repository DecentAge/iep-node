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

package xin.proxies.poloniex;

import xin.Xin;
import xin.XinException;
import xin.proxies.ProxyClient;
import org.json.simple.JSONObject;
import retrofit2.Response;

public class ProxyPoloniexClient extends ProxyClient {

    private static final String POLONIEX_HOST_URL = Xin.getStringProperty("xin.proxy.poloniex.url");

    private static final String POLONIEX_QUOTE_COMMAND = "returnTicker";

    private PoloniexService poloniexService;

    public ProxyPoloniexClient() {
        super(POLONIEX_HOST_URL);
        poloniexService = retrofit.create(PoloniexService.class);
    }

    public JSONObject getPoloniexTicker() throws XinException.NotValidException {
        try {
            Response<JSONObject> jsonObjectResponse = poloniexService.getPoloniexQuote(POLONIEX_QUOTE_COMMAND).execute();
            JSONObject jsonObject = jsonObjectResponse.body();
            return jsonObject;
        } catch (Exception e) {
            throw new XinException.XinProxyServiceException(e.getMessage(), e);
        }
    }

}
