/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
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

package xin;

import xin.db.BasicDb;
import xin.db.TransactionalDb;

public final class Db {

    public static final String PREFIX = "xin.db";
    public static final TransactionalDb db = new TransactionalDb(new BasicDb.DbProperties()
            .maxCacheSize(Xin.getIntProperty("xin.dbCacheKB"))
            .dbUrl(Xin.getStringProperty(PREFIX + "Url"))
            .dbType(Xin.getStringProperty(PREFIX + "Type"))
            .dbDir(Xin.getStringProperty(PREFIX + "Dir"))
            .dbParams(Xin.getStringProperty(PREFIX + "Params"))
            .dbUsername(Xin.getStringProperty(PREFIX + "Username"))
            .dbPassword(Xin.getStringProperty(PREFIX + "Password", null, true))
            .maxConnections(Xin.getIntProperty("xin.maxDbConnections"))
            .loginTimeout(Xin.getIntProperty("xin.dbLoginTimeout"))
            .defaultLockTimeout(Xin.getIntProperty("xin.dbDefaultLockTimeout") * 1000)
            .maxMemoryRows( Xin.getIntProperty("xin.dbMaxMemoryRows") )
            // .maxOperationRows( Xin.getIntProperty("xin.dbMaxOperationRows") )  // speed up trim and prevent temp disk files
    );

    static void init() {
        db.init(new XinDbVersion());
    }

    static void shutdown() {
        db.shutdown();
    }

    private Db() {
    } // never

}
