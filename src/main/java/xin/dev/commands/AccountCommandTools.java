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

package xin.dev.commands;

import org.json.simple.JSONObject;
import xin.Account;
import xin.crypto.Crypto;
import xin.util.Convert;

public class AccountCommandTools {

    public String accountDetails(final String secret) {
        JSONObject jsonObject = new JSONObject();
        long accountId = Account.getId(Crypto.getPublicKey(secret));
        String accountRs = Convert.rsAccount(accountId);
        jsonObject.put("accountId",Long.toUnsignedString(accountId));
        jsonObject.put("accountRs",accountRs);
        jsonObject.put("publicKey", Convert.toHexString(Crypto.getPublicKey(secret)));
        return jsonObject.toJSONString();
    }

    public String simple(final String secret) {
        return secret;
    }
}
