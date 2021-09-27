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

import org.apache.commons.lang.math.NumberUtils;
import org.json.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import xin.*;
import xin.db.DbIterator;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GetAccountBalances extends APIServlet.APIRequestHandler {

    static final GetAccountBalances instance = new GetAccountBalances();

    private GetAccountBalances() {
        super(new APITag[]{APITag.ACCOUNTS}, "firstIndex", "lastIndex", "includeDistribution", "distributionStart",
                "distributionEnd", "interval","adminPassword");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

        int firstIndex = ParameterParser.getFirstIndex(req);
        try {
            firstIndex = firstIndex < 0 ? 0 : firstIndex;
            firstIndex = firstIndex > 91 ? 91 : firstIndex;
        } catch (NumberFormatException e) {
            firstIndex = 0;
        };
        int lastIndex = firstIndex + 10;
        
        boolean includeDistributions = "true".equalsIgnoreCase(req.getParameter("includeDistribution"));
        long startAmountTQT =
                ParameterParser.getLong(req, "distributionStart",0L, Constants.MAX_BALANCE_TQT, includeDistributions);
        long endAmountTQT = ParameterParser
                .getLong(req, "distributionEnd", startAmountTQT + 1, Constants.MAX_BALANCE_TQT, includeDistributions);

        long distributionInterval =
                ParameterParser.getLong(req, "interval", 100*Constants.ONE_XIN, Constants.MAX_BALANCE_TQT, includeDistributions);

        JSONObject response = new JSONObject();


        try (DbIterator<Account> accounts = Account.getAccountBalances(firstIndex, lastIndex)) {
            JSONArray accountsInfo = new JSONArray();
            if (accounts.hasNext()) {
                while (accounts.hasNext()) {
                    Account account = accounts.next();
                    accountsInfo.put(JSONData.accountBalance(account, true));
                }
            }
            response.put("balances", accountsInfo);
        }

        if (includeDistributions) {
            String sql = "select count(id) as results from account where latest = true and balance between ? and ?";
            JSONArray distributionArray=new JSONArray();
            try (Connection con = Db.db.getConnection()) {
                for (long i = startAmountTQT; i <= endAmountTQT; i = i + distributionInterval) {
                    long currentEndInterval =
                            NumberUtils.min(i + distributionInterval, Constants.MAX_BALANCE_TQT, Long.MAX_VALUE);
                    try (PreparedStatement preparedStatement = con.prepareStatement(sql)) {
                        preparedStatement.setLong(1, i);
                        preparedStatement.setLong(2, currentEndInterval);
                        try (ResultSet rs = preparedStatement.executeQuery()) {
                            if (rs.next()) {
                                JSONObject jsonObject          = new JSONObject();
                                float      currentDistribution = rs.getFloat("results");
                                jsonObject.put("distributionStart", i);
                                jsonObject.put("distributionEnd", currentEndInterval);
                                jsonObject.put("distribution", currentDistribution);
                                distributionArray.put(jsonObject);
                            }
                        } catch (SQLException se) {
                            throw new RuntimeException(se.getMessage(), se);
                        }
                    } catch (SQLException se) {
                        throw new RuntimeException(se.getMessage(), se);
                    }

                }
            } catch (SQLException e) {
                throw new RuntimeException(e.toString(), e);
            }
            response.put("distributions",distributionArray);
        }

        return response;
    }

}
