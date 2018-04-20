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

package xin;

import xin.XinException.NotValidException;
import xin.db.DbClause;
import xin.db.DbIterator;
import xin.db.DbKey;
import xin.db.VersionedEntityDbTable;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Subscription {

    public static boolean isEnabled() {
        if (Xin.getBlockchain().getLastBlock().getHeight() >= Constants.SUBSCRIPTION_START_BLOCK) {
            return true;
        }

        return false;
    }

    private static final DbKey.LongKeyFactory<Subscription> subscriptionDbKeyFactory = new DbKey.LongKeyFactory<Subscription>("id") {
        @Override
        public DbKey newKey(Subscription subscription) {
            return subscription.dbKey;
        }
    };

    private static final VersionedEntityDbTable<Subscription> subscriptionTable = new VersionedEntityDbTable<Subscription>("subscription", subscriptionDbKeyFactory) {
        @Override
        protected Subscription load(Connection con, ResultSet rs, DbKey dbKey) throws SQLException {
            return new Subscription(rs);
        }

        @Override
        protected void save(Connection con, Subscription subscription) throws SQLException {
            subscription.save(con);
        }

        @Override
        protected String defaultSort() {
            return " ORDER BY time_next ASC, id ASC ";
        }
    };

    private static final List<TransactionImpl> paymentTransactions = new ArrayList<>();
    private static final List<Subscription> appliedSubscriptions = new ArrayList<>();
    private static final Set<Long> removeSubscriptions = new HashSet<>();

    public static long getFee() {
        return Constants.ONE_XIN;
    }

    static void init() {
    }


    public static DbIterator<Subscription> getAllSubscriptions() {
        return subscriptionTable.getAll(0, -1);
    }

    private static DbClause getByParticipantClause(final long id) {
        return new DbClause(" (sender_id = ? OR recipient_id = ?) ") {
            @Override
            public int set(PreparedStatement pstmt, int index) throws SQLException {
                pstmt.setLong(index++, id);
                pstmt.setLong(index++, id);
                return index;
            }
        };
    }

    public static DbIterator<Subscription> getSubscriptionsByParticipant(Long accountId) {
        return subscriptionTable.getManyBy(getByParticipantClause(accountId), 0, -1);
    }

    public static DbIterator<Subscription> getIdSubscriptions(Long accountId) {
        return subscriptionTable.getManyBy(new DbClause.LongClause("sender_id", accountId), 0, -1);
    }

    public static DbIterator<Subscription> getSubscriptionsToId(Long accountId) {
        return subscriptionTable.getManyBy(new DbClause.LongClause("recipient_id", accountId), 0, -1);
    }

    public static Subscription getSubscription(Long id) {
        return subscriptionTable.get(subscriptionDbKeyFactory.newKey(id));
    }

    public static void addSubscription(Account sender,
                                       Account recipient,
                                       Long id,
                                       Long amountTQT,
                                       int startTimestamp,
                                       int frequency) {
        Subscription subscription = new Subscription(sender.getId(),
                recipient.getId(),
                id,
                amountTQT,
                frequency,
                startTimestamp);

        subscriptionTable.insert(subscription);
    }

    public static void removeSubscription(Long id) {
        Subscription subscription = subscriptionTable.get(subscriptionDbKeyFactory.newKey(id));
        if (subscription != null) {
            subscriptionTable.delete(subscription);
        }
    }

    private static DbClause getUpdateOnBlockClause(final int timestamp) {
        return new DbClause(" time_next <= ? ") {
            @Override
            public int set(PreparedStatement pstmt, int index) throws SQLException {
                pstmt.setInt(index++, timestamp);
                return index;
            }
        };
    }

    @SuppressWarnings("static-access")
    public static long calculateFees(int timestamp) {
        long totalFeeTQT = 0;
        DbIterator<Subscription> updateSubscriptions = subscriptionTable.getManyBy(getUpdateOnBlockClause(timestamp), 0, -1);
        List<Subscription> appliedSubscriptions = new ArrayList<>();
        for (Subscription subscription : updateSubscriptions) {
            if (removeSubscriptions.contains(subscription.getId())) {
                continue;
            }
            if (subscription.applyUnconfirmed()) {
                appliedSubscriptions.add(subscription);
            }
        }
        if (appliedSubscriptions.size() > 0) {
            for (Subscription subscription : appliedSubscriptions) {
                totalFeeTQT = Math.addExact(totalFeeTQT, subscription.getFee());
                subscription.undoUnconfirmed();
            }
        }
        return totalFeeTQT;
    }

    public static void clearRemovals() {
        removeSubscriptions.clear();
    }

    public static void addRemoval(Long id) {
        removeSubscriptions.add(id);
    }

    @SuppressWarnings("static-access")
    public static long applyUnconfirmed(int timestamp) {
        appliedSubscriptions.clear();
        long totalFees = 0;
        DbIterator<Subscription> updateSubscriptions = subscriptionTable.getManyBy(getUpdateOnBlockClause(timestamp), 0, -1);
        for (Subscription subscription : updateSubscriptions) {
            if (removeSubscriptions.contains(subscription.getId())) {
                continue;
            }
            if (subscription.applyUnconfirmed()) {
                appliedSubscriptions.add(subscription);
                totalFees += subscription.getFee();
            } else {
                removeSubscriptions.add(subscription.getId());
            }
        }
        return totalFees;
    }

	/*public static void undoUnconfirmed(List<Subscription> subscriptions) {
		for(Subscription subscription : subscriptions) {
			subscription.undoUnconfirmed();
		}
	}*/

    public static void applyConfirmed(Block block) {
        paymentTransactions.clear();
        for (Subscription subscription : appliedSubscriptions) {
            subscription.apply(block);
            subscriptionTable.insert(subscription);
        }
        if (paymentTransactions.size() > 0) {
            try (Connection con = Db.db.getConnection()) {
                TransactionDb.saveTransactions(con, paymentTransactions);
            } catch (SQLException e) {
                throw new RuntimeException(e.toString(), e);
            }
        }
        for (Long subscription : removeSubscriptions) {
            removeSubscription(subscription);
        }
    }

    private final Long senderId;
    private final Long recipientId;
    private final Long id;
    private final DbKey dbKey;
    private final Long amountTQT;
    private final int frequency;
    private volatile int timeNext;

    private Subscription(Long senderId,
                         Long recipientId,
                         Long id,
                         Long amountTQT,
                         int frequency,
                         int timeStart) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.id = id;
        this.dbKey = subscriptionDbKeyFactory.newKey(this.id);
        this.amountTQT = amountTQT;
        this.frequency = frequency;
        this.timeNext = timeStart + frequency;
    }

    private Subscription(ResultSet rs) throws SQLException {
        this.id = rs.getLong("id");
        this.dbKey = subscriptionDbKeyFactory.newKey(this.id);
        this.senderId = rs.getLong("sender_id");
        this.recipientId = rs.getLong("recipient_id");
        this.amountTQT = rs.getLong("amount");
        this.frequency = rs.getInt("frequency");
        this.timeNext = rs.getInt("time_next");
    }

    private void save(Connection con) throws SQLException {
        try (PreparedStatement pstmt = con.prepareStatement("MERGE INTO subscription (id, "
                + "sender_id, recipient_id, amount, frequency, time_next, height, latest) "
                + "KEY (id, height) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)")) {
            int i = 0;
            pstmt.setLong(++i, this.id);
            pstmt.setLong(++i, this.senderId);
            pstmt.setLong(++i, this.recipientId);
            pstmt.setLong(++i, this.amountTQT);
            pstmt.setInt(++i, this.frequency);
            pstmt.setInt(++i, this.timeNext);
            pstmt.setInt(++i, Xin.getBlockchain().getHeight());
            pstmt.executeUpdate();
        }
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getAmountTQT() {
        return amountTQT;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public Long getId() {
        return id;
    }

    public int getFrequency() {
        return frequency;
    }

    public int getTimeNext() {
        return timeNext;
    }

    private boolean applyUnconfirmed() {
        Account sender = Account.getAccount(senderId);
        long totalAmountTQT = Math.addExact(amountTQT, getFee());

        if (sender.getUnconfirmedBalanceTQT() < totalAmountTQT) {
            return false;
        }

        sender.addToUnconfirmedBalanceTQT(-totalAmountTQT);

        return true;
    }

    private void undoUnconfirmed() {
        Account sender = Account.getAccount(senderId);
        long totalAmountTQT = Math.addExact(amountTQT, getFee());

        sender.addToUnconfirmedBalanceTQT(totalAmountTQT);
    }

    private void apply(Block block) {
        Account sender = Account.getAccount(senderId);
        Account recipient = Account.getAccount(recipientId);

        long totalAmountTQT = Math.addExact(amountTQT, getFee());

        sender.addToBalanceTQT(-totalAmountTQT);
        recipient.addToBalanceAndUnconfirmedBalanceTQT(amountTQT);

        Attachment.AbstractAttachment attachment = new Attachment.AdvancedPaymentSubscriptionPayment(id);
        
        TransactionImpl.BuilderImpl builder = new TransactionImpl.BuilderImpl((byte) 1,
                sender.getPublicKey(senderId), amountTQT,
                getFee(),
                (short) 1440, attachment);

        try {
            builder.senderId(senderId)
                    .recipientId(recipientId)
                    .blockId(block.getId())
                    .height(block.getHeight())
                    .blockTimestamp(block.getTimestamp())
                    .timestamp(timeNext)
                    .ecBlockHeight(0)
                    .ecBlockId(0L);
            TransactionImpl transaction = builder.build();
            if (!TransactionDb.hasTransaction(transaction.getId())) {
                paymentTransactions.add(transaction);
            }
        } catch (NotValidException e) {
            throw new RuntimeException("Failed to build subscription payment transaction");
        }

        timeNext += frequency;
    }
}
