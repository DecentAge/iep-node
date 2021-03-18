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

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.json.simple.JSONObject;

import java.util.Map;


public class MongoDBUtil {

    public static JSONObject pingMongoDb() {
        MongoDatabase database = MongoDB.getMongoDb();
        Document stats = database.runCommand(new Document("dbstats", 1));
        JSONObject response = new JSONObject();
        for (Map.Entry<String, Object> stat : stats.entrySet()) {
            response.put(stat.getKey(), stat.getValue());
        }
        return response;
    }
}
