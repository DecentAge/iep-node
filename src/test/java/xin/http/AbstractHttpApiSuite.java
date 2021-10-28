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


import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;

import xin.BlockchainProcessor;
import xin.BlockchainTest;
import xin.Helper;
import xin.SafeShutdownSuite;
import xin.Xin;

public abstract class AbstractHttpApiSuite extends SafeShutdownSuite {
    @BeforeClass
    public static void init() {
        SafeShutdownSuite.safeSuiteInit();
        BlockchainTest.initNxt();
        Xin.getTransactionProcessor().clearUnconfirmedTransactions();
        Xin.getBlockchainProcessor().addListener(new Helper.BlockListener(), BlockchainProcessor.Event.BLOCK_GENERATED);
        Assert.assertEquals(0, Helper.getCount("unconfirmed_transaction"));
    }

    @AfterClass
    public static void shutdown() {
        Assert.assertEquals(0, Helper.getCount("unconfirmed_transaction"));
        SafeShutdownSuite.safeSuiteShutdown();
    }
}
