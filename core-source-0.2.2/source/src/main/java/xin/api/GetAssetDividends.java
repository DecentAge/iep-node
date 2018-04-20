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

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import xin.AssetDividend;
import xin.XinException;
import xin.db.DbIterator;
import xin.util.Logger;

import javax.servlet.http.HttpServletRequest;


public class GetAssetDividends extends APIServlet.APIRequestHandler {

    static final GetAssetDividends instance = new GetAssetDividends();

    private GetAssetDividends() {
        super(new APITag[] {APITag.AE}, "asset", "firstIndex", "lastIndex", "timestamp");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException{

        long assetId = ParameterParser.getUnsignedLong(req, "asset", false);
        int timestamp = ParameterParser.getTimestamp(req);
        int firstIndex = ParameterParser.getFirstIndex(req);
        int lastIndex = ParameterParser.getLastIndex(req);

        JSONObject response = new JSONObject();
        JSONArray dividendsData = new JSONArray();
        try (DbIterator<AssetDividend> dividends = AssetDividend.getAssetDividends(assetId, firstIndex, lastIndex)) {
            while (dividends.hasNext()) {
                AssetDividend assetDividend = dividends.next();

                if (assetDividend.getTimestamp() < timestamp) {
                    break;
                }
                dividendsData.add(JSONData.assetDividend(assetDividend));
            }
        }
        response.put("dividends", dividendsData);
        return response;
    }

}
