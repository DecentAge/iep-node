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

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import xin.*;
import xin.db.DbIterator;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

import static xin.ConstantsConfigHelper.*;

public class GetActivationHeights extends APIServlet.APIRequestHandler {

    static final GetActivationHeights instance = new GetActivationHeights();

    private static final List<String> ACTIVATION_HEIGHTS_NAMES_LIST = Arrays.asList(
            PROPERTY_AUTOMATED_TRANSACTION_BLOCK,
            PROPERTY_SUBSCRIPTION_START_BLOCK,
            PROPERTY_ESCROW_START_BLOCK,
            PROPERTY_SHUFFLING_BLOCK,
            PROPERTY_ASSET_FULLDELETE_START_BLOCK,
            PROPERTY_LOCKED_BLOCK_MAX_VALUE,
            PROPERTY_BAD_BLOCK_MAX_HEIGHT,
            PROPERTY_ROLLBACK_HEIGHT,
            PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK,
            PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK,
            PROPERTY_SHUFFLING_ACTIVATION_BLOCK,
            PROPERTY_PRUNABLE_MESSAGES_BLOCK, PROPERTY_CROWD_FUNDING_BLOCK,
            PROPERTY_FUNDING_MONITOR_BLOCK);

    private GetActivationHeights() {
        super(new APITag[]{APITag.UTILS}, "name");
    }

    @SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

        JSONObject response = new JSONObject();

        List<String> requiredHeights = ParameterParser.getStringList(req, "name", false);
        if (CollectionUtils.isEmpty(requiredHeights)) {
            requiredHeights = ACTIVATION_HEIGHTS_NAMES_LIST;
        }

        requiredHeights.forEach(name -> {
            response.put(name, ConstantsConfigHelper.getProperty(name));
        });
        return response;
    }

}
