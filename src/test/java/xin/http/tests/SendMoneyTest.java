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

package xin.http.tests;

import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.Test;

import xin.BlockchainTest;
import xin.Constants;
import xin.http.utils.APICall;
import xin.util.Logger;

public class SendMoneyTest extends BlockchainTest {

    @Test
    public void sendMoney() {
        JSONObject response = new APICall.Builder("sendMoney").
                param("secretPhrase", ALICE.getSecretPhrase()).
                param("recipient", BOB.getStrId()).
                param("amountTQT", 100 * Constants.ONE_XIN).
                param("feeTQT", Constants.ONE_XIN).
                build().invokeNoError();
      
        Logger.logDebugMessage("sendMoney: " + response);
        // Forger
        Assert.assertEquals(0, FORGY.getBalanceDiff());
        Assert.assertEquals(0, FORGY.getUnconfirmedBalanceDiff());
        // Sender
        Assert.assertEquals(0, ALICE.getBalanceDiff());
        Assert.assertEquals(-100 * Constants.ONE_XIN - Constants.ONE_XIN, ALICE.getUnconfirmedBalanceDiff());
        // Recipient
        Assert.assertEquals(0, BOB.getBalanceDiff());
        Assert.assertEquals(0, BOB.getUnconfirmedBalanceDiff());
        
       	generateBlock();
       	generateBlock();
        
        // Forger
        Assert.assertEquals(Constants.ONE_XIN, FORGY.getBalanceDiff());
        Assert.assertEquals(Constants.ONE_XIN, FORGY.getUnconfirmedBalanceDiff());
        // Sender
        Assert.assertEquals(-100 * Constants.ONE_XIN - Constants.ONE_XIN, ALICE.getBalanceDiff());
        Assert.assertEquals(-100 * Constants.ONE_XIN - Constants.ONE_XIN, ALICE.getUnconfirmedBalanceDiff());
        // Recipient
        Assert.assertEquals(100 * Constants.ONE_XIN, BOB.getBalanceDiff());
        Assert.assertEquals(100 * Constants.ONE_XIN, BOB.getUnconfirmedBalanceDiff());
    }

   
}
