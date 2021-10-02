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

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.math.NumberUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import xin.Constants;
import xin.Db;
import xin.XinException;

public class GetDistributions extends APIServlet.APIRequestHandler {

    static final GetDistributions instance = new GetDistributions();

    private GetDistributions() {
        super(new APITag[]{APITag.ACCOUNTS}, "minAccountBalance", "maxAccountBalance", "slices");
    }
    
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
    	JSONObject response = new JSONObject();
    	Long startAmountTQT = ParameterParser.getLong(req, "minAccountBalance",0L, Constants.MAX_BALANCE_TQT, true);
    	Long endAmountTQT = ParameterParser.getLong(req, "maxAccountBalance", startAmountTQT + 1, Constants.MAX_BALANCE_TQT, true);
    	Long slices = ParameterParser.getLong(req, "slices", 0, Constants.MAX_BALANCE_TQT, true);
    	
    	if(slices < 3) slices = 3l;
    	if(slices > 20) slices = 20l;
    	
    	long distributionInterval = (endAmountTQT - startAmountTQT)/slices;
    	JSONArray distributionArray = retrieveFromDB(startAmountTQT, endAmountTQT, distributionInterval);
        response.put("distributions",distributionArray);
        return response;
    }

	private JSONArray retrieveFromDB(Long startAmountTQT, Long endAmountTQT, long distributionInterval) {
		String sql = "select count(id) as results from account where latest = true and balance between ? and ?";
    	JSONArray distributionArray=new JSONArray();
        try (Connection con = Db.db.getConnection()) {
            for (long i = startAmountTQT; i + distributionInterval <= endAmountTQT; i = i + distributionInterval) {
                long currentEndInterval = NumberUtils.min(i + distributionInterval, Constants.MAX_BALANCE_TQT, Long.MAX_VALUE);
                try (PreparedStatement preparedStatement = con.prepareStatement(sql)) {
                    preparedStatement.setLong(1, i);
                    preparedStatement.setLong(2, currentEndInterval);
                    try (ResultSet rs = preparedStatement.executeQuery()) {
                        if (rs.next()) {
                            JSONObject jsonObject          = new JSONObject();
                            float      currentDistribution = rs.getFloat("results");
                            jsonObject.put("from", i);
                            jsonObject.put("to", currentEndInterval);
                            jsonObject.put("accountsAmount", currentDistribution);
                            distributionArray.add(jsonObject);
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
		return distributionArray;
	}

}
