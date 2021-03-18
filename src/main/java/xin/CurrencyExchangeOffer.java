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

import xin.AccountLedger.LedgerEvent;
import xin.db.DbClause;
import xin.db.DbIterator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public abstract class CurrencyExchangeOffer {

    public static final class AvailableOffers {

        private final long rateTQT;
        private final long units;
        private final long amountTQT;

        private AvailableOffers(long rateTQT, long units, long amountTQT) {
            this.rateTQT = rateTQT;
            this.units = units;
            this.amountTQT = amountTQT;
        }

        public long getRateTQT() {
            return rateTQT;
        }

        public long getUnits() {
            return units;
        }

        public long getAmountTQT() {
            return amountTQT;
        }

    }

    static {

        Xin.getBlockchainProcessor().addListener(block -> {

            if (block.getHeight() <= Constants.NON_GENESIS_BLOCK_START_HEIGHT) {
                return;
            }

            List<CurrencyBuyOffer> expired = new ArrayList<>();
            try (DbIterator<CurrencyBuyOffer> offers = CurrencyBuyOffer.getOffers(new DbClause.IntClause("expiration_height", block.getHeight()), 0, -1)) {
                for (CurrencyBuyOffer offer : offers) {
                    expired.add(offer);
                }
            }
            expired.forEach((offer) -> CurrencyExchangeOffer.removeOffer(LedgerEvent.CURRENCY_OFFER_EXPIRED, offer));
        }, BlockchainProcessor.Event.AFTER_BLOCK_APPLY);

    }

    static void publishOffer(Transaction transaction, Attachment.MonetarySystemPublishExchangeOffer attachment) {
        CurrencyBuyOffer previousOffer = CurrencyBuyOffer.getOffer(attachment.getCurrencyId(), transaction.getSenderId());
        if (previousOffer != null) {
            CurrencyExchangeOffer.removeOffer(LedgerEvent.CURRENCY_OFFER_REPLACED, previousOffer);
        }
        CurrencyBuyOffer.addOffer(transaction, attachment);
        CurrencySellOffer.addOffer(transaction, attachment);
    }

    private static AvailableOffers calculateTotal(List<CurrencyExchangeOffer> offers, final long units) {
        long totalAmountTQT = 0;
        long remainingUnits = units;
        long rateTQT = 0;
        for (CurrencyExchangeOffer offer : offers) {
            if (remainingUnits == 0) {
                break;
            }
            rateTQT = offer.getRateTQT();
            long curUnits = Math.min(Math.min(remainingUnits, offer.getSupply()), offer.getLimit());
            long curAmountTQT = Math.multiplyExact(curUnits, offer.getRateTQT());
            totalAmountTQT = Math.addExact(totalAmountTQT, curAmountTQT);
            remainingUnits = Math.subtractExact(remainingUnits, curUnits);
        }
        return new AvailableOffers(rateTQT, Math.subtractExact(units, remainingUnits), totalAmountTQT);
    }

    static final DbClause availableOnlyDbClause = new DbClause.LongClause("unit_limit", DbClause.Op.NE, 0)
            .and(new DbClause.LongClause("supply", DbClause.Op.NE, 0));

    public static AvailableOffers getAvailableToSell(final long currencyId, final long units) {
        return calculateTotal(getAvailableBuyOffers(currencyId, 0L), units);
    }

    private static List<CurrencyExchangeOffer> getAvailableBuyOffers(long currencyId, long minRateTQT) {
        List<CurrencyExchangeOffer> currencyExchangeOffers = new ArrayList<>();
        DbClause dbClause = new DbClause.LongClause("currency_id", currencyId).and(availableOnlyDbClause);
        if (minRateTQT > 0) {
            dbClause = dbClause.and(new DbClause.LongClause("rate", DbClause.Op.GTE, minRateTQT));
        }
        try (DbIterator<CurrencyBuyOffer> offers = CurrencyBuyOffer.getOffers(dbClause, 0, -1,
                " ORDER BY rate DESC, creation_height ASC, transaction_height ASC, transaction_index ASC ")) {
            for (CurrencyBuyOffer offer : offers) {
                currencyExchangeOffers.add(offer);
            }
        }
        return currencyExchangeOffers;
    }

    static void exchangeCurrencyForXIN(Transaction transaction, Account account, final long currencyId, final long rateTQT, final long units) {
        List<CurrencyExchangeOffer> currencyBuyOffers = getAvailableBuyOffers(currencyId, rateTQT);

        long totalAmountTQT = 0;
        long remainingUnits = units;
        for (CurrencyExchangeOffer offer : currencyBuyOffers) {
            if (remainingUnits == 0) {
                break;
            }
            long curUnits = Math.min(Math.min(remainingUnits, offer.getSupply()), offer.getLimit());
            long curAmountTQT = Math.multiplyExact(curUnits, offer.getRateTQT());

            totalAmountTQT = Math.addExact(totalAmountTQT, curAmountTQT);
            remainingUnits = Math.subtractExact(remainingUnits, curUnits);

            offer.decreaseLimitAndSupply(curUnits);
            long excess = offer.getCounterOffer().increaseSupply(curUnits);

            Account counterAccount = Account.getAccount(offer.getAccountId());
            counterAccount.addToBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), -curAmountTQT);
            counterAccount.addToCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), currencyId, curUnits);
            counterAccount.addToUnconfirmedCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), currencyId, excess);
            Exchange.addExchange(transaction, currencyId, offer, account.getId(), offer.getAccountId(), curUnits);
        }
        long transactionId = transaction.getId();
        account.addToBalanceAndUnconfirmedBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, transactionId, totalAmountTQT);
        account.addToCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, transactionId, currencyId, -(units - remainingUnits));
        account.addToUnconfirmedCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, transactionId, currencyId, remainingUnits);
    }

    public static AvailableOffers getAvailableToBuy(final long currencyId, final long units) {
        return calculateTotal(getAvailableSellOffers(currencyId, 0L), units);
    }

    private static List<CurrencyExchangeOffer> getAvailableSellOffers(long currencyId, long maxRateTQT) {
        List<CurrencyExchangeOffer> currencySellOffers = new ArrayList<>();
        DbClause dbClause = new DbClause.LongClause("currency_id", currencyId).and(availableOnlyDbClause);
        if (maxRateTQT > 0) {
            dbClause = dbClause.and(new DbClause.LongClause("rate", DbClause.Op.LTE, maxRateTQT));
        }
        try (DbIterator<CurrencySellOffer> offers = CurrencySellOffer.getOffers(dbClause, 0, -1,
                " ORDER BY rate ASC, creation_height ASC, transaction_height ASC, transaction_index ASC ")) {
            for (CurrencySellOffer offer : offers) {
                currencySellOffers.add(offer);
            }
        }
        return currencySellOffers;
    }

    static void exchangeXINForCurrency(Transaction transaction, Account account, final long currencyId, final long rateTQT, final long units) {
        List<CurrencyExchangeOffer> currencySellOffers = getAvailableSellOffers(currencyId, rateTQT);

        if (Xin.getBlockchain().getHeight() < Constants.SHUFFLING_BLOCK) {
            long totalUnits = 0;
            long totalAmountTQT = Math.multiplyExact(units, rateTQT);
            long remainingAmountTQT = totalAmountTQT;

            for (CurrencyExchangeOffer offer : currencySellOffers) {
                if (remainingAmountTQT == 0) {
                    break;
                }
                long curUnits = Math.min(Math.min(remainingAmountTQT / offer.getRateTQT(), offer.getSupply()), offer.getLimit());
                if (curUnits == 0) {
                    continue;
                }
                long curAmountTQT = Math.multiplyExact(curUnits, offer.getRateTQT());

                totalUnits = Math.addExact(totalUnits, curUnits);
                remainingAmountTQT = Math.subtractExact(remainingAmountTQT, curAmountTQT);

                offer.decreaseLimitAndSupply(curUnits);
                long excess = offer.getCounterOffer().increaseSupply(curUnits);

                Account counterAccount = Account.getAccount(offer.getAccountId());
                counterAccount.addToBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), curAmountTQT);
                counterAccount.addToUnconfirmedBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(),
                        Math.addExact(
                                Math.multiplyExact(curUnits - excess, offer.getRateTQT() - offer.getCounterOffer().getRateTQT()),
                                Math.multiplyExact(excess, offer.getRateTQT())
                        )
                );
                counterAccount.addToCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), currencyId, -curUnits);
                Exchange.addExchange(transaction, currencyId, offer, offer.getAccountId(), account.getId(), curUnits);
            }
            long transactionId = transaction.getId();
            account.addToCurrencyAndUnconfirmedCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, transactionId,
                    currencyId, totalUnits);
            account.addToBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, transactionId, -(totalAmountTQT - remainingAmountTQT));
            account.addToUnconfirmedBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, transactionId, remainingAmountTQT);
        } else {
            long totalAmountTQT = 0;
            long remainingUnits = units;

            for (CurrencyExchangeOffer offer : currencySellOffers) {
                if (remainingUnits == 0) {
                    break;
                }
                long curUnits = Math.min(Math.min(remainingUnits, offer.getSupply()), offer.getLimit());
                long curAmountTQT = Math.multiplyExact(curUnits, offer.getRateTQT());

                totalAmountTQT = Math.addExact(totalAmountTQT, curAmountTQT);
                remainingUnits = Math.subtractExact(remainingUnits, curUnits);

                offer.decreaseLimitAndSupply(curUnits);
                long excess = offer.getCounterOffer().increaseSupply(curUnits);

                Account counterAccount = Account.getAccount(offer.getAccountId());
                counterAccount.addToBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), curAmountTQT);
                counterAccount.addToUnconfirmedBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(),
                        Math.addExact(
                                Math.multiplyExact(curUnits - excess, offer.getRateTQT() - offer.getCounterOffer().getRateTQT()),
                                Math.multiplyExact(excess, offer.getRateTQT())
                        )
                );
                counterAccount.addToCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, offer.getId(), currencyId, -curUnits);
                Exchange.addExchange(transaction, currencyId, offer, offer.getAccountId(), account.getId(), curUnits);
            }
            long transactionId = transaction.getId();
            account.addToCurrencyAndUnconfirmedCurrencyUnits(LedgerEvent.CURRENCY_EXCHANGE, transactionId,
                    currencyId, Math.subtractExact(units, remainingUnits));
            account.addToBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, transactionId, -totalAmountTQT);
            account.addToUnconfirmedBalanceTQT(LedgerEvent.CURRENCY_EXCHANGE, transactionId, Math.multiplyExact(units, rateTQT) - totalAmountTQT);
        }
    }

    static void removeOffer(LedgerEvent event, CurrencyBuyOffer buyOffer) {
        CurrencySellOffer sellOffer = buyOffer.getCounterOffer();

        CurrencyBuyOffer.remove(buyOffer);
        CurrencySellOffer.remove(sellOffer);

        Account account = Account.getAccount(buyOffer.getAccountId());
        account.addToUnconfirmedBalanceTQT(event, buyOffer.getId(), Math.multiplyExact(buyOffer.getSupply(), buyOffer.getRateTQT()));
        account.addToUnconfirmedCurrencyUnits(event, buyOffer.getId(), buyOffer.getCurrencyId(), sellOffer.getSupply());
    }


    final long id;
    private final long currencyId;
    private final long accountId;
    private final long rateTQT;
    private long limit; // limit on the total sum of units for this offer across transactions
    private long supply; // total units supply for the offer
    private final int expirationHeight;
    private final int creationHeight;
    private final short transactionIndex;
    private final int transactionHeight;

    CurrencyExchangeOffer(long id, long currencyId, long accountId, long rateTQT, long limit, long supply,
                          int expirationHeight, int transactionHeight, short transactionIndex) {
        this.id = id;
        this.currencyId = currencyId;
        this.accountId = accountId;
        this.rateTQT = rateTQT;
        this.limit = limit;
        this.supply = supply;
        this.expirationHeight = expirationHeight;
        this.creationHeight = Xin.getBlockchain().getHeight();
        this.transactionIndex = transactionIndex;
        this.transactionHeight = transactionHeight;
    }

    CurrencyExchangeOffer(ResultSet rs) throws SQLException {
        this.id = rs.getLong("id");
        this.currencyId = rs.getLong("currency_id");
        this.accountId = rs.getLong("account_id");
        this.rateTQT = rs.getLong("rate");
        this.limit = rs.getLong("unit_limit");
        this.supply = rs.getLong("supply");
        this.expirationHeight = rs.getInt("expiration_height");
        this.creationHeight = rs.getInt("creation_height");
        this.transactionIndex = rs.getShort("transaction_index");
        this.transactionHeight = rs.getInt("transaction_height");
    }

    void save(Connection con, String table) throws SQLException {
        try (PreparedStatement pstmt = con.prepareStatement("MERGE INTO " + table + " (id, currency_id, account_id, "
                + "rate, unit_limit, supply, expiration_height, creation_height, transaction_index, transaction_height, height, latest) "
                + "KEY (id, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)")) {
            int i = 0;
            pstmt.setLong(++i, this.id);
            pstmt.setLong(++i, this.currencyId);
            pstmt.setLong(++i, this.accountId);
            pstmt.setLong(++i, this.rateTQT);
            pstmt.setLong(++i, this.limit);
            pstmt.setLong(++i, this.supply);
            pstmt.setInt(++i, this.expirationHeight);
            pstmt.setInt(++i, this.creationHeight);
            pstmt.setShort(++i, this.transactionIndex);
            pstmt.setInt(++i, this.transactionHeight);
            pstmt.setInt(++i, Xin.getBlockchain().getHeight());
            pstmt.executeUpdate();
        }
    }

    public long getId() {
        return id;
    }

    public long getCurrencyId() {
        return currencyId;
    }

    public long getAccountId() {
        return accountId;
    }

    public long getRateTQT() {
        return rateTQT;
    }

    public long getLimit() {
        return limit;
    }

    public long getSupply() {
        return supply;
    }

    public int getExpirationHeight() {
        return expirationHeight;
    }

    public int getHeight() {
        return creationHeight;
    }

    public abstract CurrencyExchangeOffer getCounterOffer();

    long increaseSupply(long delta) {
        long excess = Math.max(Math.addExact(supply, Math.subtractExact(delta, limit)), 0);
        supply += delta - excess;
        return excess;
    }

    void decreaseLimitAndSupply(long delta) {
        limit -= delta;
        supply -= delta;
    }
}
