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

import xin.Db;
import xin.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class GetAccounts extends APIServlet.APIRequestHandler {

    static final GetAccounts instance = new GetAccounts();

    private GetAccounts() {
        super(new APITag[]{APITag.ACCOUNTS}, "firstIndex", "lastIndex");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {

        int firstIndex = 0;
        int lastIndex = 11;

        try {

            firstIndex = ParameterParser.getFirstIndex(req);

            if (firstIndex < 0) {
                firstIndex = 0;
            }

        } catch (NumberFormatException e) {
            firstIndex = 0;
        }
        ;

        try {

            lastIndex = ParameterParser.getLastIndex(req);

            lastIndex = (lastIndex - firstIndex) + 1;

            if (lastIndex < 0) {
                lastIndex = 11;
            }
            ;
            if (lastIndex > 101) {
                lastIndex = 101;
            }

        } catch (NumberFormatException e) {
            lastIndex = 11;
        }
        ;

        JSONArray accounts = new JSONArray();

        try (

                Connection con = Db.db.getConnection();
                PreparedStatement pstmt = con.prepareStatement("SELECT * FROM ACCOUNT_INFO WHERE LATEST = TRUE ORDER BY HEIGHT DESC LIMIT ? OFFSET ?")

        ) {

            pstmt.setInt(1, lastIndex);
            pstmt.setInt(2, firstIndex);

            try (ResultSet rs = pstmt.executeQuery()) {

                while (rs.next()) {

                    long accountId = rs.getLong("ACCOUNT_ID");
                    String accountRS = Convert.rsAccount(accountId);
                    String accountName = rs.getString("NAME");
                    String accountDescription = rs.getString("DESCRIPTION");

                    JSONObject account = new JSONObject();

                    account.put("accountRS", accountRS);
                    account.put("accountName", accountName);
                    account.put("accountDescription", accountDescription);

                    accounts.add(account);
                }

            } catch (SQLException e) {
                throw new RuntimeException(e.toString(), e);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e.toString(), e);
        }

        JSONObject response = new JSONObject();

        response.put("accounts", accounts);

        return response;

    }

}
