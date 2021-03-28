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

import com.rethinkdb.RethinkDB;
import com.rethinkdb.gen.ast.Table;
import com.rethinkdb.net.Connection;
import xin.Xin;


public class RethinkDatabase {

    private static final String RETHINK_DB_HOST = Xin.getStringProperty("xin.storage.rethinkdb.url");
    private static final Integer RETHINK_DB_PORT = Xin.getIntProperty("xin.storage.rethinkdb.port");

    public static RethinkDB db = RethinkDB.r;

    public RethinkDB getDB() {
        return db;
    }

    public Connection getDBConnection() {
        return db.connection().hostname(RETHINK_DB_HOST).port(RETHINK_DB_PORT).connect();
    }

    public Table getTable(String database, String table) {
        return db.db(database).table(table);
    }
}
