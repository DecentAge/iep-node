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

package xin.storage.mongo;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import xin.Xin;

public class MongoDB {

    private static final String MONGODB_URL = Xin.getStringProperty("xin.storage.mongodb.url");
    private static final String MONGODB_DATABASE = Xin.getStringProperty("xin.storage.mongodb.database");

    private static MongoClient mongoClient;

    private static MongoDatabase mongoDb;

    public static MongoDatabase getMongoDb() {
        if (mongoClient == null) {
            mongoClient = new MongoClient(MONGODB_URL);
        }
        if (mongoDb == null) {
            mongoDb = mongoClient.getDatabase(MONGODB_DATABASE);
        }
        return mongoDb;
    }
}
