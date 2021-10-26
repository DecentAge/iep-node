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

import java.util.Properties;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import xin.*;

public class FakeForgingTest extends AbstractForgingTest {

    @Before
    public void init() {
        Properties properties = AbstractForgingTest.newTestProperties();
        properties.setProperty("nxt.disableGenerateBlocksThread", "false");
        properties.setProperty("nxt.enableFakeForging", "true");
        properties.setProperty("nxt.timeMultiplier", "1");
        AbstractForgingTest.init(properties);
        Assert.assertNotNull("nxt.fakeForgingPublicKeys must be defined in nxt.properties",
                             Xin.getStringProperty("nxt.fakeForgingPublicKeys"));
    }

    @Test
    public void fakeForgingTest() {
        forgeTo(startHeight + 10, testForgingSecretPhrase);
    }

    @After
    public void destroy() {
        AbstractForgingTest.shutdown();
    }

}
