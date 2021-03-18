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
import org.springframework.shell.core.CommandMarker;
import org.springframework.shell.core.annotation.CliAvailabilityIndicator;
import org.springframework.shell.core.annotation.CliCommand;
import org.springframework.shell.core.annotation.CliOption;
import org.springframework.stereotype.Component;
import xin.Account;
import xin.crypto.Crypto;
import xin.util.Convert;

import java.util.logging.Logger;



@Component
public class AccountCommandTools implements CommandMarker {

    private static final String ACCOUNT_SHELL_COMMAND = "xAccount";
    private static final String SPACE_CHAR = " ";

    private static final String ACCOUNT_DETAILS_FROM_SECRET = ACCOUNT_SHELL_COMMAND + SPACE_CHAR + "details";

    @CliAvailabilityIndicator({ACCOUNT_DETAILS_FROM_SECRET})
    public boolean isSimpleAvailable() {
        //always available
        return true;
    }

    // Long.toUnsignedString(longId));

    @CliCommand(value = ACCOUNT_DETAILS_FROM_SECRET, help = "Will print account details from secret")
    public String accountDetails(
            @CliOption(key = {"secret"}, mandatory = true, help = "The secret from which account to be calculated") final String secret) {
        JSONObject jsonObject = new JSONObject();
        long accountId = Account.getId(Crypto.getPublicKey(secret));
        String accountRs = Convert.rsAccount(accountId);
        jsonObject.put("accountId",Long.toUnsignedString(accountId));
        jsonObject.put("accountRs",accountRs);
        jsonObject.put("publicKey", Convert.toHexString(Crypto.getPublicKey(secret)));
        return jsonObject.toJSONString();
    }

    @CliCommand(value = "test", help = "Will print account details from secret")
    public String simple(
            @CliOption(key = {"secret"}, mandatory = true, help = "The secret from which account to be calculated") final String secret) {
        return secret;
    }
}
