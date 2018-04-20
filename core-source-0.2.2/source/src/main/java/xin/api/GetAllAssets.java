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

package xin.api;

import xin.Asset;
import xin.db.DbIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import xin.db.SortClause;
import xin.db.SortType;

import javax.servlet.http.HttpServletRequest;

public final class GetAllAssets extends APIServlet.APIRequestHandler {

    static final GetAllAssets instance = new GetAllAssets();

    private GetAllAssets() {
        super(new APITag[]{APITag.AE}, "firstIndex", "lastIndex", "includeCounts");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {

        int firstIndex = ParameterParser.getFirstIndex(req);
        int lastIndex = ParameterParser.getLastIndex(req);
        String order=ParameterParser.getSortOrder(req, SortType.ASSET);
        String orderColumn=ParameterParser.getSortColumn(req,SortType.ASSET);

        boolean includeCounts = "true".equalsIgnoreCase(req.getParameter("includeCounts"));

        JSONObject response = new JSONObject();
        JSONArray assetsJSONArray = new JSONArray();
        response.put("assets", assetsJSONArray);
        try (DbIterator<Asset> assets = Asset.getAllAssets(firstIndex, lastIndex,new SortClause(orderColumn,order))) {
            while (assets.hasNext()) {
                assetsJSONArray.add(JSONData.asset(assets.next(), includeCounts));
            }
        }
        return response;
    }

}
