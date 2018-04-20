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

import xin.Account.ControlType;
import xin.AccountLedger.LedgerEvent;
import xin.Attachment.AbstractAttachment;
import xin.XinException.ValidationException;
import xin.VoteWeighting.VotingModel;
import xin.at.AT_Constants;
import xin.at.AT_Controller;
import xin.at.AT_Exception;
import xin.db.DbIterator;
import xin.util.Convert;
import org.json.simple.JSONObject;

import java.nio.ByteBuffer;
import java.util.*;

public abstract class TransactionType {

    public static final byte TYPE_PAYMENT = 0;
    public static final byte TYPE_MESSAGING = 1;
    public static final byte TYPE_COLORED_COINS = 2;
    public static final byte TYPE_ACCOUNT_CONTROL = 4;
    public static final byte TYPE_MONETARY_SYSTEM = 5;
    public static final byte TYPE_SHUFFLING = 7;

    private static final byte TYPE_ADVANCED_PAYMENT = 21;
    private static final byte TYPE_AUTOMATED_TRANSACTIONS = 22;

    private static final byte SUBTYPE_PAYMENT_ORDINARY_PAYMENT = 0;

    private static final byte SUBTYPE_MESSAGING_ARBITRARY_MESSAGE = 0;
    private static final byte SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT = 1;
    private static final byte SUBTYPE_MESSAGING_POLL_CREATION = 2;
    private static final byte SUBTYPE_MESSAGING_VOTE_CASTING = 3;
    private static final byte SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT = 4;
    private static final byte SUBTYPE_MESSAGING_ACCOUNT_INFO = 5;
    private static final byte SUBTYPE_MESSAGING_ALIAS_SELL = 6;
    private static final byte SUBTYPE_MESSAGING_ALIAS_BUY = 7;
    private static final byte SUBTYPE_MESSAGING_ALIAS_DELETE = 8;
    private static final byte SUBTYPE_MESSAGING_PHASING_VOTE_CASTING = 9;
    private static final byte SUBTYPE_MESSAGING_ACCOUNT_PROPERTY = 10;
    private static final byte SUBTYPE_MESSAGING_ACCOUNT_PROPERTY_DELETE = 11;

    private static final byte SUBTYPE_COLORED_COINS_ASSET_ISSUANCE = 0;
    private static final byte SUBTYPE_COLORED_COINS_ASSET_TRANSFER = 1;
    private static final byte SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT = 2;
    private static final byte SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT = 3;
    private static final byte SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION = 4;
    private static final byte SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION = 5;
    private static final byte SUBTYPE_COLORED_COINS_DIVIDEND_PAYMENT = 6;
    private static final byte SUBTYPE_COLORED_COINS_ASSET_DELETE = 7;
    private static final byte SUBTYPE_COLORED_COINS_ASSET_COMPLETE_DELETE = 8;

    private static final byte SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;
    private static final byte SUBTYPE_ACCOUNT_CONTROL_PHASING_ONLY = 1;

    private static final byte SUBTYPE_ADVANCED_PAYMENT_ESCROW_CREATION = 0;
    private static final byte SUBTYPE_ADVANCED_PAYMENT_ESCROW_SIGN = 1;
    private static final byte SUBTYPE_ADVANCED_PAYMENT_ESCROW_RESULT = 2;
    private static final byte SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_SUBSCRIBE = 3;
    private static final byte SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_CANCEL = 4;
    private static final byte SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_PAYMENT = 5;

    private static final byte SUBTYPE_AT_CREATION = 0;
    private static final byte SUBTYPE_AT_PAYMENT = 1;


    public static TransactionType findTransactionType(byte type, byte subtype) {
        switch (type) {
            case TYPE_PAYMENT:
                switch (subtype) {
                    case SUBTYPE_PAYMENT_ORDINARY_PAYMENT:
                        return Payment.ORDINARY;
                    default:
                        return null;
                }
            case TYPE_MESSAGING:
                switch (subtype) {
                    case SUBTYPE_MESSAGING_ARBITRARY_MESSAGE:
                        return Messaging.ARBITRARY_MESSAGE;
                    case SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT:
                        return Messaging.ALIAS_ASSIGNMENT;
                    case SUBTYPE_MESSAGING_POLL_CREATION:
                        return Messaging.POLL_CREATION;
                    case SUBTYPE_MESSAGING_VOTE_CASTING:
                        return Messaging.VOTE_CASTING;
                    case SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT:
                        return Messaging.HUB_ANNOUNCEMENT;
                    case SUBTYPE_MESSAGING_ACCOUNT_INFO:
                        return Messaging.ACCOUNT_INFO;
                    case SUBTYPE_MESSAGING_ALIAS_SELL:
                        return Messaging.ALIAS_SELL;
                    case SUBTYPE_MESSAGING_ALIAS_BUY:
                        return Messaging.ALIAS_BUY;
                    case SUBTYPE_MESSAGING_ALIAS_DELETE:
                        return Messaging.ALIAS_DELETE;
                    case SUBTYPE_MESSAGING_PHASING_VOTE_CASTING:
                        return Messaging.PHASING_VOTE_CASTING;
                    case SUBTYPE_MESSAGING_ACCOUNT_PROPERTY:
                        return Messaging.ACCOUNT_PROPERTY;
                    case SUBTYPE_MESSAGING_ACCOUNT_PROPERTY_DELETE:
                        return Messaging.ACCOUNT_PROPERTY_DELETE;
                    default:
                        return null;
                }
            case TYPE_COLORED_COINS:
                switch (subtype) {
                    case SUBTYPE_COLORED_COINS_ASSET_ISSUANCE:
                        return ColoredCoins.ASSET_ISSUANCE;
                    case SUBTYPE_COLORED_COINS_ASSET_TRANSFER:
                        return ColoredCoins.ASSET_TRANSFER;
                    case SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT:
                        return ColoredCoins.ASK_ORDER_PLACEMENT;
                    case SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT:
                        return ColoredCoins.BID_ORDER_PLACEMENT;
                    case SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION:
                        return ColoredCoins.ASK_ORDER_CANCELLATION;
                    case SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION:
                        return ColoredCoins.BID_ORDER_CANCELLATION;
                    case SUBTYPE_COLORED_COINS_DIVIDEND_PAYMENT:
                        return ColoredCoins.DIVIDEND_PAYMENT;
                    case SUBTYPE_COLORED_COINS_ASSET_DELETE:
                        return ColoredCoins.ASSET_DELETE;
                    case SUBTYPE_COLORED_COINS_ASSET_COMPLETE_DELETE:
                        return ColoredCoins.ASSET_COMPLETE_DELETE;
                    default:
                        return null;
                }
            case TYPE_ACCOUNT_CONTROL:
                switch (subtype) {
                    case SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING:
                        return TransactionType.AccountControl.EFFECTIVE_BALANCE_LEASING;
                    case SUBTYPE_ACCOUNT_CONTROL_PHASING_ONLY:
                        return TransactionType.AccountControl.SET_PHASING_ONLY;
                    default:
                        return null;
                }
            case TYPE_MONETARY_SYSTEM:
                return MonetarySystem.findTransactionType(subtype);
            case TYPE_SHUFFLING:
                return ShufflingTransaction.findTransactionType(subtype);
            case TYPE_ADVANCED_PAYMENT:
                switch (subtype) {
                    case SUBTYPE_ADVANCED_PAYMENT_ESCROW_CREATION:
                        return AdvancedPayment.ESCROW_CREATION;
                    case SUBTYPE_ADVANCED_PAYMENT_ESCROW_SIGN:
                        return AdvancedPayment.ESCROW_SIGN;
                    case SUBTYPE_ADVANCED_PAYMENT_ESCROW_RESULT:
                        return AdvancedPayment.ESCROW_RESULT;
                    case SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_SUBSCRIBE:
                        return AdvancedPayment.SUBSCRIPTION_SUBSCRIBE;
                    case SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_CANCEL:
                        return AdvancedPayment.SUBSCRIPTION_CANCEL;
                    case SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_PAYMENT:
                        return AdvancedPayment.SUBSCRIPTION_PAYMENT;
                    default:
                        return null;
                }
            case TYPE_AUTOMATED_TRANSACTIONS:
                switch (subtype) {
                    case SUBTYPE_AT_CREATION:
                        return AutomatedTransactions.AUTOMATED_TRANSACTION_CREATION;
                    case SUBTYPE_AT_PAYMENT:
                        return AutomatedTransactions.AT_PAYMENT;
                    default:
                        return null;
                }
            default:
                return null;
        }
    }


    TransactionType() {
    }

    public abstract byte getType();

    public abstract byte getSubtype();

    public abstract LedgerEvent getLedgerEvent();

