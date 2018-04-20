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
import xin.db.SortClause;
import xin.db.SortType;
import xin.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class GetAliasesPublicOffers extends APIServlet.APIRequestHandler {

    static final GetAliasesPublicOffers instance = new GetAliasesPublicOffers();

    private GetAliasesPublicOffers() {
        super(new APITag[]{APITag.ALIASES}, "firstIndex", "lastIndex");
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

        String order = ParameterParser.getSortOrder(req, SortType.ALIAS_PUBLIC_OFFERS);
        String orderColumn = ParameterParser.getSortColumn(req, SortType.ALIAS_PUBLIC_OFFERS);

        SortClause sortClause = new SortClause(orderColumn, order);

        String sql = "SELECT ALIAS.id, ALIAS.account_id, ALIAS.alias_name, ALIAS_OFFER.price, ALIAS.timestamp FROM ALIAS_OFFER " +
                "INNER JOIN ALIAS ON ALIAS_OFFER.id = ALIAS.id " + "WHERE ALIAS_OFFER.buyer_id IS NULL " +
                "AND ALIAS_OFFER.latest = TRUE AND ALIAS.latest = TRUE " + sortClause.getClause() + " LIMIT ? " +
                "OFFSET ?";

        JSONArray aliases = new JSONArray();

        try (
                Connection con = Db.db.getConnection();
                PreparedStatement pstmt = con.prepareStatement(sql);
        ) {

            // add order and sort

            pstmt.setInt(1, lastIndex);
            pstmt.setInt(2, firstIndex);

            try (ResultSet rs = pstmt.executeQuery()) {

                while (rs.next()) {

                    long accountId = rs.getLong("account_id");
                    long aliasId = rs.getLong("id");
                    String accountRS = Convert.rsAccount(accountId);
                    String name = rs.getString("alias_name");
                    long price = rs.getLong("price");

                    JSONObject alias = new JSONObject();

                    alias.put("senderId", Long.toUnsignedString(accountId));
                    alias.put("senderRS", accountRS);
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
