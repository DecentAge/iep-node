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

package xin.proxies.litecoin;

import xin.Xin;
import xin.XinException;
import xin.proxies.ProxyClient;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import retrofit2.Response;

import java.util.Map;


public class ProxyLiteCoinClient extends ProxyClient {

    private static final String LITECOIN_HOST_URL = Xin.getStringProperty("xin.proxy.ltc.url");

    private LiteCoinService liteCoinService;

    public ProxyLiteCoinClient() {
        super(LITECOIN_HOST_URL);
        liteCoinService = retrofit.create(LiteCoinService.class);
    }

    public JSONObject getLiteCoinBalance(Map<String, String[]> requestParams) throws XinException.NotValidException {
        String[] address = requestParams.get("address");
        if (CollectionUtils.sizeIsEmpty(address) || StringUtils.isEmpty(address[0])) {
            throw new XinException.NotValidException("Address parameter not specified");
        }
        try {
            Response<JSONObject> jsonObjectResponse = liteCoinService.getLiteCoinBalance(address[0]).execute();
            JSONObject jsonObject = jsonObjectResponse.body();
            return jsonObject;
        } catch (Exception e) {
            throw new XinException.XinProxyServiceException(e.getMessage(), e);
        }
    }
}