    abstract Attachment.AbstractAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion)
            throws XinException.NotValidException;

    abstract Attachment.AbstractAttachment parseAttachment(JSONObject attachmentData)
            throws XinException.NotValidException;

    abstract void validateAttachment(Transaction transaction) throws XinException.ValidationException;

    // return false iff double spending
    final boolean applyUnconfirmed(TransactionImpl transaction, Account senderAccount) {
        long amountTQT = transaction.getAmountTQT();
        long feeTQT    = transaction.getFeeTQT();

        if (transaction.referencedTransactionFullHash() != null
                && transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
            feeTQT = Math.addExact(feeTQT, Constants.UNCONFIRMED_POOL_DEPOSIT_TQT);
        }

        long totalAmountTQT = Math.addExact(amountTQT, feeTQT);
        if (senderAccount.getUnconfirmedBalanceTQT() < totalAmountTQT
                && !(transaction.getTimestamp() == 0 &&
                Arrays.equals(transaction.getSenderPublicKey(), Genesis.CREATOR_PUBLIC_KEY))) {
            return false;
        }
        senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(), -amountTQT, -feeTQT);
        if (!applyAttachmentUnconfirmed(transaction, senderAccount)) {
            senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(), amountTQT, feeTQT);
            return false;
        }
        return true;
    }

    abstract boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount);

    final void apply(TransactionImpl transaction, Account senderAccount, Account recipientAccount) {
        long amount        = transaction.getAmountTQT();
        long transactionId = transaction.getId();
        if (!transaction.attachmentIsPhased()) {
            senderAccount.addToBalanceTQT(getLedgerEvent(), transactionId, -amount, -transaction.getFeeTQT());
        } else {
            senderAccount.addToBalanceTQT(getLedgerEvent(), transactionId, -amount);
        }
        if (recipientAccount != null) {
            recipientAccount.addToBalanceAndUnconfirmedBalanceTQT(getLedgerEvent(), transactionId, amount);
        }
        applyAttachment(transaction, senderAccount, recipientAccount);
    }

    abstract void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount);

    final void undoUnconfirmed(TransactionImpl transaction, Account senderAccount) {
        undoAttachmentUnconfirmed(transaction, senderAccount);
        senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(),
                transaction.getAmountTQT(), transaction.getFeeTQT());
        if (transaction.referencedTransactionFullHash() != null
                && transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
            senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(), 0,
                    Constants.UNCONFIRMED_POOL_DEPOSIT_TQT);
        }
    }

    abstract void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount);


    boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
        return false;
    }

    // isBlockDuplicate and isDuplicate share the same duplicates map, but isBlockDuplicate check is done first
    boolean isBlockDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
        return false;
    }

    boolean isUnconfirmedDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
        return false;
    }

    static boolean isDuplicate(TransactionType uniqueType, String key,
                               Map<TransactionType, Map<String, Integer>> duplicates, boolean exclusive) {
        return isDuplicate(uniqueType, key, duplicates, exclusive ? 0 : Integer.MAX_VALUE);
    }

    static boolean isDuplicate(TransactionType uniqueType, String key,
                               Map<TransactionType, Map<String, Integer>> duplicates, int maxCount) {
        Map<String, Integer> typeDuplicates = duplicates.get(uniqueType);
        if (typeDuplicates == null) {
            typeDuplicates = new HashMap<>();
            duplicates.put(uniqueType, typeDuplicates);
        }
        Integer currentCount = typeDuplicates.get(key);
        if (currentCount == null) {
            typeDuplicates.put(key, maxCount > 0 ? 1 : 0);
            return false;
        }
        if (currentCount == 0) {
            return true;
        }
        if (currentCount < maxCount) {
            typeDuplicates.put(key, currentCount + 1);
            return false;
        }
        return true;
    }

    boolean isPruned(long transactionId) {
        return false;
    }

    public abstract boolean canHaveRecipient();

    public boolean isSigned() {
        return true;
    }

    public boolean mustHaveRecipient() {
        return canHaveRecipient();
    }

    public abstract boolean isPhasingSafe();

    public boolean isPhasable() {
        return true;
    }

    Fee getBaselineFee(Transaction transaction) {
        return Fee.DEFAULT_FEE;
    }

    Fee getNextFee(Transaction transaction) {
        return getBaselineFee(transaction);
    }

    int getBaselineFeeHeight() {
        return Constants.SHUFFLING_BLOCK;
    }

    int getNextFeeHeight() {
        return Integer.MAX_VALUE;
    }

    long[] getBackFees(Transaction transaction) {
        return Convert.EMPTY_LONG;
    }

    public abstract String getName();

    @Override
    public final String toString() {
        return getName() + " type: " + getType() + ", subtype: " + getSubtype();
    }

    public static abstract class Payment extends TransactionType {

        private Payment() {
        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_PAYMENT;
        }

        @Override
        final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            return true;
        }

        @Override
        final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
            if (recipientAccount == null) {
                Account.getAccount(Genesis.CREATOR_ID).addToBalanceAndUnconfirmedBalanceTQT(getLedgerEvent(),
                        transaction.getId(), transaction.getAmountTQT());
            }
        }

        @Override
        final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
        }

        @Override
        public final boolean canHaveRecipient() {
            return true;
        }

        @Override
        public final boolean isPhasingSafe() {
            return true;
        }

        public static final TransactionType ORDINARY = new Payment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
            }

            @Override
            public final LedgerEvent getLedgerEvent() {
                return LedgerEvent.ORDINARY_PAYMENT;
            }

            @Override
            public String getName() {
                return "OrdinaryPayment";
            }

            @Override
            Attachment.EmptyAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return Attachment.ORDINARY_PAYMENT;
            }

            @Override
            Attachment.EmptyAttachment parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return Attachment.ORDINARY_PAYMENT;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                if (transaction.getAmountTQT() <= 0 || transaction.getAmountTQT() >= Constants.MAX_BALANCE_TQT) {
                    throw new XinException.NotValidException("Invalid ordinary payment");
                }
            }

        };

    }

    public static abstract class Messaging extends TransactionType {

        private Messaging() {
        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_MESSAGING;
        }

        @Override
        final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            return true;
        }

        @Override
        final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
        }

        public final static TransactionType ARBITRARY_MESSAGE = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ARBITRARY_MESSAGE;
            }

            @Override
            public String getName() {
                return "ArbitraryMessage";
            }

            @Override
            Attachment.EmptyAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return Attachment.ARBITRARY_MESSAGE;
            }

            @Override
            Attachment.EmptyAttachment parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return Attachment.ARBITRARY_MESSAGE;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment attachment = transaction.getAttachment();
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException(
                            "Invalid arbitrary message: " + attachment.getJSONObject());
                }

                if (transaction.getRecipientId() == Genesis.CREATOR_ID &&
                        Xin.getBlockchain().getHeight() > Constants.NON_GENESIS_BLOCK_START_HEIGHT) {

                    throw new XinException.NotValidException("Sending messages to Genesis not allowed.");
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean mustHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public static final TransactionType ALIAS_ASSIGNMENT = new Messaging() {

            private final Fee ALIAS_FEE =
                    new Fee.SizeBasedFee(Constants.FEE_ALIAS_INITIAL_CONSTANT, Constants.ALIAS_FEE_PER_UNIT,
                            Constants.SIZE_ALIAS_UNIT) {
                        @Override
                        public int getSize(TransactionImpl transaction, Appendix appendage) {
                            Attachment.MessagingAliasAssignment attachment =
                                    (Attachment.MessagingAliasAssignment) transaction.getAttachment();
                            return attachment.getAliasName().length() + attachment.getAliasURI().length();
                        }
                    };

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ALIAS_ASSIGNMENT;
            }

            @Override
            public String getName() {
                return "AliasAssignment";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return ALIAS_FEE;
            }

            @Override
            Attachment.MessagingAliasAssignment parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasAssignment(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAliasAssignment parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasAssignment(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingAliasAssignment attachment =
                        (Attachment.MessagingAliasAssignment) transaction.getAttachment();
                Alias.addOrUpdateAlias(transaction, attachment);
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.MessagingAliasAssignment attachment =
                        (Attachment.MessagingAliasAssignment) transaction.getAttachment();
                return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates,
                        true);
            }

            @Override
            boolean isBlockDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {

                if (Constants.THROTTLE_ALIAS_ASSIGNMENT) {

                    return Alias.getAlias(
                            ((Attachment.MessagingAliasAssignment) transaction.getAttachment()).getAliasName()) == null
                            && isDuplicate(Messaging.ALIAS_ASSIGNMENT, "", duplicates, true);

                } else {
                    return false;
                }

            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.MessagingAliasAssignment attachment =
                        (Attachment.MessagingAliasAssignment) transaction.getAttachment();
                if (attachment.getAliasName().length() == 0
                        || attachment.getAliasName().length() > Constants.MAX_ALIAS_LENGTH
                        || attachment.getAliasURI().length() > Constants.MAX_ALIAS_URI_LENGTH) {
                    throw new XinException.NotValidException("Invalid alias assignment: " + attachment.getJSONObject());
                }
                String normalizedAlias = attachment.getAliasName().toLowerCase();
                for (int i = 0; i < normalizedAlias.length(); i++) {
                    if (Constants.ALPHABET.indexOf(normalizedAlias.charAt(i)) < 0) {
                        throw new XinException.NotValidException("Invalid alias name: " + normalizedAlias);
                    }
                }
                Alias alias = Alias.getAlias(normalizedAlias);
                if (alias != null && alias.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotCurrentlyValidException(
                            "Alias already owned by another account: " + normalizedAlias);
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public static final TransactionType ALIAS_SELL = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ALIAS_SELL;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ALIAS_SELL;
            }

            @Override
            public String getName() {
                return "AliasSell";
            }

            @Override
            Attachment.MessagingAliasSell parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasSell(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAliasSell parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasSell(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingAliasSell attachment = (Attachment.MessagingAliasSell) transaction.getAttachment();
                Alias.sellAlias(transaction, attachment);
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.MessagingAliasSell attachment = (Attachment.MessagingAliasSell) transaction.getAttachment();
                // not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
                return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates,
                        true);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException("Invalid sell alias transaction: " +
                            transaction.getJSONObject());
                }
                final Attachment.MessagingAliasSell attachment =
                        (Attachment.MessagingAliasSell) transaction.getAttachment();
                final String aliasName = attachment.getAliasName();
                if (aliasName == null || aliasName.length() == 0) {
                    throw new XinException.NotValidException("Missing alias name");
                }
                long priceTQT = attachment.getPriceTQT();
                if (priceTQT < 0 || priceTQT > Constants.MAX_BALANCE_TQT) {
                    throw new XinException.NotValidException("Invalid alias sell price: " + priceTQT);
                }
                if (priceTQT == 0) {
                    if (Genesis.CREATOR_ID == transaction.getRecipientId()) {
                        throw new XinException.NotValidException("Transferring aliases to Genesis account not allowed");
                    } else if (transaction.getRecipientId() == 0) {
                        throw new XinException.NotValidException("Missing alias transfer recipient");
                    }
                }
                final Alias alias = Alias.getAlias(aliasName);
                if (alias == null) {
                    throw new XinException.NotCurrentlyValidException("No such alias: " + aliasName);
                } else if (alias.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotCurrentlyValidException("Alias doesn't belong to sender: " + aliasName);
                }
                if (transaction.getRecipientId() == Genesis.CREATOR_ID) {
                    throw new XinException.NotValidException("Selling alias to Genesis not allowed");
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean mustHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public static final TransactionType ALIAS_BUY = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ALIAS_BUY;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ALIAS_BUY;
            }

            @Override
            public String getName() {
                return "AliasBuy";
            }

            @Override
            Attachment.MessagingAliasBuy parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasBuy(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAliasBuy parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasBuy(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                final Attachment.MessagingAliasBuy attachment =
                        (Attachment.MessagingAliasBuy) transaction.getAttachment();
                final String aliasName = attachment.getAliasName();
                Alias.changeOwner(transaction.getSenderId(), aliasName);
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.MessagingAliasBuy attachment = (Attachment.MessagingAliasBuy) transaction.getAttachment();
                // not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
                return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates,
                        true);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                final Attachment.MessagingAliasBuy attachment =
                        (Attachment.MessagingAliasBuy) transaction.getAttachment();
                final String aliasName = attachment.getAliasName();
                final Alias  alias     = Alias.getAlias(aliasName);
                if (alias == null) {
                    throw new XinException.NotCurrentlyValidException("No such alias: " + aliasName);
                } else if (alias.getAccountId() != transaction.getRecipientId()) {
                    throw new XinException.NotCurrentlyValidException("Alias is owned by account other than recipient: "
                            + Long.toUnsignedString(alias.getAccountId()));
                }
                Alias.Offer offer = Alias.getOffer(alias);
                if (offer == null) {
                    throw new XinException.NotCurrentlyValidException("Alias is not for sale: " + aliasName);
                }
                if (transaction.getAmountTQT() < offer.getPriceTQT()) {
                    String msg = "Price is too low for: " + aliasName + " ("
                            + transaction.getAmountTQT() + " < " + offer.getPriceTQT() + ")";
                    throw new XinException.NotCurrentlyValidException(msg);
                }
                if (offer.getBuyerId() != 0 && offer.getBuyerId() != transaction.getSenderId()) {
                    throw new XinException.NotCurrentlyValidException("Wrong buyer for " + aliasName + ": "
                            + Long.toUnsignedString(transaction.getSenderId()) + " expected: "
                            + Long.toUnsignedString(offer.getBuyerId()));
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public static final TransactionType ALIAS_DELETE = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ALIAS_DELETE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ALIAS_DELETE;
            }

            @Override
            public String getName() {
                return "AliasDelete";
            }

            @Override
            Attachment.MessagingAliasDelete parseAttachment(final ByteBuffer buffer, final byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasDelete(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAliasDelete parseAttachment(final JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAliasDelete(attachmentData);
            }

            @Override
            void applyAttachment(final Transaction transaction, final Account senderAccount,
                                 final Account recipientAccount) {
                final Attachment.MessagingAliasDelete attachment =
                        (Attachment.MessagingAliasDelete) transaction.getAttachment();
                Alias.deleteAlias(attachment.getAliasName());
            }

            @Override
            boolean isDuplicate(final Transaction transaction,
                                final Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.MessagingAliasDelete attachment =
                        (Attachment.MessagingAliasDelete) transaction.getAttachment();
                // not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
                return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates,
                        true);
            }

            @Override
            void validateAttachment(final Transaction transaction) throws XinException.ValidationException {
                final Attachment.MessagingAliasDelete attachment =
                        (Attachment.MessagingAliasDelete) transaction.getAttachment();
                final String aliasName = attachment.getAliasName();
                if (aliasName == null || aliasName.length() == 0) {
                    throw new XinException.NotValidException("Missing alias name");
                }
                final Alias alias = Alias.getAlias(aliasName);
                if (alias == null) {
                    throw new XinException.NotCurrentlyValidException("No such alias: " + aliasName);
                } else if (alias.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotCurrentlyValidException("Alias doesn't belong to sender: " + aliasName);
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public final static TransactionType POLL_CREATION = new Messaging() {

            private final Fee POLL_OPTIONS_FEE = new Fee.SizeBasedFee(Constants.FEE_POLL_OPTIONS_INITIAL_CONSTANT,
                    Constants.POLL_OPTIONS_FEE_PER_UNIT, Constants.SIZE_POLL_OPTIONS_UNIT) {
                @Override
                public int getSize(TransactionImpl transaction, Appendix appendage) {
                    int numOptions = ((Attachment.MessagingPollCreation) appendage).getPollOptions().length;
                    return numOptions <= 19 ? 0 : numOptions - 19;
                }
            };

            private final Fee POLL_SIZE_FEE =
                    new Fee.SizeBasedFee(Constants.FEE_POLL_SIZE_INITIAL_CONSTANT, Constants.POLL_SIZE_FEE_PER_UNIT,
                            Constants.SIZE_POLL_SIZE_UNIT) {
                        @Override
                        public int getSize(TransactionImpl transaction, Appendix appendage) {
                            Attachment.MessagingPollCreation attachment = (Attachment.MessagingPollCreation) appendage;
                            int size =
                                    attachment.getPollName().length() + attachment.getPollDescription().length();
                            for (String option : ((Attachment.MessagingPollCreation) appendage).getPollOptions()) {
                                size += option.length();
                            }
                            return size <= 288 ? 0 : size - 288;
                        }
                    };

            private final Fee POLL_FEE = (transaction, appendage) ->
                    POLL_OPTIONS_FEE.getFee(transaction, appendage) + POLL_SIZE_FEE.getFee(transaction, appendage);

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_POLL_CREATION;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.POLL_CREATION;
            }

            @Override
            public String getName() {
                return "PollCreation";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return POLL_FEE;
            }

            @Override
            Attachment.MessagingPollCreation parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingPollCreation(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingPollCreation parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingPollCreation(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingPollCreation attachment =
                        (Attachment.MessagingPollCreation) transaction.getAttachment();
                Poll.addPoll(transaction, attachment);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {

                Attachment.MessagingPollCreation attachment =
                        (Attachment.MessagingPollCreation) transaction.getAttachment();

                int optionsCount = attachment.getPollOptions().length;

                if (attachment.getPollName().length() > Constants.MAX_POLL_NAME_LENGTH
                        || attachment.getPollName().isEmpty()
                        || attachment.getPollDescription().length() > Constants.MAX_POLL_DESCRIPTION_LENGTH
                        || optionsCount > Constants.MAX_POLL_OPTION_COUNT
                        || optionsCount == 0) {
                    throw new XinException.NotValidException("Invalid poll attachment: " + attachment.getJSONObject());
                }

                if (attachment.getMinNumberOfOptions() < 1
                        || attachment.getMinNumberOfOptions() > optionsCount) {
                    throw new XinException.NotValidException(
                            "Invalid min number of options: " + attachment.getJSONObject());
                }

                if (attachment.getMaxNumberOfOptions() < 1
                        || attachment.getMaxNumberOfOptions() < attachment.getMinNumberOfOptions()
                        || attachment.getMaxNumberOfOptions() > optionsCount) {
                    throw new XinException.NotValidException(
                            "Invalid max number of options: " + attachment.getJSONObject());
                }

                for (int i = 0; i < optionsCount; i++) {
                    if (attachment.getPollOptions()[i].length() > Constants.MAX_POLL_OPTION_LENGTH
                            || attachment.getPollOptions()[i].isEmpty()) {
                        throw new XinException.NotValidException(
                                "Invalid poll options length: " + attachment.getJSONObject());
                    }
                }

                if (attachment.getMinRangeValue() < Constants.MIN_VOTE_VALUE ||
                        attachment.getMaxRangeValue() > Constants.MAX_VOTE_VALUE
                        || attachment.getMaxRangeValue() < attachment.getMinRangeValue()) {
                    throw new XinException.NotValidException("Invalid range: " + attachment.getJSONObject());
                }

                if (attachment.getFinishHeight() <= attachment.getFinishValidationHeight(transaction) + 1
                        || attachment.getFinishHeight() >=
                        attachment.getFinishValidationHeight(transaction) + Constants.MAX_POLL_DURATION) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid finishing height" + attachment.getJSONObject());
                }

                if (!attachment.getVoteWeighting().acceptsVotes() ||
                        attachment.getVoteWeighting().getVotingModel() == VoteWeighting.VotingModel.HASH) {
                    throw new XinException.NotValidException(
                            "VotingModel " + attachment.getVoteWeighting().getVotingModel() +
                                    " not valid for regular polls");
                }

                attachment.getVoteWeighting().validate();

            }

            @Override
            boolean isBlockDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {

                if (Constants.THROTTLE_POLL_CREATION) {

                    return isDuplicate(Messaging.POLL_CREATION, getName(), duplicates, true);

                } else {
                    return false;
                }

            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public final static TransactionType VOTE_CASTING = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_VOTE_CASTING;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.VOTE_CASTING;
            }

            @Override
            public String getName() {
                return "VoteCasting";
            }

            @Override
            Attachment.MessagingVoteCasting parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingVoteCasting(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingVoteCasting parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingVoteCasting(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingVoteCasting attachment =
                        (Attachment.MessagingVoteCasting) transaction.getAttachment();
                Vote.addVote(transaction, attachment);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {

                Attachment.MessagingVoteCasting attachment =
                        (Attachment.MessagingVoteCasting) transaction.getAttachment();
                if (attachment.getPollId() == 0 || attachment.getPollVote() == null
                        || attachment.getPollVote().length > Constants.MAX_POLL_OPTION_COUNT) {
                    throw new XinException.NotValidException(
                            "Invalid vote casting attachment: " + attachment.getJSONObject());
                }

                long pollId = attachment.getPollId();

                Poll poll = Poll.getPoll(pollId);
                if (poll == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid poll: " + Long.toUnsignedString(attachment.getPollId()));
                }

                if (Vote.getVote(pollId, transaction.getSenderId()) != null) {
                    throw new XinException.NotCurrentlyValidException("Double voting attempt");
                }

                if (poll.getFinishHeight() <= attachment.getFinishValidationHeight(transaction)) {
                    throw new XinException.NotCurrentlyValidException(
                            "Voting for this poll finishes at " + poll.getFinishHeight());
                }

                byte[] votes         = attachment.getPollVote();
                int    positiveCount = 0;
                for (byte vote : votes) {
                    if (vote != Constants.NO_VOTE_VALUE &&
                            (vote < poll.getMinRangeValue() || vote > poll.getMaxRangeValue())) {
                        throw new XinException.NotValidException(
                                String.format("Invalid vote %d, vote must be between %d and %d",
                                        vote, poll.getMinRangeValue(), poll.getMaxRangeValue()));
                    }
                    if (vote != Constants.NO_VOTE_VALUE) {
                        positiveCount++;
                    }
                }

                if (positiveCount < poll.getMinNumberOfOptions() || positiveCount > poll.getMaxNumberOfOptions()) {
                    throw new XinException.NotValidException(
                            String.format("Invalid num of choices %d, number of choices must be between %d and %d",
                                    positiveCount, poll.getMinNumberOfOptions(), poll.getMaxNumberOfOptions()));
                }
            }

            @Override
            boolean isDuplicate(final Transaction transaction,
                                final Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.MessagingVoteCasting attachment =
                        (Attachment.MessagingVoteCasting) transaction.getAttachment();
                String key = Long.toUnsignedString(attachment.getPollId()) + ":" +
                        Long.toUnsignedString(transaction.getSenderId());
                return isDuplicate(Messaging.VOTE_CASTING, key, duplicates, true);
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

        public static final TransactionType PHASING_VOTE_CASTING = new Messaging() {

            private final Fee PHASING_VOTE_FEE = (transaction, appendage) -> {
                Attachment.MessagingPhasingVoteCasting attachment =
                        (Attachment.MessagingPhasingVoteCasting) transaction.getAttachment();
                return attachment.getTransactionFullHashes().size() * Constants.UNIT_FEE;
            };

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_PHASING_VOTE_CASTING;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.PHASING_VOTE_CASTING;
            }

            @Override
            public String getName() {
                return "PhasingVoteCasting";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return PHASING_VOTE_FEE;
            }

            @Override
            Attachment.MessagingPhasingVoteCasting parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingPhasingVoteCasting(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingPhasingVoteCasting parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingPhasingVoteCasting(attachmentData);
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {

                Attachment.MessagingPhasingVoteCasting attachment =
                        (Attachment.MessagingPhasingVoteCasting) transaction.getAttachment();
                byte[] revealedSecret = attachment.getRevealedSecret();
                if (revealedSecret.length > Constants.MAX_PHASING_REVEALED_SECRET_LENGTH) {
                    throw new XinException.NotValidException("Invalid revealed secret length " + revealedSecret.length);
                }
                byte[] hashedSecret = null;
                byte   algorithm    = 0;

                List<byte[]> hashes = attachment.getTransactionFullHashes();
                if (hashes.size() > Constants.MAX_PHASING_VOTE_TRANSACTIONS) {
                    throw new XinException.NotValidException("No more than " + Constants.MAX_PHASING_VOTE_TRANSACTIONS +
                            " votes allowed for two-phased multi-voting");
                }

                long voterId = transaction.getSenderId();
                for (byte[] hash : hashes) {
                    long phasedTransactionId = Convert.fullHashToId(hash);
                    if (phasedTransactionId == 0) {
                        throw new XinException.NotValidException(
                                "Invalid phased transactionFullHash " + Convert.toHexString(hash));
                    }

                    PhasingPoll poll = PhasingPoll.getPoll(phasedTransactionId);
                    if (poll == null) {
                        throw new XinException.NotCurrentlyValidException(
                                "Invalid phased transaction " + Long.toUnsignedString(phasedTransactionId)
                                        + ", or phasing is finished");
                    }
                    if (!poll.getVoteWeighting().acceptsVotes()) {
                        throw new XinException.NotValidException(
                                "This phased transaction does not require or accept voting");
                    }
                    long[] whitelist = poll.getWhitelist();
                    if (whitelist.length > 0 && Arrays.binarySearch(whitelist, voterId) < 0) {
                        throw new XinException.NotValidException("Voter is not in the phased transaction whitelist");
                    }
                    if (revealedSecret.length > 0) {
                        if (poll.getVoteWeighting().getVotingModel() != VoteWeighting.VotingModel.HASH) {
                            throw new XinException.NotValidException(
                                    "Phased transaction " + Long.toUnsignedString(phasedTransactionId) +
                                            " does not accept by-hash voting");
                        }
                        if (hashedSecret != null && !Arrays.equals(poll.getHashedSecret(), hashedSecret)) {
                            throw new XinException.NotValidException(
                                    "Phased transaction " + Long.toUnsignedString(phasedTransactionId) +
                                            " is using a different hashedSecret");
                        }
                        if (algorithm != 0 && algorithm != poll.getAlgorithm()) {
                            throw new XinException.NotValidException(
                                    "Phased transaction " + Long.toUnsignedString(phasedTransactionId) +
                                            " is using a different hashedSecretAlgorithm");
                        }
                        if (hashedSecret == null && !poll.verifySecret(revealedSecret)) {
                            throw new XinException.NotValidException(
                                    "Revealed secret does not match phased transaction hashed secret");
                        }
                        hashedSecret = poll.getHashedSecret();
                        algorithm = poll.getAlgorithm();
                    } else if (poll.getVoteWeighting().getVotingModel() == VoteWeighting.VotingModel.HASH) {
                        throw new XinException.NotValidException(
                                "Phased transaction " + Long.toUnsignedString(phasedTransactionId) +
                                        " requires revealed secret for approval");
                    }
                    if (!Arrays.equals(poll.getFullHash(), hash)) {
                        throw new XinException.NotCurrentlyValidException(
                                "Phased transaction hash does not match hash in voting transaction");
                    }
                    if (poll.getFinishHeight() <= attachment.getFinishValidationHeight(transaction) + 1) {
                        throw new XinException.NotCurrentlyValidException(String.format(
                                "Phased transaction finishes at height %d which is not after approval transaction " +
                                        "height %d",
                                poll.getFinishHeight(), attachment.getFinishValidationHeight(transaction) + 1));
                    }
                }
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingPhasingVoteCasting attachment =
                        (Attachment.MessagingPhasingVoteCasting) transaction.getAttachment();
                List<byte[]> hashes = attachment.getTransactionFullHashes();
                for (byte[] hash : hashes) {
                    PhasingVote.addVote(transaction, senderAccount, Convert.fullHashToId(hash));
                }
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final TransactionType HUB_ANNOUNCEMENT = new Messaging() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.HUB_ANNOUNCEMENT;
            }

            @Override
            public String getName() {
                return "HubAnnouncement";
            }

            @Override
            Attachment.MessagingHubAnnouncement parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingHubAnnouncement(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingHubAnnouncement parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingHubAnnouncement(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingHubAnnouncement attachment =
                        (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
                Hub.addOrUpdateHub(transaction, attachment);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {

                if (Xin.getBlockchain().getHeight() < Constants.HUB_ANNOUNCEMENT_BLOCK) {
                    throw new XinException.NotYetEnabledException(
                            "Hub terminal announcement not yet enabled at height " + Xin.getBlockchain().getHeight());
                }

                Attachment.MessagingHubAnnouncement attachment =
                        (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
                if (attachment.getMinFeePerByteTQT() < 0 || attachment.getMinFeePerByteTQT() > Constants.MAX_BALANCE_TQT
                        || attachment.getUris().length > Constants.MAX_HUB_ANNOUNCEMENT_URIS) {
                    throw new XinException.NotValidException(
                            "Invalid hub terminal announcement: " + attachment.getJSONObject());
                }
                for (String uri : attachment.getUris()) {
                    if (uri.length() > Constants.MAX_HUB_ANNOUNCEMENT_URI_LENGTH) {
                        throw new XinException.NotValidException("Invalid URI length: " + uri.length());
                    }
                    //also check URI validity here?
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final Messaging ACCOUNT_INFO = new Messaging() {

            private final Fee ACCOUNT_INFO_FEE = new Fee.SizeBasedFee(Constants.FEE_ACCOUNT_INFO_INITIAL_CONSTANT,
                    Constants.ACCOUNT_INFO_FEE_PER_UNIT, Constants.SIZE_ACCOUNT_INFO_UNIT) {
                @Override
                public int getSize(TransactionImpl transaction, Appendix appendage) {
                    Attachment.MessagingAccountInfo attachment =
                            (Attachment.MessagingAccountInfo) transaction.getAttachment();
                    return attachment.getName().length() + attachment.getDescription().length();
                }
            };

            @Override
            public byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_INFO;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ACCOUNT_INFO;
            }

            @Override
            public String getName() {
                return "AccountInfo";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return ACCOUNT_INFO_FEE;
            }

            @Override
            Attachment.MessagingAccountInfo parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountInfo(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAccountInfo parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountInfo(attachmentData);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.MessagingAccountInfo attachment =
                        (Attachment.MessagingAccountInfo) transaction.getAttachment();
                if (attachment.getName().length() > Constants.MAX_ACCOUNT_NAME_LENGTH
                        || attachment.getDescription().length() > Constants.MAX_ACCOUNT_DESCRIPTION_LENGTH) {
                    throw new XinException.NotValidException(
                            "Invalid account info issuance: " + attachment.getJSONObject());
                }
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingAccountInfo attachment =
                        (Attachment.MessagingAccountInfo) transaction.getAttachment();
                senderAccount.setAccountInfo(attachment.getName(), attachment.getDescription());
            }

            @Override
            boolean isBlockDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {

                if (Constants.THROTTLE_ACCOUNT_INFO) {

                    return isDuplicate(Messaging.ACCOUNT_INFO, getName(), duplicates, true);

                } else {
                    return false;
                }

            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final Messaging ACCOUNT_PROPERTY = new Messaging() {

            private final Fee ACCOUNT_PROPERTY_FEE =
                    new Fee.SizeBasedFee(Constants.FEE_ACCOUNT_PROPERTY_INITIAL_CONSTANT,
                            Constants.ACCOUNT_PROPERTY_FEE_PER_UNIT, Constants.SIZE_ACCOUNT_PROPERTY_UNIT) {
                        @Override
                        public int getSize(TransactionImpl transaction, Appendix appendage) {
                            Attachment.MessagingAccountProperty attachment =
                                    (Attachment.MessagingAccountProperty) transaction.getAttachment();
                            return attachment.getValue().length();
                        }
                    };

            @Override
            public byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_PROPERTY;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ACCOUNT_PROPERTY;
            }

            @Override
            public String getName() {
                return "AccountProperty";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return ACCOUNT_PROPERTY_FEE;
            }

            @Override
            Attachment.MessagingAccountProperty parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountProperty(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAccountProperty parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountProperty(attachmentData);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.MessagingAccountProperty attachment =
                        (Attachment.MessagingAccountProperty) transaction.getAttachment();
                if (attachment.getProperty().length() > Constants.MAX_ACCOUNT_PROPERTY_NAME_LENGTH
                        || attachment.getProperty().length() == 0
                        || attachment.getValue().length() > Constants.MAX_ACCOUNT_PROPERTY_VALUE_LENGTH) {
                    throw new XinException.NotValidException("Invalid account property: " + attachment.getJSONObject());
                }
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException(
                            "Account property transaction cannot be used to send token");
                }
                if (transaction.getRecipientId() == Genesis.CREATOR_ID) {
                    throw new XinException.NotValidException("Setting Genesis account properties not allowed");
                }
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingAccountProperty attachment =
                        (Attachment.MessagingAccountProperty) transaction.getAttachment();
                recipientAccount
                        .setProperty(transaction, senderAccount, attachment.getProperty(), attachment.getValue());
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final Messaging ACCOUNT_PROPERTY_DELETE = new Messaging() {

            @Override
            public byte getSubtype() {
                return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_PROPERTY_DELETE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ACCOUNT_PROPERTY_DELETE;
            }

            @Override
            public String getName() {
                return "AccountPropertyDelete";
            }

            @Override
            Attachment.MessagingAccountPropertyDelete parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountPropertyDelete(buffer, transactionVersion);
            }

            @Override
            Attachment.MessagingAccountPropertyDelete parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.MessagingAccountPropertyDelete(attachmentData);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.MessagingAccountPropertyDelete attachment =
                        (Attachment.MessagingAccountPropertyDelete) transaction.getAttachment();
                Account.AccountProperty accountProperty =
                        Account.getProperty(attachment.getPropertyId());
                if (accountProperty == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "No such property " + Long.toUnsignedString(attachment.getPropertyId()));
                }
                if (accountProperty.getRecipientId() != transaction.getSenderId() &&
                        accountProperty.getSetterId() != transaction.getSenderId()) {
                    throw new XinException.NotValidException(
                            "Account " + Long.toUnsignedString(transaction.getSenderId())
                                    + " cannot delete property " + Long.toUnsignedString(attachment.getPropertyId()));
                }
                if (accountProperty.getRecipientId() != transaction.getRecipientId()) {
                    throw new XinException.NotValidException(
                            "Account property " + Long.toUnsignedString(attachment.getPropertyId())
                                    + " does not belong to " + Long.toUnsignedString(transaction.getRecipientId()));
                }
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException(
                            "Account property transaction cannot be used to send token");
                }
                if (transaction.getRecipientId() == Genesis.CREATOR_ID) {
                    throw new XinException.NotValidException("Deleting Genesis account properties not allowed");
                }
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.MessagingAccountPropertyDelete attachment =
                        (Attachment.MessagingAccountPropertyDelete) transaction.getAttachment();
                senderAccount.deleteProperty(attachment.getPropertyId());
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

    }

    public static abstract class ColoredCoins extends TransactionType {

        private ColoredCoins() {
        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_COLORED_COINS;
        }

        public static final TransactionType ASSET_ISSUANCE = new ColoredCoins() {

            private final Fee SINGLETON_ASSET_FEE =
                    new Fee.SizeBasedFee(Constants.FEE_ASSET_INITIAL_CONSTANT, Constants.ASSET_FEE_PER_UNIT,
                            Constants.SIZE_ASSET_UNIT) {
                        public int getSize(TransactionImpl transaction, Appendix appendage) {
                            Attachment.ColoredCoinsAssetIssuance attachment =
                                    (Attachment.ColoredCoinsAssetIssuance) transaction.getAttachment();
                            return attachment.getDescription().length();
                        }
                    };

            private final Fee ASSET_ISSUANCE_FEE = (transaction, appendage) -> isSingletonIssuance(transaction) ?
                    SINGLETON_ASSET_FEE.getFee(transaction, appendage) : Constants.FEE_NON_SINGLETON_ASSET_FEE;

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_ISSUANCE;
            }

            @Override
            public String getName() {
                return "AssetIssuance";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                return ASSET_ISSUANCE_FEE;
            }

            @Override
            long[] getBackFees(Transaction transaction) {
                if (isSingletonIssuance(transaction)) {
                    return Convert.EMPTY_LONG;
                }
                long feeTQT = transaction.getFeeTQT();
                return new long[]{feeTQT * 3 / 10, feeTQT * 2 / 10, feeTQT / 10};
            }

            @Override
            Attachment.ColoredCoinsAssetIssuance parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetIssuance(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAssetIssuance parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetIssuance(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return true;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAssetIssuance attachment =
                        (Attachment.ColoredCoinsAssetIssuance) transaction.getAttachment();
                long assetId = transaction.getId();
                Asset.addAsset(transaction, attachment);
                senderAccount.addToAssetAndUnconfirmedAssetBalanceQNT(getLedgerEvent(), assetId, assetId,
                        attachment.getQuantityQNT());
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsAssetIssuance attachment =
                        (Attachment.ColoredCoinsAssetIssuance) transaction.getAttachment();
                if (attachment.getName().length() < Constants.MIN_ASSET_NAME_LENGTH
                        || attachment.getName().length() > Constants.MAX_ASSET_NAME_LENGTH
                        || attachment.getDescription().length() > Constants.MAX_ASSET_DESCRIPTION_LENGTH
                        || attachment.getDecimals() < 0 || attachment.getDecimals() > 8
                        || attachment.getQuantityQNT() <= 0
                        || attachment.getQuantityQNT() > Constants.MAX_ASSET_QUANTITY_QNT
                        ) {
                    throw new XinException.NotValidException("Invalid asset issuance: " + attachment.getJSONObject());
                }
                String normalizedName = attachment.getName().toLowerCase();

                for (int i = 0; i < normalizedName.length(); i++) {
                    if (Constants.ALPHABET.indexOf(normalizedName.charAt(i)) < 0) {
                        throw new XinException.NotValidException("Invalid asset name: " + normalizedName);
                    }
                }

                if (Asset.isAssetNameTaken(normalizedName) && !Constants.ALLOW_DUPLICATE_ASSE_NAME) {
                    throw new XinException.NotValidException(
                            "Invalid asset name : " + normalizedName + ". Name already " + "taken");
                }
            }

            @Override
            boolean isBlockDuplicate(final Transaction transaction,
                                     final Map<TransactionType, Map<String, Integer>> duplicates) {

                if (Constants.THROTTLE_ASSET_ISSUANCE) {

                    return !isSingletonIssuance(transaction) &&
                            isDuplicate(ColoredCoins.ASSET_ISSUANCE, getName(), duplicates, true);

                } else {
                    return false;
                }

            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

            private boolean isSingletonIssuance(Transaction transaction) {
                Attachment.ColoredCoinsAssetIssuance attachment =
                        (Attachment.ColoredCoinsAssetIssuance) transaction.getAttachment();
                return attachment.getQuantityQNT() == 1 && attachment.getDecimals() == 0
                        && attachment.getDescription().length() <= Constants.MAX_SINGLETON_ASSET_DESCRIPTION_LENGTH;
            }

        };

        public static final TransactionType ASSET_TRANSFER = new ColoredCoins() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASSET_TRANSFER;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_TRANSFER;
            }

            @Override
            public String getName() {
                return "AssetTransfer";
            }

            @Override
            Attachment.ColoredCoinsAssetTransfer parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetTransfer(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAssetTransfer parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetTransfer(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAssetTransfer attachment =
                        (Attachment.ColoredCoinsAssetTransfer) transaction.getAttachment();
                long unconfirmedAssetBalance =
                        senderAccount.getUnconfirmedAssetBalanceQNT(attachment.getAssetId());
                if (unconfirmedAssetBalance >= 0 && unconfirmedAssetBalance >= attachment.getQuantityQNT()) {
                    senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                            attachment.getAssetId(), -attachment.getQuantityQNT());
                    return true;
                }
                return false;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAssetTransfer attachment =
                        (Attachment.ColoredCoinsAssetTransfer) transaction.getAttachment();
                senderAccount.addToAssetBalanceQNT(getLedgerEvent(), transaction.getId(), attachment.getAssetId(),
                        -attachment.getQuantityQNT());
                if (recipientAccount.getId() == Genesis.CREATOR_ID) {
                    Asset.deleteAsset(transaction, attachment.getAssetId(), attachment.getQuantityQNT());
                } else {
                    recipientAccount.addToAssetAndUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                            attachment.getAssetId(), attachment.getQuantityQNT());
                    AssetTransfer.addAssetTransfer(transaction, attachment);
                }
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAssetTransfer attachment =
                        (Attachment.ColoredCoinsAssetTransfer) transaction.getAttachment();
                senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                        attachment.getAssetId(), attachment.getQuantityQNT());
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsAssetTransfer attachment =
                        (Attachment.ColoredCoinsAssetTransfer) transaction.getAttachment();
                if (transaction.getAmountTQT() != 0
                        || attachment.getComment() != null &&
                        attachment.getComment().length() > Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH
                        || attachment.getAssetId() == 0) {
                    throw new XinException.NotValidException(
                            "Invalid asset transfer amount or comment: " + attachment.getJSONObject());
                }
                if (transaction.getRecipientId() == Genesis.CREATOR_ID &&
                        attachment.getFinishValidationHeight(transaction) > Constants.SHUFFLING_BLOCK) {
                    throw new XinException.NotValidException("Asset transfer to Genesis no longer allowed, "
                            + "use asset delete attachment instead");
                }
                if (transaction.getVersion() > 0 && attachment.getComment() != null) {
                    throw new XinException.NotValidException("Asset transfer comments no longer allowed, use message " +
                            "or encrypted message appendix instead");
                }
                Asset asset = Asset.getAsset(attachment.getAssetId());
                if (attachment.getQuantityQNT() <= 0 ||
                        (asset != null && attachment.getQuantityQNT() > asset.getInitialQuantityQNT())) {
                    throw new XinException.NotValidException(
                            "Invalid asset transfer asset or quantity: " + attachment.getJSONObject());
                }
                if (asset == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Asset " + Long.toUnsignedString(attachment.getAssetId()) +
                                    " does not exist yet");
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final TransactionType ASSET_DELETE = new ColoredCoins() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASSET_DELETE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_DELETE;
            }

            @Override
            public String getName() {
                return "AssetDelete";
            }

            @Override
            Attachment.ColoredCoinsAssetDelete parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetDelete(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAssetDelete parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetDelete(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAssetDelete attachment =
                        (Attachment.ColoredCoinsAssetDelete) transaction.getAttachment();
                long unconfirmedAssetBalance =
                        senderAccount.getUnconfirmedAssetBalanceQNT(attachment.getAssetId());
                if (unconfirmedAssetBalance >= 0 && unconfirmedAssetBalance >= attachment.getQuantityQNT()) {
                    senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                            attachment.getAssetId(), -attachment.getQuantityQNT());
                    return true;
                }
                return false;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAssetDelete attachment =
                        (Attachment.ColoredCoinsAssetDelete) transaction.getAttachment();
                senderAccount.addToAssetBalanceQNT(getLedgerEvent(), transaction.getId(), attachment.getAssetId(),
                        -attachment.getQuantityQNT());
                Asset.deleteAsset(transaction, attachment.getAssetId(), attachment.getQuantityQNT());
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAssetDelete attachment =
                        (Attachment.ColoredCoinsAssetDelete) transaction.getAttachment();
                senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                        attachment.getAssetId(), attachment.getQuantityQNT());
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsAssetDelete attachment =
                        (Attachment.ColoredCoinsAssetDelete) transaction.getAttachment();
                if (attachment.getAssetId() == 0) {
                    throw new XinException.NotValidException("Invalid asset identifier: " + attachment.getJSONObject());
                }
                Asset asset = Asset.getAsset(attachment.getAssetId());
                if (attachment.getQuantityQNT() <= 0 ||
                        (asset != null && attachment.getQuantityQNT() > asset.getInitialQuantityQNT())) {
                    throw new XinException.NotValidException(
                            "Invalid asset delete asset or quantity: " + attachment.getJSONObject());
                }
                if (asset == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Asset " + Long.toUnsignedString(attachment.getAssetId()) +
                                    " does not exist yet");
                }
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final TransactionType ASSET_COMPLETE_DELETE = new ColoredCoins() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASSET_COMPLETE_DELETE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_DELETE;
            }

            @Override
            public String getName() {
                return "AssetCompleteDelete";
            }

            @Override
            Attachment.ColoredCoinsAssetCompleteDelete parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException
                    .NotValidException {
                return new Attachment.ColoredCoinsAssetCompleteDelete(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAssetCompleteDelete parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAssetCompleteDelete(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return true;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAssetCompleteDelete attachment =
                        (Attachment.ColoredCoinsAssetCompleteDelete) transaction.getAttachment();

                long assetId = attachment.getAssetId();

                Asset asset = Asset.getAsset(attachment.getAssetId());
                asset.deleteAssetCompletely();
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsAssetCompleteDelete attachment =
                        (Attachment.ColoredCoinsAssetCompleteDelete) transaction.getAttachment();
                long assetId = attachment.getAssetId();

                if (attachment.getAssetId() == 0) {
                    throw new XinException.NotValidException("Invalid asset identifier: " + attachment.getJSONObject());
                }
                Asset asset = Asset.getAsset(attachment.getAssetId());
                if (asset == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Asset " + Long.toUnsignedString(attachment.getAssetId()) +
                                    " does not exist yet");
                }

                long tradeCount        = Trade.getTradeCount(assetId);
                long shareHoldersCount = Account.getAssetAccountCount(assetId);
                long transfersCount    = AssetTransfer.getTransferCount(assetId);

                if (shareHoldersCount == 1) {
                    try (DbIterator<Account.AccountAsset> iterator = Account.getAssetAccounts(assetId, -1, -1)) {
                        while (iterator.hasNext()) {
                            Account.AccountAsset accountAsset = iterator.next();
                            if (accountAsset.getAccountId() != transaction.getSenderId()) {
                                throw new XinException.NotValidException("Not authorized to delete asset");
                            }
                        }
                    }
                } else {
                    throw new XinException.NotValidException("shareholders count more than 1");
                }

                if (tradeCount != 0 || transfersCount != 0) {
                    throw new XinException.NotValidException("more than one trades or transfers found");
                }

                if (AssetDividend.getLastDividend(assetId) != null) {
                    throw new XinException.NotValidException("dividend has been paid for this asset");
                }

                if (AssetDelete.getAssetDeletesCount(assetId) != 0) {
                    throw new XinException.NotValidException("asset delete shares has been performed on this asset");
                }

                if (!Asset.isEnabled()) {
                    throw new XinException.NotYetEnabledException("Asset complete delete not yet enabled");
                }

            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        abstract static class ColoredCoinsOrderPlacement extends ColoredCoins {

            @Override
            final void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsOrderPlacement attachment =
                        (Attachment.ColoredCoinsOrderPlacement) transaction.getAttachment();
                if (attachment.getPriceTQT() <= 0 || attachment.getPriceTQT() > Constants.MAX_BALANCE_TQT
                        || attachment.getAssetId() == 0) {
                    throw new XinException.NotValidException(
                            "Invalid asset order placement: " + attachment.getJSONObject());
                }
                Asset asset = Asset.getAsset(attachment.getAssetId());
                if (attachment.getQuantityQNT() <= 0 ||
                        (asset != null && attachment.getQuantityQNT() > asset.getInitialQuantityQNT())) {
                    throw new XinException.NotValidException(
                            "Invalid asset order placement asset or quantity: " + attachment.getJSONObject());
                }
                if (asset == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Asset " + Long.toUnsignedString(attachment.getAssetId()) +
                                    " does not exist yet");
                }
            }

            @Override
            public final boolean canHaveRecipient() {
                return false;
            }

            @Override
            public final boolean isPhasingSafe() {
                return true;
            }

        }

        public static final TransactionType ASK_ORDER_PLACEMENT = new ColoredCoins.ColoredCoinsOrderPlacement() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_ASK_ORDER_PLACEMENT;
            }

            @Override
            public String getName() {
                return "AskOrderPlacement";
            }

            @Override
            Attachment.ColoredCoinsAskOrderPlacement parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAskOrderPlacement(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAskOrderPlacement parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAskOrderPlacement(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAskOrderPlacement attachment =
                        (Attachment.ColoredCoinsAskOrderPlacement) transaction.getAttachment();
                long unconfirmedAssetBalance =
                        senderAccount.getUnconfirmedAssetBalanceQNT(attachment.getAssetId());
                if (unconfirmedAssetBalance >= 0 && unconfirmedAssetBalance >= attachment.getQuantityQNT()) {
                    senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                            attachment.getAssetId(), -attachment.getQuantityQNT());
                    return true;
                }
                return false;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAskOrderPlacement attachment =
                        (Attachment.ColoredCoinsAskOrderPlacement) transaction.getAttachment();
                Order.Ask.addOrder(transaction, attachment);
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsAskOrderPlacement attachment =
                        (Attachment.ColoredCoinsAskOrderPlacement) transaction.getAttachment();
                senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                        attachment.getAssetId(), attachment.getQuantityQNT());
            }

        };

        public final static TransactionType BID_ORDER_PLACEMENT = new ColoredCoins.ColoredCoinsOrderPlacement() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_BID_ORDER_PLACEMENT;
            }

            @Override
            public String getName() {
                return "BidOrderPlacement";
            }

            @Override
            Attachment.ColoredCoinsBidOrderPlacement parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsBidOrderPlacement(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsBidOrderPlacement parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsBidOrderPlacement(attachmentData);
            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsBidOrderPlacement attachment =
                        (Attachment.ColoredCoinsBidOrderPlacement) transaction.getAttachment();
                if (senderAccount.getUnconfirmedBalanceTQT() >=
                        Math.multiplyExact(attachment.getQuantityQNT(), attachment.getPriceTQT())) {
                    senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(),
                            -Math.multiplyExact(attachment.getQuantityQNT(), attachment.getPriceTQT()));
                    return true;
                }
                return false;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsBidOrderPlacement attachment =
                        (Attachment.ColoredCoinsBidOrderPlacement) transaction.getAttachment();
                Order.Bid.addOrder(transaction, attachment);
            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsBidOrderPlacement attachment =
                        (Attachment.ColoredCoinsBidOrderPlacement) transaction.getAttachment();
                senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(),
                        Math.multiplyExact(attachment.getQuantityQNT(), attachment.getPriceTQT()));
            }

        };

        abstract static class ColoredCoinsOrderCancellation extends ColoredCoins {

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return true;
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isUnconfirmedDuplicate(Transaction transaction,
                                           Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.ColoredCoinsOrderCancellation attachment =
                        (Attachment.ColoredCoinsOrderCancellation) transaction.getAttachment();
                return TransactionType.isDuplicate(ColoredCoins.ASK_ORDER_CANCELLATION,
                        Long.toUnsignedString(attachment.getOrderId()), duplicates, true);
            }


            @Override
            public final boolean canHaveRecipient() {
                return false;
            }

            @Override
            public final boolean isPhasingSafe() {
                return true;
            }

        }

        public static final TransactionType ASK_ORDER_CANCELLATION = new ColoredCoins.ColoredCoinsOrderCancellation() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_ASK_ORDER_CANCELLATION;
            }

            @Override
            public String getName() {
                return "AskOrderCancellation";
            }

            @Override
            Attachment.ColoredCoinsAskOrderCancellation parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAskOrderCancellation(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsAskOrderCancellation parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsAskOrderCancellation(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsAskOrderCancellation attachment =
                        (Attachment.ColoredCoinsAskOrderCancellation) transaction.getAttachment();
                Order order = Order.Ask.getAskOrder(attachment.getOrderId());
                Order.Ask.removeOrder(attachment.getOrderId());
                if (order != null) {
                    senderAccount.addToUnconfirmedAssetBalanceQNT(getLedgerEvent(), transaction.getId(),
                            order.getAssetId(), order.getQuantityQNT());
                }
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsAskOrderCancellation attachment =
                        (Attachment.ColoredCoinsAskOrderCancellation) transaction.getAttachment();
                Order ask = Order.Ask.getAskOrder(attachment.getOrderId());
                if (ask == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid ask order: " + Long.toUnsignedString(attachment.getOrderId()));
                }
                if (ask.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotValidException(
                            "Order " + Long.toUnsignedString(attachment.getOrderId()) + " was created by account "
                                    + Long.toUnsignedString(ask.getAccountId()));
                }
            }

        };

        public static final TransactionType BID_ORDER_CANCELLATION = new ColoredCoins.ColoredCoinsOrderCancellation() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_BID_ORDER_CANCELLATION;
            }

            @Override
            public String getName() {
                return "BidOrderCancellation";
            }

            @Override
            Attachment.ColoredCoinsBidOrderCancellation parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsBidOrderCancellation(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsBidOrderCancellation parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.ColoredCoinsBidOrderCancellation(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsBidOrderCancellation attachment =
                        (Attachment.ColoredCoinsBidOrderCancellation) transaction.getAttachment();
                Order order = Order.Bid.getBidOrder(attachment.getOrderId());
                Order.Bid.removeOrder(attachment.getOrderId());
                if (order != null) {
                    senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(),
                            Math.multiplyExact(order.getQuantityQNT(), order.getPriceTQT()));
                }
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsBidOrderCancellation attachment =
                        (Attachment.ColoredCoinsBidOrderCancellation) transaction.getAttachment();
                Order bid = Order.Bid.getBidOrder(attachment.getOrderId());
                if (bid == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid bid order: " + Long.toUnsignedString(attachment.getOrderId()));
                }
                if (bid.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotValidException(
                            "Order " + Long.toUnsignedString(attachment.getOrderId()) + " was created by account "
                                    + Long.toUnsignedString(bid.getAccountId()));
                }
            }

        };

        public static final TransactionType DIVIDEND_PAYMENT = new ColoredCoins() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_COLORED_COINS_DIVIDEND_PAYMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ASSET_DIVIDEND_PAYMENT;
            }

            @Override
            public String getName() {
                return "DividendPayment";
            }

            @Override
            Attachment.ColoredCoinsDividendPayment parseAttachment(ByteBuffer buffer, byte transactionVersion) {
                return new Attachment.ColoredCoinsDividendPayment(buffer, transactionVersion);
            }

            @Override
            Attachment.ColoredCoinsDividendPayment parseAttachment(JSONObject attachmentData) {
                return new Attachment.ColoredCoinsDividendPayment(attachmentData);
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();
                if (Xin.getBlockchain().getHeight() >= Constants.INCREASED_DIVI_PAYMENT_BLOCK) {
                    return new Fee.ConstantFee(Constants.FEE_ASSETS_DIVIDENDS);
                } else {
                    return super.getBaselineFee(transaction);
                }

            }

            @Override
            boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();
                long  assetId = attachment.getAssetId();
                Asset asset   = Asset.getAsset(assetId, attachment.getHeight());
                if (asset == null) {
                    return true;
                }
                long quantityQNT =
                        asset.getQuantityQNT() - senderAccount.getAssetBalanceQNT(assetId, attachment.getHeight());
                long totalDividendPayment = Math.multiplyExact(attachment.getAmountTQTPerQNT(), quantityQNT);

                if (senderAccount.getUnconfirmedBalanceTQT() >= totalDividendPayment) {
                    senderAccount
                            .addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(), -totalDividendPayment);
                    return true;
                }

                return false;
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();

                senderAccount.payDividends(transaction.getId(), attachment);

            }

            @Override
            void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();
                long  assetId = attachment.getAssetId();
                Asset asset   = Asset.getAsset(assetId, attachment.getHeight());
                if (asset == null) {
                    return;
                }
                long quantityQNT =
                        asset.getQuantityQNT() - senderAccount.getAssetBalanceQNT(assetId, attachment.getHeight());
                long totalDividendPayment = Math.multiplyExact(attachment.getAmountTQTPerQNT(), quantityQNT);
                senderAccount.addToUnconfirmedBalanceTQT(getLedgerEvent(), transaction.getId(), totalDividendPayment);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();
                if (attachment.getHeight() > Xin.getBlockchain().getHeight()) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid dividend payment height: " + attachment.getHeight()
                                    + ", must not exceed current blockchain height " + Xin.getBlockchain().getHeight());
                }
                if (attachment.getHeight() <=
                        attachment.getFinishValidationHeight(transaction) - Constants.MAX_DIVIDEND_PAYMENT_ROLLBACK) {
                    throw new XinException.NotCurrentlyValidException(
                            "Invalid dividend payment height: " + attachment.getHeight()
                                    + ", must be less than " + Constants.MAX_DIVIDEND_PAYMENT_ROLLBACK
                                    + " blocks before " + attachment.getFinishValidationHeight(transaction));
                }
                Asset asset;
                if (Xin.getBlockchain().getHeight() > Constants.DIVIDEND_THROTTLE_BLOCK) {
                    asset = Asset.getAsset(attachment.getAssetId(), attachment.getHeight());
                } else {
                    asset = Asset.getAsset(attachment.getAssetId());
                }
                if (asset == null) {
                    throw new XinException.NotCurrentlyValidException(
                            "Asset " + Long.toUnsignedString(attachment.getAssetId())
                                    + " for dividend payment doesn't exist yet");
                }
                if (asset.getAccountId() != transaction.getSenderId() || attachment.getAmountTQTPerQNT() <= 0) {
                    throw new XinException.NotValidException(
                            "Invalid dividend payment sender or amount " + attachment.getJSONObject());
                }

                if (Account.getAssetAccountCount(attachment.getAssetId(), attachment.getHeight()) > Constants
                        .MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT) {
                    throw new XinException.NotValidException("Invalid dividend payment. You can pay dividend for " +
                            "assets having shareholders less than " + Constants.MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT);
                }

                if (Xin.getBlockchain().getHeight() > Constants.DIVIDEND_THROTTLE_BLOCK) {
                    AssetDividend lastDividend = AssetDividend.getLastDividend(attachment.getAssetId());
                    if (lastDividend != null && lastDividend.getHeight() >
                            Xin.getBlockchain().getHeight() - Constants.MAX_DIVIDEND_PER_BLOCKS) {
                        throw new XinException.NotCurrentlyValidException(
                                "Last dividend payment for asset " + Long.toUnsignedString(attachment.getAssetId())
                                        + " was less than " + Constants.MAX_DIVIDEND_PER_BLOCKS + " blocks ago at " +
                                        lastDividend.getHeight() + ", current height is " +
                                        Xin.getBlockchain().getHeight()
                                        + ", limit is one dividend per " + Constants.MAX_DIVIDEND_PER_BLOCKS +
                                        " blocks");
                    }
                }

            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.ColoredCoinsDividendPayment attachment =
                        (Attachment.ColoredCoinsDividendPayment) transaction.getAttachment();
                int currentHeight = Xin.getBlockchain().getHeight();
                return currentHeight > Constants.DIVIDEND_THROTTLE_BLOCK &&
                        isDuplicate(ColoredCoins.DIVIDEND_PAYMENT,
                                currentHeight > Constants.SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK ? "" :
                                        Long.toUnsignedString(attachment.getAssetId()), duplicates, true);
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

    }

    public static abstract class AdvancedPayment extends TransactionType {

        private AdvancedPayment() {
        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_ADVANCED_PAYMENT;
        }

        public final static TransactionType ESCROW_CREATION = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_ESCROW_CREATION;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.ESCROW_CREATION;
            }

            @Override
            Attachment.AdvancedPaymentEscrowCreation parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowCreation(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentEscrowCreation parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowCreation(attachmentData);
            }

            @Override
            public String getName() {
                return "EscrowCreation";
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.AdvancedPaymentEscrowCreation attachment =
                        (Attachment.AdvancedPaymentEscrowCreation) transaction.getAttachment();
                Long totalAmountTQT = Math.addExact(attachment.getAmountTQT(), attachment.getTotalSigners() * Constants
                        .ONE_XIN);
                if (senderAccount.getUnconfirmedBalanceTQT() < totalAmountTQT.longValue()) {
                    return false;
                }
                senderAccount.addToUnconfirmedBalanceTQT(-totalAmountTQT);
                return true;
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.AdvancedPaymentEscrowCreation attachment =
                        (Attachment.AdvancedPaymentEscrowCreation) transaction.getAttachment();
                Long totalAmountTQT = Math.addExact(attachment.getAmountTQT(), attachment.getTotalSigners() * Constants
                        .ONE_XIN);
                senderAccount.addToBalanceTQT(-totalAmountTQT);
                Collection<Long> signers = attachment.getSigners();
                for (Long signer : signers) {
                    Account.addOrGetAccount(signer).addToBalanceAndUnconfirmedBalanceTQT(Constants.ONE_XIN);
                }
                Escrow.addEscrowTransaction(senderAccount,
                        recipientAccount,
                        transaction.getId(),
                        attachment.getAmountTQT(),
                        attachment.getRequiredSigners(),
                        attachment.getSigners(),
                        transaction.getTimestamp() + attachment.getDeadline(),
                        attachment.getDeadlineAction());
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.AdvancedPaymentEscrowCreation attachment =
                        (Attachment.AdvancedPaymentEscrowCreation) transaction.getAttachment();
                Long totalAmountTQT = Math.addExact(attachment.getAmountTQT(), attachment.getTotalSigners() * Constants
                        .ONE_XIN);
                senderAccount.addToUnconfirmedBalanceTQT(totalAmountTQT);
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                return false;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.AdvancedPaymentEscrowCreation attachment =
                        (Attachment.AdvancedPaymentEscrowCreation) transaction.getAttachment();
                Long totalAmountTQT =
                        Math.addExact(attachment.getAmountTQT(), transaction.getFeeTQT());
                if (transaction.getSenderId() == transaction.getRecipientId()) {
                    throw new XinException.NotValidException("Escrow must have different sender and recipient");
                }
                totalAmountTQT = Math.addExact(totalAmountTQT, attachment.getTotalSigners() * Constants.ONE_XIN);
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException("Transaction sent amount must be 0 for escrow");
                }
                if (totalAmountTQT.compareTo(0L) < 0 ||
                        totalAmountTQT.compareTo(Constants.MAX_BALANCE_TQT) > 0) {
                    throw new XinException.NotValidException("Invalid escrow creation amount");
                }
                if (transaction.getFeeTQT() < Constants.FEE_ESCROW_CREATION) {
                    throw new XinException.NotValidException("Escrow transaction must have a fee at least 1 burst");
                }
                if (attachment.getRequiredSigners() < 1 || attachment.getRequiredSigners() > 10) {
                    throw new XinException.NotValidException("Escrow required signers much be 1 - 10");
                }
                if (attachment.getRequiredSigners() > attachment.getTotalSigners()) {
                    throw new XinException.NotValidException("Cannot have more required than signers on escrow");
                }
                if (attachment.getTotalSigners() < 1 || attachment.getTotalSigners() > 10) {
                    throw new XinException.NotValidException("Escrow transaction requires 1 - 10 signers");
                }
                if (attachment.getDeadline() < 1 || attachment.getDeadline() > 7776000) { // max deadline 3 months
                    throw new XinException.NotValidException("Escrow deadline must be 1 - 7776000 seconds");
                }
                if (attachment.getDeadlineAction() == null ||
                        attachment.getDeadlineAction() == Escrow.DecisionType.UNDECIDED) {
                    throw new XinException.NotValidException("Invalid deadline action for escrow");
                }
                if (attachment.getSigners().contains(transaction.getSenderId()) ||
                        attachment.getSigners().contains(transaction.getRecipientId())) {
                    throw new XinException.NotValidException("Escrow sender and recipient cannot be signers");
                }
                if (!Escrow.isEnabled()) {
                    throw new XinException.NotYetEnabledException("Escrow not yet enabled");
                }
            }

            @Override
            final public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }
        };

        public final static TransactionType ESCROW_SIGN = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_ESCROW_SIGN;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.ESCROW_SIGN;
            }

            @Override
            Attachment.AdvancedPaymentEscrowSign parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowSign(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentEscrowSign parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowSign(attachmentData);
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return true;
            }

            @Override
            public String getName() {
                return "EscrowSign";
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.AdvancedPaymentEscrowSign attachment =
                        (Attachment.AdvancedPaymentEscrowSign) transaction.getAttachment();
                Escrow escrow = Escrow.getEscrowTransaction(attachment.getEscrowId());

                escrow.sign(senderAccount.getId(), attachment.getDecision());

            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.AdvancedPaymentEscrowSign attachment =
                        (Attachment.AdvancedPaymentEscrowSign) transaction.getAttachment();
                String uniqueString = Convert.toUnsignedLong(attachment.getEscrowId()) + ":" +
                        Convert.toUnsignedLong(transaction.getSenderId());
                return isDuplicate(AdvancedPayment.ESCROW_SIGN, uniqueString, duplicates, true);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.AdvancedPaymentEscrowSign attachment =
                        (Attachment.AdvancedPaymentEscrowSign) transaction.getAttachment();
                if (transaction.getAmountTQT() != 0 || transaction.getFeeTQT() < Constants.MIN_FEE_ESCROW_SIGN) {
                    throw new XinException.NotValidException("Escrow signing must have amount 0 and min fee of 1");
                }
                if (attachment.getEscrowId() == null || attachment.getDecision() == null) {
                    throw new XinException.NotValidException("Escrow signing requires escrow id and decision set");
                }
                Escrow escrow = Escrow.getEscrowTransaction(attachment.getEscrowId());
                if (escrow == null) {
                    throw new XinException.NotValidException("Escrow transaction not found");
                }
                if (!escrow.isIdSigner(transaction.getSenderId()) &&
                        !escrow.getSenderId().equals(transaction.getSenderId()) &&
                        !escrow.getRecipientId().equals(transaction.getSenderId())) {
                    throw new XinException.NotValidException("Sender is not a participant in specified escrow");
                }
                if (escrow.getSenderId().equals(transaction.getSenderId()) &&
                        attachment.getDecision() != Escrow.DecisionType.RELEASE) {
                    throw new XinException.NotValidException("Escrow sender can only release");
                }
                if (escrow.getRecipientId().equals(transaction.getSenderId()) &&
                        attachment.getDecision() != Escrow.DecisionType.REFUND) {
                    throw new XinException.NotValidException("Escrow recipient can only refund");
                }
                if (!Escrow.isEnabled()) {
                    throw new XinException.NotYetEnabledException("Escrow not yet enabled");
                }
            }


            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }
        };

        public final static TransactionType ESCROW_RESULT = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_ESCROW_RESULT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.ESCROW_RESULT;
            }

            @Override
            Attachment.AdvancedPaymentEscrowResult parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowResult(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentEscrowResult parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentEscrowResult(attachmentData);
            }

            @Override
            public String getName() {
                return "EscrowResult";
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return false;
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                return true;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                throw new XinException.NotValidException("Escrow result never validates");
            }

            @Override
            final public boolean canHaveRecipient() {
                return true;
            }

            @Override
            final public boolean isSigned() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }
        };

        public final static TransactionType SUBSCRIPTION_SUBSCRIBE = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_SUBSCRIBE;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.SUBSCRIPTION_SUBSCRIBE;
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionSubscribe parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionSubscribe(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionSubscribe parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionSubscribe(attachmentData);
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return true;
            }

            @Override
            public String getName() {
                return "SubscriptionSubscribe";
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.AdvancedPaymentSubscriptionSubscribe attachment =
                        (Attachment.AdvancedPaymentSubscriptionSubscribe) transaction.getAttachment();
                Subscription.addSubscription(senderAccount, recipientAccount, transaction.getId(), transaction
                        .getAmountTQT(), transaction.getTimestamp(), attachment.getFrequency());
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                return false;
            }

            @Override
            final public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.AdvancedPaymentSubscriptionSubscribe attachment =
                        (Attachment.AdvancedPaymentSubscriptionSubscribe) transaction.getAttachment();
                if (attachment.getFrequency() == null ||
                        attachment.getFrequency().intValue() < Constants.SUBSCRIPTION_MIN_FREQ ||
                        attachment.getFrequency().intValue() > Constants.SUBSCRIPTION_MAX_FREQ) {
                    throw new XinException.NotValidException("Invalid subscription frequency");
                }
                if (transaction.getAmountTQT() < Constants.ONE_XIN || transaction.getAmountTQT() > Constants
                        .MAX_BALANCE_TQT) {
                    throw new XinException.NotValidException("Subscriptions must be at least one xin");
                }
                if (transaction.getSenderId() == transaction.getRecipientId()) {
                    throw new XinException.NotValidException("Cannot create subscription to same address");
                }
                if (!Subscription.isEnabled()) {
                    throw new XinException.NotYetEnabledException("Subscriptions not yet enabled");
                }
            }

        };

        public final static TransactionType SUBSCRIPTION_CANCEL = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_CANCEL;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                //return null;
                return LedgerEvent.SUBSCRIPTION_CANCEL;
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionCancel parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionCancel(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionCancel parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionCancel(attachmentData);
            }

            @Override
            public String getName() {
                return "SubscriptionCancel";
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                Attachment.AdvancedPaymentSubscriptionCancel attachment =
                        (Attachment.AdvancedPaymentSubscriptionCancel) transaction.getAttachment();
                Subscription.addRemoval(attachment.getSubscriptionId());
                return true;
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.AdvancedPaymentSubscriptionCancel attachment =
                        (Attachment.AdvancedPaymentSubscriptionCancel) transaction.getAttachment();
                Subscription.removeSubscription(attachment.getSubscriptionId());
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                Attachment.AdvancedPaymentSubscriptionCancel attachment =
                        (Attachment.AdvancedPaymentSubscriptionCancel) transaction.getAttachment();
                return isDuplicate(AdvancedPayment.SUBSCRIPTION_CANCEL, Convert.toUnsignedLong(attachment
                        .getSubscriptionId()), duplicates, true);
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.AdvancedPaymentSubscriptionCancel attachment =
                        (Attachment.AdvancedPaymentSubscriptionCancel) transaction.getAttachment();
                if (attachment.getSubscriptionId() == null) {
                    throw new XinException.NotValidException("Subscription cancel must include subscription id");
                }

                Subscription subscription = Subscription.getSubscription(attachment.getSubscriptionId());
                if (subscription == null) {
                    throw new XinException.NotValidException(
                            "Subscription cancel must contain current subscription id");
                }

                if (!subscription.getSenderId().equals(transaction.getSenderId()) &&
                        !subscription.getRecipientId().equals(transaction.getSenderId())) {
                    throw new XinException.NotValidException("Subscription cancel can only be done by participants");
                }

                if (!Subscription.isEnabled()) {
                    throw new XinException.NotYetEnabledException("Subscription cancel not yet enabled");
                }
            }

            @Override
            final public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }
        };

        public final static TransactionType SUBSCRIPTION_PAYMENT = new AdvancedPayment() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ADVANCED_PAYMENT_SUBSCRIPTION_PAYMENT;
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionPayment parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionPayment(buffer, transactionVersion);
            }

            @Override
            Attachment.AdvancedPaymentSubscriptionPayment parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AdvancedPaymentSubscriptionPayment(attachmentData);
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.SUBSCRIPTION_PAYMENT;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

            @Override
            public String getName() {
                return "SubscriptionPayment";
            }

            @Override
            final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
                return false;
            }

            @Override
            final void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
            }

            @Override
            final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                return true;
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                throw new XinException.NotValidException("Subscription payment never validates");
            }

            @Override
            final public boolean canHaveRecipient() {
                return true;
            }

            @Override
            final public boolean isSigned() {
                return false;
            }
        };
    }

    public static abstract class AutomatedTransactions extends TransactionType {
        private AutomatedTransactions() {

        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_AUTOMATED_TRANSACTIONS;
        }

        @Override
        boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            return true;
        }

        @Override
        void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {

        }

        @Override
        final void validateAttachment(Transaction transaction) throws XinException.ValidationException {
            if (transaction.getAmountTQT() != 0) {
                throw new XinException.NotValidException("Invalid automated transaction transaction");
            }
            doValidateAttachment(transaction);
        }

        abstract void doValidateAttachment(Transaction transaction) throws XinException.ValidationException;


        public static final TransactionType AUTOMATED_TRANSACTION_CREATION = new AutomatedTransactions() {

            @Override
            public byte getSubtype() {
                return TransactionType.SUBTYPE_AT_CREATION;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.AUTOMATED_TRANSACTION_CREATION;
            }

            @Override
            AbstractAttachment parseAttachment(ByteBuffer buffer,
                                               byte transactionVersion) throws XinException.NotValidException {
                // TODO Auto-generated method stub
                //System.out.println("parsing byte AT attachment");
                Attachment.AutomatedTransactionsCreation attachment =
                        new Attachment.AutomatedTransactionsCreation(buffer, transactionVersion);
                //System.out.println("byte AT attachment parsed");
                return attachment;
            }

            @Override
            AbstractAttachment parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                // TODO Auto-generated method stub
                //System.out.println("parsing at attachment");
                Attachment.AutomatedTransactionsCreation atCreateAttachment =
                        new Attachment.AutomatedTransactionsCreation(attachmentData);
                //System.out.println("attachment parsed");
                return atCreateAttachment;
            }

            @Override
            void doValidateAttachment(Transaction transaction)
                    throws ValidationException {
                //System.out.println("validating attachment");
                if (Xin.getBlockchain().getLastBlock().getHeight() < Constants.AUTOMATED_TRANSACTION_BLOCK) {
                    throw new XinException.NotYetEnabledException("Automated Transactions not yet enabled at height " +
                            Xin.getBlockchain().getLastBlock().getHeight());
                }
                if (transaction.getSignature() != null && Account.getAccount(transaction.getId()) != null) {
                    Account existingAccount = Account.getAccount(transaction.getId());
                    if (Account.getPublicKey(existingAccount.getId()) != null &&
                            !Arrays.equals(Account.getPublicKey(existingAccount.getId()), new byte[32]))
                        throw new XinException.NotValidException("Account with id already exists");
                }
                Attachment.AutomatedTransactionsCreation attachment =
                        (Attachment.AutomatedTransactionsCreation) transaction.getAttachment();

                if (Constants.THROTTLE_AT_CREATION_BY_NAME && AT.isATNameTaken(attachment.getName())) {
                    throw new XinException.NotCurrentlyValidException(
                            "AT with name " + attachment.getName() + " already exists");
                }

                long totalPages = 0;
                try {
                    totalPages = AT_Controller.checkCreationBytes(attachment.getCreationBytes(), Xin.getBlockchain()
                            .getHeight());
                } catch (AT_Exception e) {
                    throw new XinException.NotCurrentlyValidException("Invalid AT creation bytes", e);
                }
                long requiredFee = Constants.FEE_AUTOMATED_TRANSACTION_CREATE_INITIAL_CONSTANT +
                        (totalPages * AT_Constants.getInstance().COST_PER_PAGE(transaction.getHeight()));
                if (transaction.getFeeTQT() < requiredFee) {
                    throw new XinException.NotValidException("Insufficient fee for AT creation. Minimum: " + Convert
                            .toUnsignedLong(requiredFee / Constants.ONE_XIN));
                }
                if (Xin.getBlockchain().getHeight() >= Constants.AT_FIX_BLOCK_3) {
                    if (attachment.getName().length() > Constants.MAX_AUTOMATED_TRANSACTION_NAME_LENGTH) {
                        throw new XinException.NotValidException("Name of automated transaction over size limit");
                    }
                    if (attachment.getDescription().length() > Constants.MAX_AUTOMATED_TRANSACTION_DESCRIPTION_LENGTH) {
                        throw new XinException.NotValidException("Description of automated transaction over size " +
                                "limit");
                    }
                }
                //System.out.println("validating success");
            }

            @Override
            void applyAttachment(Transaction transaction,
                                 Account senderAccount, Account recipientAccount) {
                // TODO Auto-generated method stub
                Attachment.AutomatedTransactionsCreation attachment =
                        (Attachment.AutomatedTransactionsCreation) transaction.getAttachment();
                Long atId = transaction.getId();
                //System.out.println("Applying AT attachent");
                AT.addAT(transaction.getId(), transaction.getSenderId(), attachment.getName(),
                        attachment.getDescription(), attachment.getCreationBytes(), transaction.getHeight());
                //System.out.println("At with id "+atId+" successfully applied");
            }


            @Override
            public boolean canHaveRecipient() {
                // TODO Auto-generated method stub
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

            @Override
            public String getName() {
                return "AutomatedTransactionsCreation";
            }

            @Override
            Fee getBaselineFee(Transaction transaction) {
                Attachment.AutomatedTransactionsCreation attachment =
                        (Attachment.AutomatedTransactionsCreation) transaction.getAttachment();
                long totalPages = 0;
                try {
                    totalPages = AT_Controller.checkCreationBytes(attachment.getCreationBytes(), Xin.getBlockchain()
                            .getHeight());
                } catch (AT_Exception e) {
                    throw new RuntimeException("Invalid AT creation bytes", e);
                }
                long requiredFee = Constants.FEE_AUTOMATED_TRANSACTION_CREATE_INITIAL_CONSTANT +
                        (totalPages * AT_Constants.getInstance().COST_PER_PAGE(transaction.getHeight()));

                return new Fee.ConstantFee(requiredFee);
            }
        };

        public static final TransactionType AT_PAYMENT = new AutomatedTransactions() {
            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_AT_PAYMENT;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                // return null;
                return LedgerEvent.AT_PAYMENT;
            }

            @Override
            AbstractAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion) throws XinException
                    .NotValidException {
                return Attachment.AT_PAYMENT;
            }

            @Override
            AbstractAttachment parseAttachment(JSONObject attachmentData) throws XinException.NotValidException {
                return Attachment.AT_PAYMENT;
            }

            @Override
            void doValidateAttachment(Transaction transaction) throws XinException.ValidationException {

                throw new XinException.NotValidException("AT payment never validates");
            }

            @Override
            void applyAttachment(Transaction transaction,
                                 Account senderAccount, Account recipientAccount) {
                // TODO Auto-generated method stub

            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            final public boolean isSigned() {
                return false;
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

            @Override
            public String getName() {
                return "AT Payment";
            }
        };

    }

    public static abstract class AccountControl extends TransactionType {

        private AccountControl() {
        }

        @Override
        public final byte getType() {
            return TransactionType.TYPE_ACCOUNT_CONTROL;
        }

        @Override
        final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
            return true;
        }

        @Override
        final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
        }

        public static final TransactionType EFFECTIVE_BALANCE_LEASING = new AccountControl() {

            @Override
            public final byte getSubtype() {
                return TransactionType.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING;
            }

            @Override
            public String getName() {
                return "EffectiveBalanceLeasing";
            }

            @Override
            Attachment.AccountControlEffectiveBalanceLeasing parseAttachment(ByteBuffer buffer, byte transactionVersion)
                    throws XinException.NotValidException {
                return new Attachment.AccountControlEffectiveBalanceLeasing(buffer, transactionVersion);
            }

            @Override
            Attachment.AccountControlEffectiveBalanceLeasing parseAttachment(JSONObject attachmentData)
                    throws XinException.NotValidException {
                return new Attachment.AccountControlEffectiveBalanceLeasing(attachmentData);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.AccountControlEffectiveBalanceLeasing attachment =
                        (Attachment.AccountControlEffectiveBalanceLeasing) transaction.getAttachment();
                Account.getAccount(transaction.getSenderId())
                        .leaseEffectiveBalance(transaction.getRecipientId(), attachment.getPeriod());
            }

            @Override
            void validateAttachment(Transaction transaction) throws XinException.ValidationException {
                Attachment.AccountControlEffectiveBalanceLeasing attachment =
                        (Attachment.AccountControlEffectiveBalanceLeasing) transaction.getAttachment();
                if (transaction.getSenderId() == transaction.getRecipientId()) {
                    throw new XinException.NotValidException("Account cannot lease balance to itself");
                }
                if (transaction.getAmountTQT() != 0) {
                    throw new XinException.NotValidException(
                            "Transaction amount must be 0 for effective balance leasing");
                }
                if (attachment.getPeriod() < Constants.LEASING_DELAY ||
                        attachment.getPeriod() > Constants.EFFECTIVE_LEASING_MAX_BLOCKS) {
                    throw new XinException.NotValidException(
                            "Invalid effective balance leasing period: " + attachment.getPeriod());
                }
                byte[] recipientPublicKey = Account.getPublicKey(transaction.getRecipientId());
                if (recipientPublicKey == null && Xin.getBlockchain().getHeight() > Constants.PHASING_BLOCK) {
                    throw new XinException.NotCurrentlyValidException("Invalid effective balance leasing: "
                            + " recipient account " + Long.toUnsignedString(transaction.getRecipientId()) +
                            " not found or no public key published");
                }
                if (transaction.getRecipientId() == Genesis.CREATOR_ID) {
                    throw new XinException.NotValidException("Leasing to Genesis account not allowed");
                }

                // Add locked account here?

                // todo add minimum balance sender account / Constants.EFFECTIVE_LEASING_MIN_BALANCE (also add to api)
                Account senderAccount = Account.getAccount(transaction.getSenderId());
                //This account is already checked for availability. So it wont be null
                Account recipientAccount = Account.getAccount(transaction.getRecipientId());
                //TODO:Is there a need to add any block id?


                if (senderAccount == null) {
                    throw new XinException.NotValidException("Invalid effective balance leasing: " +
                            "sender account " + Long.toUnsignedString(transaction.getSenderId()) +
                            " not found or no public key published");
                }
                if (senderAccount.getBalanceTQT() < Constants.EFFECTIVE_LEASING_MIN_BALANCE) {
                    throw new XinException.NotValidException("Invalid effective balance leasing: " +
                            "sender account " + Long.toUnsignedString(transaction.getSenderId()) +
                            " must have minimum " +
                            "balance of " + Constants.EFFECTIVE_LEASING_MIN_BALANCE);
                }

                if ((recipientAccount.getEffectiveBalanceTQT() + senderAccount.getBalanceTQT()) >
                        Constants.EFFECTIVE_LEASING_MAX_BALANCETQT) {
                    throw new XinException.NotValidException("Invalid effective balance leasing: " +
                            "recipient account " + Long.toUnsignedString(transaction.getSenderId()) + " have exceded " +
                            "maximum effective balance " + Constants.EFFECTIVE_LEASING_MAX_BALANCETQT);
                }

                long currentLeaseCount = Account.getAccountLeaseCount(transaction.getRecipientId());

                if (currentLeaseCount > Constants.EFFECTIVE_LEASING_MAX_ACCOUNTS) {
                    throw new XinException.NotValidException("Invalid effective balance leasing: " +
                            "recipient account " + Long.toUnsignedString(transaction.getSenderId()) + " have exceded " +
                            "maximum number of leases " + Constants.EFFECTIVE_LEASING_MAX_ACCOUNTS);
                }

            }

            @Override
            public boolean canHaveRecipient() {
                return true;
            }

            @Override
            public boolean isPhasingSafe() {
                return true;
            }

        };

        public static final TransactionType SET_PHASING_ONLY = new AccountControl() {

            @Override
            public byte getSubtype() {
                return SUBTYPE_ACCOUNT_CONTROL_PHASING_ONLY;
            }

            @Override
            public LedgerEvent getLedgerEvent() {
                return LedgerEvent.ACCOUNT_CONTROL_PHASING_ONLY;
            }

            @Override
            AbstractAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion) {
                return new Attachment.SetPhasingOnly(buffer, transactionVersion);
            }

            @Override
            AbstractAttachment parseAttachment(JSONObject attachmentData) {
                return new Attachment.SetPhasingOnly(attachmentData);
            }

            @Override
            void validateAttachment(Transaction transaction) throws ValidationException {
                Attachment.SetPhasingOnly attachment = (Attachment.SetPhasingOnly) transaction.getAttachment();
                VotingModel votingModel =
                        attachment.getPhasingParams().getVoteWeighting().getVotingModel();
                attachment.getPhasingParams().validate();
                if (votingModel == VotingModel.NONE) {
                    Account senderAccount = Account.getAccount(transaction.getSenderId());
                    if (senderAccount == null || !senderAccount.getControls().contains(ControlType.PHASING_ONLY)) {
                        throw new XinException.NotCurrentlyValidException(
                                "Phasing only account control is not currently enabled");
                    }
                } else if (votingModel == VotingModel.TRANSACTION || votingModel == VotingModel.HASH) {
                    throw new XinException.NotValidException(
                            "Invalid voting model " + votingModel + " for account control");
                }
                long maxFees = attachment.getMaxFees();
                long maxFeesLimit = (attachment.getPhasingParams().getVoteWeighting().isBalanceIndependent() ? 3 : 22) *
                        Constants.ONE_XIN;
                if (maxFees < 0 || (maxFees > 0 && maxFees < maxFeesLimit) || maxFees > Constants.MAX_BALANCE_TQT) {
                    throw new XinException.NotValidException(
                            String.format("Invalid max fees %f token", ((double) maxFees) / Constants.ONE_XIN));
                }
                short minDuration = attachment.getMinDuration();
                if (minDuration < 0 || (minDuration > 0 && minDuration < 3) ||
                        minDuration >= Constants.MAX_PHASING_DURATION) {
                    throw new XinException.NotValidException("Invalid min duration " + attachment.getMinDuration());
                }
                short maxDuration = attachment.getMaxDuration();
                if (maxDuration < 0 || (maxDuration > 0 && maxDuration < 3) ||
                        maxDuration >= Constants.MAX_PHASING_DURATION) {
                    throw new XinException.NotValidException("Invalid max duration " + maxDuration);
                }
                if (minDuration > maxDuration) {
                    throw new XinException.NotValidException(
                            String.format("Min duration %d cannot exceed max duration %d ",
                                    minDuration, maxDuration));
                }
            }

            @Override
            boolean isDuplicate(Transaction transaction, Map<TransactionType, Map<String, Integer>> duplicates) {
                return TransactionType
                        .isDuplicate(SET_PHASING_ONLY, Long.toUnsignedString(transaction.getSenderId()), duplicates,
                                true);
            }

            @Override
            void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
                Attachment.SetPhasingOnly attachment = (Attachment.SetPhasingOnly) transaction.getAttachment();
                AccountRestrictions.PhasingOnly.set(senderAccount, attachment);
            }

            @Override
            public boolean canHaveRecipient() {
                return false;
            }

            @Override
            public String getName() {
                return "SetPhasingOnly";
            }

            @Override
            public boolean isPhasingSafe() {
                return false;
            }

        };

    }


}
