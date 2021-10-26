/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
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

package xin;

import java.util.*;

import xin.util.Convert;

public final class Constants {

    public static final boolean isOffline = Xin.getBooleanProperty("xin.isOffline");

    public static final int DEFAULT_PEER_PORT = Xin.getIntProperty("xin.defaultPeerPort");

    public static final int MAX_NUMBER_OF_TRANSACTIONS = Xin.getIntProperty("xin.maxTxBlock");
    public static final int MIN_TRANSACTION_SIZE = 176;
    public static final int MAX_PAYLOAD_LENGTH = MAX_NUMBER_OF_TRANSACTIONS * MIN_TRANSACTION_SIZE;

    public static final long MAX_SUPPLY_XIN_FACTOR = 9;
    public static final long MAX_BALANCE_XIN = MAX_SUPPLY_XIN_FACTOR * 1000000000L;

    public static final long ONE_XIN = 100000000L;
    public static final long MAX_BALANCE_TQT = MAX_BALANCE_XIN * ONE_XIN;

    public static final long INITIAL_BASE_TARGET = 17080318;

    public static final long MAX_BASE_TARGET = MAX_BALANCE_XIN * INITIAL_BASE_TARGET;
    public static final long MAX_BASE_TARGET_2 = INITIAL_BASE_TARGET * 50;
    public static final long MIN_BASE_TARGET = INITIAL_BASE_TARGET * 9 / 10;

    public static final int MIN_BLOCKTIME_LIMIT = Xin.getIntProperty("xin.minBlockTime");
    public static final int MAX_BLOCKTIME_LIMIT = Xin.getIntProperty("xin.maxBlocktime");
    public static final int BASE_TARGET_GAMMA = 64;
    public static final int MAX_ROLLBACK = Math.max(Xin.getIntProperty("xin.maxRollback"), 720);
    public static final int GUARANTEED_BALANCE_CONFIRMATIONS = 1440;
    public static final int LEASING_DELAY = 1440;
    public static final long MIN_FORGING_BALANCE_TQT = 1000 * ONE_XIN;

    public static final int MAX_TIMEDRIFT = 15;
    public static final int FORGING_DELAY = Xin.getIntProperty("xin.forgingDelay");
    public static final int FORGING_SPEEDUP = Xin.getIntProperty("xin.forgingSpeedup");
    public static final int BATCH_COMMIT_SIZE = Xin.getIntProperty("xin.batchCommitSize", 100);

    public static final byte MAX_PHASING_VOTE_TRANSACTIONS = 10;
    public static final byte MAX_PHASING_WHITELIST_SIZE = 10;
    public static final byte MAX_PHASING_LINKED_TRANSACTIONS = 10;
    public static final int MAX_PHASING_DURATION = 14 * 1440;
    public static final int MAX_PHASING_REVEALED_SECRET_LENGTH = 100;

    public static final int MAX_ALIAS_URI_LENGTH = 1000;
    public static final int MAX_ALIAS_LENGTH = 100;

    public static final int MAX_ARBITRARY_MESSAGE_LENGTH = 160;
    public static final int MAX_ENCRYPTED_MESSAGE_LENGTH = 160 + 16;

    public static final int MAX_PRUNABLE_MESSAGE_LENGTH = 42 * 1024;
    public static final int MAX_PRUNABLE_ENCRYPTED_MESSAGE_LENGTH = 42 * 1024;

    public static final int MIN_PRUNABLE_LIFETIME = 14 * 1440 * 60;
    public static final int MAX_PRUNABLE_LIFETIME;
    public static final boolean ENABLE_PRUNING;

    static {
        int maxPrunableLifetime = Xin.getIntProperty("xin.maxPrunableLifetime");
        ENABLE_PRUNING = maxPrunableLifetime >= 0;
        MAX_PRUNABLE_LIFETIME =
                ENABLE_PRUNING ? Math.max(maxPrunableLifetime, MIN_PRUNABLE_LIFETIME) : Integer.MAX_VALUE;
    }

    public static final boolean INCLUDE_EXPIRED_PRUNABLE = Xin.getBooleanProperty("xin.includeExpiredPrunable");

    public static final int MAX_ACCOUNT_NAME_LENGTH = 100;
    public static final int MAX_ACCOUNT_DESCRIPTION_LENGTH = 1000;

    public static final int MAX_ACCOUNT_PROPERTY_NAME_LENGTH = 32;
    public static final int MAX_ACCOUNT_PROPERTY_VALUE_LENGTH = 160;

