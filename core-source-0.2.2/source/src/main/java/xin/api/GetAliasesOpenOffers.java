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

public final class GetAliasesOpenOffers extends APIServlet.APIRequestHandler {

    static final GetAliasesOpenOffers instance = new GetAliasesOpenOffers();

    private GetAliasesOpenOffers() {
        super(new APITag[]{APITag.ALIASES}, "account", "firstIndex", "lastIndex");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws ParameterException {

        int firstIndex = 0;
        int lastIndex = 11;

        try {

            firstIndex = ParameterParser.getFirstIndex(req);

            if (firstIndex < 0) {
                firstIndex = 0;
            }

        } catch (NumberFormatException e) {
            firstIndex = 0;
        };

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
        };

        long accountId = ParameterParser.getAccountId(req, true);

        String sql = "SELECT ALIAS.id, ALIAS.account_id, ALIAS.alias_name, ALIAS_OFFER.price, ALIAS.timestamp, ALIAS_OFFER.buyer_id FROM ALIAS_OFFER " +
                     "LEFT JOIN ALIAS ON ALIAS_OFFER.id = ALIAS.id " +
                     "WHERE ALIAS.account_id = ? " +
                     "AND ALIAS_OFFER.latest = TRUE AND ALIAS.latest = TRUE ORDER BY ALIAS.height DESC LIMIT ? OFFSET ?";

        JSONArray aliases = new JSONArray();

        try (
                Connection con = Db.db.getConnection();
                PreparedStatement pstmt = con.prepareStatement(sql);
        ) {

          pstmt.setLong(1, accountId);
          pstmt.setInt(2, lastIndex);
          pstmt.setInt(3, firstIndex);

            try (ResultSet rs = pstmt.executeQuery()) {

                while (rs.next()) {

                  long aliasId = rs.getLong("id");
                  long senderId = rs.getLong("account_id");
                  String senderRS = Convert.rsAccount(senderId);

                  long recipientId = rs.getLong("buyer_id");
                  String recipientRS = Convert.rsAccount(recipientId);

                  String name = rs.getString("alias_name");
                  long price = rs.getLong("price");

                  JSONObject alias = new JSONObject();

                  alias.put("senderId", Long.toUnsignedString(senderId));
                  alias.put("senderRS", senderRS);

                  alias.put("recipientId", Long.toUnsignedString(recipientId));
                  alias.put("recipientRS", recipientRS);

                  alias.put("aliasName", name);
                  alias.put("priceTQT", price);
                  alias.put("aliasId", Long.toUnsignedString(aliasId));

                  aliases.add(alias);
                }

            } catch (SQLException e) {
                throw new RuntimeException(e.toString(), e);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e.toString(), e);
        }

        JSONObject response = new JSONObject();

        response.put("aliases", aliases);

        return response;

    }
}
