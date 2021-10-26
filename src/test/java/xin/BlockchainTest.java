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
import xin.util.Convert;
import xin.util.Logger;
import xin.util.Time;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.TestRule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;

import java.util.Properties;

public abstract class BlockchainTest extends AbstractBlockchainTest {

    @Rule
    public final TestRule watchman = new TestWatcher() {
        @Override
        protected void starting(Description description) {
            Logger.logMessage("Starting test " + description.toString());
        }

        @Override
        protected void finished(Description description) {
            Logger.logMessage("Finished test " + description.toString());
        }
    };

    protected static Tester FORGY;
    protected static Tester ALICE;
    protected static Tester BOB;
    protected static Tester CHUCK;
    protected static Tester DAVE;

    protected static int baseHeight;

    private static String forgerSecretPhrase = "aSykrgKGZNlSVOMDxkZZgbTvQqJPGtsBggb";
    private static final String forgerPublicKey = Convert.toHexString(Crypto.getPublicKey(forgerSecretPhrase));

    public static final String aliceSecretPhrase = "hope peace happen touch easy pretend worthless talk them indeed wheel state";
    private static final String bobSecretPhrase2 = "rshw9abtpsa2";
    private static final String chuckSecretPhrase = "eOdBVLMgySFvyiTy8xMuRXDTr45oTzB7L5J";
    private static final String daveSecretPhrase = "t9G2ymCmDsQij7VtYinqrbGCOAtDDA3WiNr";

    private static boolean isXinInitialized = false;
    private static boolean isRunInSuite = false;

    public static void initNxt() {
        if (!isXinInitialized) {
            Properties properties = ManualForgingTest.newTestProperties();
            properties.setProperty("xin.isTestnet", "true");
            properties.setProperty("xin.isOffline", "true");
            properties.setProperty("xin.enableFakeForging", "true");
            properties.setProperty("xin.fakeForgingPublicKeys", forgerPublicKey);
            properties.setProperty("xin.timeMultiplier", "1");
            properties.setProperty("xin.testnetGuaranteedBalanceConfirmations", "1");
            properties.setProperty("xin.testnetLeasingDelay", "1");
            properties.setProperty("xin.disableProcessTransactionsThread", "true");
            properties.setProperty("xin.deleteFinishedShufflings", "false");
            properties.setProperty("xin.disableSecurityPolicy", "true");
            properties.setProperty("xin.disableAdminPassword", "true");
            properties.setProperty("xin.testDbDir", "./nxt_unit_test_db/nxt");
            properties.setProperty("xin.isAutomatedTest", "true");
            properties.setProperty("xin.addOns", "nxt.addons.JPLSnapshot");
            AbstractBlockchainTest.init(properties);
            Logger.logMessage("Initialized Xin for unit testing.");
            isXinInitialized = true;
        }
    }
    
    /*public static void initNxt() {
        if (!isNxtInitialized) {
            Properties properties = ManualForgingTest.newTestProperties();
            properties.setProperty("nxt.isTestnet", "true");
            properties.setProperty("nxt.isOffline", "true");
            properties.setProperty("nxt.enableFakeForging", "true");
            properties.setProperty("nxt.fakeForgingPublicKeys", forgerPublicKey);
            properties.setProperty("nxt.timeMultiplier", "1");
            properties.setProperty("nxt.testnetGuaranteedBalanceConfirmations", "1");
            properties.setProperty("nxt.testnetLeasingDelay", "1");
            properties.setProperty("nxt.disableProcessTransactionsThread", "true");
            properties.setProperty("nxt.deleteFinishedShufflings", "false");
            properties.setProperty("nxt.disableSecurityPolicy", "true");
            properties.setProperty("nxt.disableAdminPassword", "true");
            properties.setProperty("nxt.testDbDir", "./nxt_unit_test_db/nxt");
            properties.setProperty("nxt.isAutomatedTest", "true");
            properties.setProperty("nxt.addOns", "nxt.addons.JPLSnapshot");
            AbstractBlockchainTest.init(properties);
            Logger.logMessage("Initialized Nxt for unit testing.");
            isNxtInitialized = true;
        }
    }*/
    
    @BeforeClass
    public static void init() {
        initNxt();
        Xin.setTime(new Time.CounterTime(Xin.getEpochTime()));

        baseHeight = blockchain.getHeight();
        Logger.logMessage("baseHeight: " + baseHeight);
    }

    @Before
    public final void setUp() {
        Logger.logMessage("Creating test accounts.");
        final long amountNQT = Constants.ONE_XIN * 1000000;
        FORGY = Tester.createAndAdd(forgerSecretPhrase, amountNQT);
        ALICE = Tester.createAndAdd(aliceSecretPhrase, amountNQT);
        BOB =   Tester.createAndAdd(bobSecretPhrase2, amountNQT);
        CHUCK = Tester.createAndAdd(chuckSecretPhrase, amountNQT);
        DAVE =  Tester.createAndAdd(daveSecretPhrase, amountNQT);

        Logger.logMessage("Created test accounts.");
    }

    public static void setIsRunInSuite(boolean isRunInSuite) {
        BlockchainTest.isRunInSuite = isRunInSuite;
    }

    @AfterClass
    public static void afterClass() {
        if (!isRunInSuite) {
            Logger.logMessage("@AfterClass - Xin.shutdown()");
            Xin.shutdown();
        }
    }

    @After
    public void tearDown() {
        Logger.logMessage("@After - clearing unconfirmed transactions and pop off to height " + baseHeight);
        TransactionProcessorImpl.getInstance().clearUnconfirmedTransactions();
        blockchainProcessor.popOffTo(baseHeight);
    }

    public static void generateBlock() {
        try {
            blockchainProcessor.generateBlock(forgerSecretPhrase, Xin.getEpochTime());
        } catch (BlockchainProcessor.BlockNotAcceptedException e) {
            throw new AssertionError(e);
        }
    }

    public static void generateBlocks(int howMany) {
        for (int i = 0; i < howMany; i++) {
            generateBlock();
        }
    }
}