    public static final long MAX_ASSET_QUANTITY_QNT = MAX_SUPPLY_XIN_FACTOR * 1000000000L * ONE_XIN;

    public static final int MIN_ASSET_NAME_LENGTH = 3;
    public static final int MAX_ASSET_NAME_LENGTH = 16;
    public static final int MAX_ASSET_DESCRIPTION_LENGTH = 1000;
    public static final int MAX_SINGLETON_ASSET_DESCRIPTION_LENGTH = 160;
    public static final int MAX_ASSET_TRANSFER_COMMENT_LENGTH = 1000;
    public static final int MAX_DIVIDEND_PAYMENT_ROLLBACK = 1441;

    public static final int MAX_DIVIDEND_PER_BLOCKS =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_MAX_DIVIDEND_PER_BLOCKS);

    public static final int MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT);

    public static final int MAX_POLL_NAME_LENGTH = 100;
    public static final int MAX_POLL_DESCRIPTION_LENGTH = 1000;
    public static final int MAX_POLL_OPTION_LENGTH = 100;
    public static final int MAX_POLL_OPTION_COUNT = 100;
    public static final int MAX_POLL_DURATION = 14 * 1440;

    public static final byte MIN_VOTE_VALUE = -92;
    public static final byte MAX_VOTE_VALUE = 92;
    public static final byte NO_VOTE_VALUE = Byte.MIN_VALUE;

    public static final int MAX_HUB_ANNOUNCEMENT_URIS = 100;
    public static final int MAX_HUB_ANNOUNCEMENT_URI_LENGTH = 1000;
    public static final long MIN_HUB_EFFECTIVE_BALANCE = 100000;

    public static final long MAX_CURRENCY_TOTAL_SUPPLY = MAX_SUPPLY_XIN_FACTOR * 1000000000L * ONE_XIN;

    public static final int MIN_CURRENCY_NAME_LENGTH = 3;
    public static final int MAX_CURRENCY_NAME_LENGTH = 16;
    public static final int MIN_CURRENCY_CODE_LENGTH = 3;
    public static final int MAX_CURRENCY_CODE_LENGTH = 6;
    public static final int MAX_CURRENCY_DESCRIPTION_LENGTH = 1000;

    public static final int MAX_MINTING_RATIO = 10000;

    public static final byte MIN_NUMBER_OF_SHUFFLING_PARTICIPANTS = 3;
    public static final byte MAX_NUMBER_OF_SHUFFLING_PARTICIPANTS = 30;
    public static final short MAX_SHUFFLING_REGISTRATION_PERIOD = (short) 1440 * 7;
    public static final short SHUFFLING_PROCESSING_DEADLINE = (short) 100;

    public static final long UNIT_FEE = Constants.ONE_XIN;
    public static final long BASE_SIZE = 32;

    public static final long FEE_SIX_LETTER_CURRENCY_ISSUANCE = 250 * UNIT_FEE;
    public static final long FEE_FIVE_LETTER_CURRENCY_ISSUANCE = 500 * UNIT_FEE;
    public static final long FEE_FOUR_LETTER_CURRENCY_ISSUANCE = 1000 * UNIT_FEE;
    public static final long FEE_THREE_LETTER_CURRENCY_ISSUANCE = 25000 * UNIT_FEE;
    
    public static final int TRANSPARENT_FORGING_BLOCK_5 = 67000;

    public static final long FEE_ALIAS_INITIAL_CONSTANT = 2 * UNIT_FEE;
    public static final long ALIAS_FEE_PER_UNIT = 2 * UNIT_FEE;
    public static final int SIZE_ALIAS_UNIT = 32;

    public static final long FEE_ASSET_INITIAL_CONSTANT = UNIT_FEE;
    public static final long ASSET_FEE_PER_UNIT = UNIT_FEE;
    public static final int SIZE_ASSET_UNIT = 32;

    public static final long FEE_NON_SINGLETON_ASSET_FEE = 1000 * UNIT_FEE;
    public static final long FEE_ASSETS_DIVIDENDS = 10 * UNIT_FEE; //new fee at block 655230

    public static final long FEE_POLL_OPTIONS_INITIAL_CONSTANT = 10 * UNIT_FEE;
    public static final long POLL_OPTIONS_FEE_PER_UNIT = UNIT_FEE;
    public static final int SIZE_POLL_OPTIONS_UNIT = 1;

    public static final long FEE_POLL_SIZE_INITIAL_CONSTANT = 0;
    public static final long POLL_SIZE_FEE_PER_UNIT = 2 * UNIT_FEE;
    public static final int SIZE_POLL_SIZE_UNIT = 32;

    public static final long FEE_ACCOUNT_INFO_INITIAL_CONSTANT = UNIT_FEE;
    public static final long ACCOUNT_INFO_FEE_PER_UNIT = 2 * UNIT_FEE;
    public static final int SIZE_ACCOUNT_INFO_UNIT = 32;

    public static final long FEE_AUTOMATED_TRANSACTION_CREATE_INITIAL_CONSTANT = 10 * UNIT_FEE;

    public static final long FEE_MESSAGE_INITIAL_CONSTANT = 0;
    public static final long MESSAGE_FEE_PER_UNIT = UNIT_FEE;
    public static final int SIZE_MESSAGE_UNIT = 32;

    public static final long FEE_ENCRYPTED_MESSAGE_INITIAL_CONSTANT = UNIT_FEE;
    public static final long ENCRYPTED_MESSAGE_FEE_PER_UNIT = UNIT_FEE;
    public static final int SIZE_ENCRYPTED_MESSAGE_UNIT = 32;

    public static final long FEE_ACCOUNT_PROPERTY_INITIAL_CONSTANT = UNIT_FEE;
    public static final long ACCOUNT_PROPERTY_FEE_PER_UNIT = UNIT_FEE;
    public static final int SIZE_ACCOUNT_PROPERTY_UNIT = 32;

    public static final long FEE_SHUFFLING_PROCESSING = 10 * UNIT_FEE;
    public static final long FEE_SHUFFLING_RECIPIENTS = 11 * UNIT_FEE;

    public static final long FEE_PRUNABLE_PLAIN_MESSAGE = UNIT_FEE / 10;
    public static final long FEE_PRUNABLE_ENCRYPTED_MESSAGE = UNIT_FEE / 10;

    public static final long FEE_PHASING_INITIAL_CONSTANT = UNIT_FEE;
    public static final long FEE_PHASING_VOTE_UNIT = 20 * UNIT_FEE;
    public static final long SIZE_PHASING_MESSAGE_UNIT = 32;

    public static final long FEE_ESCROW_CREATION = UNIT_FEE;
    public static final long MIN_FEE_ESCROW_SIGN = UNIT_FEE;

    public static final int EFFECTIVE_LEASING_BLOCK = 3000;
    public static final int EFFECTIVE_LEASING_OFFSET_BLOCK = 3000;

    public static final long EFFECTIVE_LEASING_MIN_BALANCE = 1000 * ONE_XIN;
    public static final int EFFECTIVE_LEASING_MAX_ACCOUNTS = 1000;
    public static final int EFFECTIVE_LEASING_MAX_BLOCKS = 65535;
    public static final long EFFECTIVE_LEASING_MAX_BALANCETQT = MAX_BALANCE_TQT / 10;


    public static final int TRANSPARENT_FORGING_BLOCK = 0;  // activation block
    public static final int HUB_ANNOUNCEMENT_BLOCK = Integer.MAX_VALUE; // activation block
    public static final int TQT_BLOCK = 1; // activation block
    public static final int NON_GENESIS_BLOCK_START_HEIGHT = 1; // activation block
    public static final int REFERENCED_TRANSACTION_FULL_HASH_BLOCK = 0; // activation block
    public static final int PHASING_BLOCK = 1; // activation block
    public static final int DIVIDEND_THROTTLE_BLOCK = 1; // activation block

    public static final int LAST_KNOWN_BLOCK_HEIGHT =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_LAST_KNOWN_BLOCK_HEIGHT);
    public static final int LAST_CHECKSUM_BLOCK_HEIGHT = LAST_KNOWN_BLOCK_HEIGHT;


    public static final boolean THROTTLE_ALIAS_ASSIGNMENT = true;
    public static final boolean THROTTLE_ASSET_ISSUANCE = true;
    public static final boolean THROTTLE_CURRENCY_ISSUANCE = true;
    public static final boolean THROTTLE_ACCOUNT_INFO = true;
    public static final boolean THROTTLE_POLL_CREATION = true;
    public static final boolean THROTTLE_AT_CREATION_BY_NAME = true;

    public static final boolean ALLOW_DUPLICATE_ASSE_NAME = false;

    public static final int REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP = 0;
    public static final int MAX_REFERENCED_TRANSACTION_TIMESPAN = 60 * 1440 * 60;

    public static final int[] MIN_VERSION = new int[]{0, 1};

    static final long UNCONFIRMED_POOL_DEPOSIT_TQT = 100 * ONE_XIN;
    public static final long SHUFFLING_DEPOSIT_TQT = 1000 * ONE_XIN;

    public static final boolean correctInvalidFees = Xin.getBooleanProperty("xin.correctInvalidFees");

    public static final long EPOCH_BEGINNING;

    public static final int ESCROW_MAX_NUM_OF_SIGNERS = 10;
    public static final int ESCROW_MIN_NUM_OF_SIGNERS = 1;

    public static final int SUBSCRIPTION_MIN_FREQ =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_SUBSCRIPTION_MIN_FREQ);

    public static final int SUBSCRIPTION_MAX_FREQ =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_SUBSCRIPTION_MAX_FREQ);

    public static final Map<Integer, BlockChecksum> BLOCK_CHECKSUMS =
            (Map<Integer, BlockChecksum>) ConstantsConfigHelper
                    .getProperty(ConstantsConfigHelper.PROPERTY_BLOCK_CHECKSUMS);

    public static final int MAX_AUTOMATED_TRANSACTION_NAME_LENGTH = 30;
    public static final int MAX_AUTOMATED_TRANSACTION_DESCRIPTION_LENGTH = 1000;
    public static final int AT_BLOCK_PAYLOAD = MAX_PAYLOAD_LENGTH / 2;

    // Block activation heights

    public static final int SHUFFLING_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_SHUFFLING_BLOCK);

    public static final int INCREASED_DIVI_PAYMENT_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK);

    public static final int SHUFFLING_ACTIVATION_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_SHUFFLING_ACTIVATION_BLOCK);

    public static final int SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK =
            (int) ConstantsConfigHelper
                    .getProperty(ConstantsConfigHelper.PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK);

    public static final int SUBSCRIPTION_START_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_SUBSCRIPTION_START_BLOCK);

    public static final int ESCROW_START_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_ESCROW_START_BLOCK);

    protected static final int AUTOMATED_TRANSACTION_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_AUTOMATED_TRANSACTION_BLOCK);

    public static final int AT_FIX_BLOCK_2 = AUTOMATED_TRANSACTION_BLOCK;
    public static final int AT_FIX_BLOCK_3 = AUTOMATED_TRANSACTION_BLOCK;
    public static final int AT_FIX_BLOCK_4 = AUTOMATED_TRANSACTION_BLOCK;

    public static final int ASSET_FULLDELETE_START_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_ASSET_FULLDELETE_START_BLOCK);
    // Needs additional table delete

    // Set locked block activation on chains
    public static final int LOCKED_BLOCK_MAX_VALUE =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_LOCKED_BLOCK_MAX_VALUE);

    // Bad blocks
    public static final int BAD_BLOCK_MAX_HEIGHT =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_BAD_BLOCK_MAX_HEIGHT);

    // Rollback
    public static final boolean ROLLBACK_TAG =
            (boolean) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_ROLLBACK_TAG);
    public static final Long ROLLBACK_BLOCK = Convert.parseUnsignedLong(
            (String) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_ROLLBACK_BLOCK));
    public static final int ROLLBACK_HEIGHT =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_ROLLBACK_HEIGHT);

    public static final int PRUNABLE_MESSAGES_BLOCK =
            (int) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_PRUNABLE_MESSAGES_BLOCK);

    static {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));

        calendar.set(Calendar.YEAR, 2017);
        calendar.set(Calendar.MONTH, Calendar.JANUARY);
        calendar.set(Calendar.DAY_OF_MONTH, 10);
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        EPOCH_BEGINNING = calendar.getTimeInMillis();
    }

    public static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
    public static final String ALLOWED_CURRENCY_CODE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static final int EC_RULE_TERMINATOR = 600;

    public static final int EC_BLOCK_DISTANCE_LIMIT = 60;

    /* List of Account ID's that are allowed to forge (or null to allow all) */
    public static final List<Long> allowedToForge;

    static {
        List<String> allowed = Xin.getStringListProperty("xin.allowedToForge");
        if (allowed.size() == 0) {
            allowedToForge = Collections.emptyList();
        } else if (allowed.size() == 1 && "*".equals(allowed.get(0))) {
            allowedToForge = null;
        } else {
            allowedToForge = new ArrayList<Long>();
            for (String account : allowed) {
                allowedToForge.add(Convert.parseAccountId(account));
            }
        }
    }

    // todo: accept accounts and public keys
    public static final List<String> LOCKED_ACCOUNTS_PUBLIC_KEYS = Xin.getStringListProperty("xin.lockedAccounts");

    private Constants() {
    } // never

}
