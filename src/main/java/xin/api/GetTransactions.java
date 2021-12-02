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
import xin.Xin;
import xin.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class GetTransactions extends APIServlet.APIRequestHandler {

    static final GetTransactions instance = new GetTransactions();

    private GetTransactions() {
        super(new APITag[]{APITag.TRANSACTIONS}, "firstIndex", "lastIndex");
    }

    @SuppressWarnings("unchecked")
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
        };

        JSONArray transactions = new JSONArray();

        try (

                Connection con = Db.db.getConnection();
                PreparedStatement pstmt = con.prepareStatement("SELECT * FROM TRANSACTION ORDER BY block_timestamp DESC LIMIT ? OFFSET ?")

        ) {

            pstmt.setInt(1, lastIndex);
            pstmt.setInt(2, firstIndex);

            try (ResultSet rs = pstmt.executeQuery()) {

                while (rs.next()) {

                    byte type = rs.getByte("type");
                    byte subtype = rs.getByte("subtype");
                    int timestamp = rs.getInt("timestamp");
                    short deadline = rs.getShort("deadline");
                    long amounTQT = rs.getLong("amount");
                    long feeTQT = rs.getLong("fee");
                    byte[] signature = rs.getBytes("signature");
                    long blockId = rs.getLong("block_id");
                    int height = rs.getInt("height");
                    long id = rs.getLong("id");
                    long senderId = rs.getLong("sender_id");
                    long recipientId = rs.getLong("RECIPIENT_ID");
                    int blockTimestamp = rs.getInt("block_timestamp");
                    byte[] fullHash = rs.getBytes("full_hash");
                    boolean phased = rs.getBoolean("phased");
                    boolean message = rs.getBoolean("has_message");
                    String senderRS = Convert.rsAccount(senderId);
                    String recipientRS = Convert.rsAccount(recipientId);

                    JSONObject transaction = new JSONObject();

                    transaction.put("type", type);
                    transaction.put("subtype", subtype);
                    transaction.put("height", height);
                    transaction.put("timestamp", timestamp);
                    transaction.put("deadline", deadline);
                    transaction.put("amountTQT", amounTQT);
                    transaction.put("feeTQT", feeTQT);
                    transaction.put("blockId", Long.toUnsignedString(blockId));
                    transaction.put("Id", Long.toUnsignedString(id));
                    transaction.put("senderId", Long.toUnsignedString(senderId));

                    if (recipientId == 0) {

                        transaction.put("recipientId", "");
                        transaction.put("recipientRS", "");

                    } else {

                        transaction.put("recipientId", Long.toUnsignedString(recipientId));
                        transaction.put("recipientRS", recipientRS);

                    };

                    transaction.put("confirmations", Xin.getBlockchain().getHeight() - height);
                    transaction.put("blockTimestamp", blockTimestamp);
                    transaction.put("fullHash", Convert.toHexString(fullHash));
                    transaction.put("phased", phased);
                    transaction.put("message", message);

                    transaction.put("senderRS", senderRS);

                    transactions.add(transaction);
                }

            } catch (SQLException e) {
                throw new RuntimeException(e.toString(), e);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e.toString(), e);
        }

        JSONObject response = new JSONObject();

        response.put("transactions", transactions);

        return response;

    }

}
