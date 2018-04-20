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

package xin.proxies.ripple;

import xin.Xin;
import xin.XinException;
import xin.proxies.ProxyClient;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import retrofit2.Response;

import java.util.Map;

public class ProxyRippleClient extends ProxyClient {

    private static final String RIPPLE_HOST_URL = Xin.getStringProperty("xin.proxy.xrp.url");

    private RippleService rippleService;

    public ProxyRippleClient() {
        super(RIPPLE_HOST_URL);
        rippleService = retrofit.create(RippleService.class);
    }

    public JSONObject getRippleBalance(Map<String, String[]> requestParams) throws XinException.NotValidException {
        String[] address = requestParams.get("address");
        if (CollectionUtils.sizeIsEmpty(address) || StringUtils.isEmpty(address[0])) {
            throw new XinException.NotValidException("Address parameter not specified");
        }
        try {
            Response<JSONObject> jsonObjectResponse = rippleService.getRippleBalance(address[0]).execute();
            JSONObject jsonObject = jsonObjectResponse.body();
            return jsonObject;
        } catch (Exception e) {
            throw new XinException.XinProxyServiceException(e.getMessage(), e);
        }
    }

}
