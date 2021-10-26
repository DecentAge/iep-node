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

package xin;

import xin.*;
import xin.crypto.Crypto;
import xin.util.Time;

import org.junit.Assert;
import org.junit.Test;

import java.util.Properties;

public class ManualForgingTest extends AbstractForgingTest {

    @Test
    public void manualForgingTest() {
        Properties properties = ManualForgingTest.newTestProperties();
        properties.setProperty("nxt.enableFakeForging", "true");
        properties.setProperty("nxt.timeMultiplier", "1");
        AbstractForgingTest.init(properties);
        Assert.assertNotNull("nxt.fakeForgingPublicKeys must be defined in nxt.properties",
                             Xin.getStringProperty("nxt.fakeForgingPublicKeys"));
        final byte[] testPublicKey = Crypto.getPublicKey(testForgingSecretPhrase);
        Xin.setTime(new Time.CounterTime(Xin.getEpochTime()));
        try {
            for (int i = 0; i < 10; i++) {
                blockchainProcessor.generateBlock(testForgingSecretPhrase, Xin.getEpochTime());
                Assert.assertArrayEquals(testPublicKey, blockchain.getLastBlock().getGeneratorPublicKey());
            }
        } catch (BlockchainProcessor.BlockNotAcceptedException e) {
            throw new RuntimeException(e.toString(), e);
        }
        Assert.assertEquals(startHeight + 10, blockchain.getHeight());
        AbstractForgingTest.shutdown();
    }

}
