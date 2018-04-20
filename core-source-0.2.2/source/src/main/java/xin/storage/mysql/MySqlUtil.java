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

package xin.storage.mysql;

import xin.XinException;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class MySqlUtil {


    public static JSONObject pingMySqlDb(MySqlDb db) {
        Connection con = db.getMysqlConnection();
        Statement statement = null;
        ResultSet rs = null;
        JSONObject jsonObject = new JSONObject();
        try {
            statement = con.createStatement();
            rs = statement.executeQuery(MySQlQueries.MYSQL_PING_QUERY);
            while (rs.next()) {
                jsonObject.put("pingSuccesfull", rs.getBoolean(1));
            }
            return jsonObject;
        } catch (Exception e) {
            throw new XinException.XinStorageException(e.getMessage(), e);
        } finally {
            MySqlDb.closeSilently(rs);
            MySqlDb.closeSilently(statement);
            MySqlDb.closeSilently(con);
        }
    }


    static class MySQlQueries {
        public static final String MYSQL_PING_QUERY = "/* ping */ SELECT 1";
    }
}
