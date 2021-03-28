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

package xin.storage.rethink;

import com.google.gson.Gson;
import com.rethinkdb.gen.ast.Table;
import com.rethinkdb.net.Connection;
import com.rethinkdb.net.Cursor;
import org.json.simple.JSONObject;


public class RethinkDbUtil {

    private static final Gson gson = new Gson();

    public static JSONObject pingDb() {
        JSONObject jsonObject = new JSONObject();
        RethinkDatabase database = new RethinkDatabase();
        Connection connection = database.getDBConnection();
        Table table = database.getTable("rethinkdb", "stats");
        Cursor cursor = table.run(connection);
        String json = gson.toJson(cursor.next());
        jsonObject.put("stats", gson.fromJson(json, JSONObject.class));
        return jsonObject;
    }
}
