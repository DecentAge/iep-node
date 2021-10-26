/*
 * Copyright © 2013-2016 The Nxt Core Developers.
 * Copyright © 2016-2020 Jelurida IP B.V.
 *
 * See the LICENSE.txt file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,
 * no part of the Nxt software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE.txt file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

package xin.http;

import xin.Account;
import xin.BlockchainTest;
import xin.Constants;
import xin.crypto.Crypto;
import xin.crypto.EncryptedData;
import xin.http.nxt.APICall;
import xin.util.Convert;
import xin.util.Logger;
import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.Test;

public class SendMessageTest extends BlockchainTest {

    @Test
    public void sendMessage() {
        JSONObject response = new APICall.Builder("sendMessage").
                param("secretPhrase", ALICE.getSecretPhrase()).
                param("recipient", BOB.getStrId()).
                param("message", "hello world").
                param("feeTQT", Constants.ONE_XIN).
                build().invoke();
        
        System.out.println("Hello first test *************************** ");
       
        String transaction = (String) response.get("transaction");
        
        JSONObject attachment = (JSONObject) ((JSONObject)response.get("transactionJSON")).get("attachment");
        Assert.assertEquals("hello world", attachment.get("message"));
        
        generateBlock();
        
        response = new APICall.Builder("readMessage").
                param("secretPhrase", BOB.getSecretPhrase()).
                param("transaction", transaction).
                build().invoke();
        Logger.logDebugMessage("readMessage: " + response);
        Assert.assertEquals("hello world", response.get("message"));
    }

    
}
