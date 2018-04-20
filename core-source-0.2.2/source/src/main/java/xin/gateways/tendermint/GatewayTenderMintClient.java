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


package xin.gateways.tendermint;

import xin.Xin;
import xin.XinException;
import xin.proxies.ProxyClient;
import org.json.simple.JSONObject;
import retrofit2.Response;


public class GatewayTenderMintClient extends ProxyClient {

    private static final String TENDER_MINT_ENDPOINT = Xin.getStringProperty("xin.gateway.tendermint.address");

    private TenderMintService tenderMintService;

    public GatewayTenderMintClient() {
        super(TENDER_MINT_ENDPOINT);
        tenderMintService = retrofit.create(TenderMintService.class);
    }

    public JSONObject getTenderMintStatus() {
        try {
            Response<JSONObject> jsonObjectResponse = tenderMintService.getTenderMintStatus().execute();
            JSONObject jsonObject = jsonObjectResponse.body();
            return jsonObject;
        } catch (Exception e) {
            throw new XinException.XinProxyServiceException(e.getMessage(), e);
        }
    }
}
