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

package xin.api;

import xin.*;
import xin.AccountLedger.LedgerEntry;
import xin.at.AT_API_Helper;
import xin.crypto.Crypto;
import xin.crypto.EncryptedData;
import xin.db.DbIterator;
import xin.peer.Hallmark;
import xin.peer.Peer;
import xin.util.Convert;
import xin.util.Filter;
import xin.util.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public final class JSONData {

    static JSONObject alias(Alias alias) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", alias.getAccountId());
        json.put("aliasName", alias.getAliasName());
        json.put("aliasURI", alias.getAliasURI());
        json.put("timestamp", alias.getTimestamp());
        json.put("alias", Long.toUnsignedString(alias.getId()));
        Alias.Offer offer = Alias.getOffer(alias);
        if (offer != null) {
            json.put("priceTQT", String.valueOf(offer.getPriceTQT()));
            if (offer.getBuyerId() != 0) {
                json.put("buyer", Long.toUnsignedString(offer.getBuyerId()));
            }
        }
        return json;
    }

    static JSONObject accountBalance(Account account, boolean includeEffectiveBalance) {
        return accountBalance(account, includeEffectiveBalance, Xin.getBlockchain().getHeight());
    }

    static JSONObject accountBalance(Account account, boolean includeEffectiveBalance, int height) {
        JSONObject json = new JSONObject();
        if (account == null) {
            json.put("balanceTQT", "0");
            json.put("unconfirmedBalanceTQT", "0");
            json.put("forgedBalanceTQT", "0");
            if (includeEffectiveBalance) {
                json.put("effectiveBalance", "0");
                json.put("guaranteedBalanceTQT", "0");
            }
        } else {
            json.put("balanceTQT", String.valueOf(account.getBalanceTQT()));
            json.put("unconfirmedBalanceTQT", String.valueOf(account.getUnconfirmedBalanceTQT()));
            json.put("forgedBalanceTQT", String.valueOf(account.getForgedBalanceTQT()));
            if (includeEffectiveBalance) {
                json.put("effectiveBalance", account.getEffectiveBalanceTKN(height));
                json.put("guaranteedBalanceTQT", String.valueOf(account.getGuaranteedBalanceTQT(Constants.GUARANTEED_BALANCE_CONFIRMATIONS, height)));
            }
        }
        return json;
    }

    static JSONObject lessor(Account account, boolean includeEffectiveBalance) {
        JSONObject json = new JSONObject();
        Account.AccountLease accountLease = account.getAccountLease();
        if (accountLease.getCurrentLesseeId() != 0) {

            putAccount(json, "lessor",  accountLease.getLessorId() );

            putAccount(json, "currentLessee", accountLease.getCurrentLesseeId());
            json.put("currentHeightFrom", String.valueOf(accountLease.getCurrentLeasingHeightFrom()));
            json.put("currentHeightTo", String.valueOf(accountLease.getCurrentLeasingHeightTo()));

            if (includeEffectiveBalance) {
                json.put("effectiveBalance", String.valueOf(account.getGuaranteedBalanceTQT() / Constants.ONE_XIN));
            }

        }
        if (accountLease.getNextLesseeId() != 0) {
            putAccount(json, "nextLessee", accountLease.getNextLesseeId());
            json.put("nextHeightFrom", String.valueOf(accountLease.getNextLeasingHeightFrom()));
            json.put("nextHeightTo", String.valueOf(accountLease.getNextLeasingHeightTo()));
        }
        return json;
    }

    static JSONObject asset(Asset asset, boolean includeCounts) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", asset.getAccountId());
        json.put("name", asset.getName());
        json.put("description", asset.getDescription());
        json.put("decimals", asset.getDecimals());
        json.put("initialQuantityQNT", String.valueOf(asset.getInitialQuantityQNT()));
        json.put("quantityQNT", String.valueOf(asset.getQuantityQNT()));
        json.put("asset", Long.toUnsignedString(asset.getId()));
        if (includeCounts) {
            json.put("numberOfTrades", Trade.getTradeCount(asset.getId()));
            json.put("numberOfTransfers", AssetTransfer.getTransferCount(asset.getId()));
            json.put("numberOfAccounts", Account.getAssetAccountCount(asset.getId()));
        }
        return json;
    }

    static JSONObject currency(Currency currency, boolean includeCounts){
        return currency(currency,includeCounts,false);
    }

    static JSONObject currency(Currency currency, boolean includeCounts,boolean includeAmounts) {
        JSONObject json = new JSONObject();
        json.put("currency", Long.toUnsignedString(currency.getId()));
        putAccount(json, "account", currency.getAccountId());
        json.put("name", currency.getName());
        json.put("code", currency.getCode());
        json.put("description", currency.getDescription());
        json.put("type", currency.getType());
        json.put("initialSupply", String.valueOf(currency.getInitialSupply()));
        json.put("currentSupply", String.valueOf(currency.getCurrentSupply()));
        json.put("reserveSupply", String.valueOf(currency.getReserveSupply()));
        json.put("maxSupply", String.valueOf(currency.getMaxSupply()));
        json.put("creationHeight", currency.getCreationHeight());
        json.put("issuanceHeight", currency.getIssuanceHeight());
        json.put("minReservePerUnitTQT", String.valueOf(currency.getMinReservePerUnitTQT()));
        json.put("currentReservePerUnitTQT", String.valueOf(currency.getCurrentReservePerUnitTQT()));
        json.put("minDifficulty", currency.getMinDifficulty());
        json.put("maxDifficulty", currency.getMaxDifficulty());
        json.put("algorithm", currency.getAlgorithm());
        json.put("decimals", currency.getDecimals());

        if (includeCounts) {
            json.put("numberOfExchanges", Exchange.getExchangeCount(currency.getId()));
            json.put("numberOfTransfers", CurrencyTransfer.getTransferCount(currency.getId()));
        }

        if(includeAmounts){
            json.put("totalReserveSupply",CurrencyFounder.getTotalAmountReserved(currency.getId()));
        }

        JSONArray types = new JSONArray();
        for (CurrencyType type : CurrencyType.values()) {
            if (currency.is(type)) {
                types.add(type.toString());
            }
        }
        json.put("types", types);

        return json;
    }

    static JSONObject currencyFounder(CurrencyFounder founder) {
        JSONObject json = new JSONObject();
        json.put("currency", Long.toUnsignedString(founder.getCurrencyId()));
        putAccount(json, "account", founder.getAccountId());
        json.put("amountPerUnitTQT", String.valueOf(founder.getAmountPerUnitTQT()));
        return json;
    }

    static JSONObject accountAsset(Account.AccountAsset accountAsset, boolean includeAccount, boolean includeAssetInfo ) {


      Asset asset = Asset.getAsset( accountAsset.getAssetId() );

        JSONObject json = new JSONObject();

        if (includeAccount) {
            putAccount(json, "issuerAccount", asset.getAccountId());
        }

        json.put("asset", Long.toUnsignedString(accountAsset.getAssetId()));
        json.put("quantityQNT", String.valueOf(accountAsset.getQuantityQNT()));
        json.put("unconfirmedQuantityQNT", String.valueOf(accountAsset.getUnconfirmedQuantityQNT()));

        if (includeAssetInfo) {
          putAssetInfo(json, accountAsset.getAssetId() );
        }

        // if (includeCounts) {
            json.put("numberOfTrades", Trade.getTradeCount( accountAsset.getAssetId() ));
            json.put("numberOfTransfers", AssetTransfer.getTransferCount( accountAsset.getAssetId() ));
            json.put("numberOfAccounts", Account.getAssetAccountCount( accountAsset.getAssetId() ));
        // }

        json.put("numberOfAccounts", Account.getAssetAccountCount( accountAsset.getAssetId() ));

        return json;
    }

    static JSONObject accountCurrency(Account.AccountCurrency accountCurrency, boolean includeAccount, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();

        if (includeAccount) {
            putAccount(json, "account", accountCurrency.getAccountId());
        }
        json.put("currency", Long.toUnsignedString(accountCurrency.getCurrencyId()));
        json.put("units", String.valueOf(accountCurrency.getUnits()));
        json.put("unconfirmedUnits", String.valueOf(accountCurrency.getUnconfirmedUnits()));

        if (includeCurrencyInfo) {
            putCurrencyInfo(json, accountCurrency.getCurrencyId());
        }

        json.put("numberOfExchanges", Exchange.getExchangeCount( accountCurrency.getCurrencyId() ));
        json.put("numberOfTransfers", CurrencyTransfer.getTransferCount( accountCurrency.getCurrencyId() ));

        return json;
    }

    static JSONObject accountProperty(Account.AccountProperty accountProperty, boolean includeAccount, boolean includeSetter) {
        JSONObject json = new JSONObject();
        if (includeAccount) {
            putAccount(json, "recipient", accountProperty.getRecipientId());
        }
        if (includeSetter) {
            putAccount(json, "setter", accountProperty.getSetterId());
        }
        json.put("property", accountProperty.getProperty());
        json.put("value", accountProperty.getValue());
        return json;
    }

    static JSONObject askOrder(Order.Ask order) {
        JSONObject json = order(order);
        json.put("type", "ask");
        return json;
    }

    static JSONObject bidOrder(Order.Bid order) {
        JSONObject json = order(order);
        json.put("type", "bid");
        return json;
    }

    private static JSONObject order(Order order) {
        JSONObject json = new JSONObject();
        json.put("order", Long.toUnsignedString(order.getId()));
        json.put("asset", Long.toUnsignedString(order.getAssetId()));
        putAccount(json, "account", order.getAccountId());
        json.put("quantityQNT", String.valueOf(order.getQuantityQNT()));
        json.put("priceTQT", String.valueOf(order.getPriceTQT()));
        json.put("height", order.getHeight());
        json.put("transactionIndex", order.getTransactionIndex());
        json.put("transactionHeight", order.getTransactionHeight());

        putAssetInfo(json, order.getAssetId() );

        return json;
    }

    static JSONObject expectedAskOrder(Transaction transaction) {
        JSONObject json = expectedOrder(transaction);
        json.put("type", "ask");
        return json;
    }

    static JSONObject expectedBidOrder(Transaction transaction) {
        JSONObject json = expectedOrder(transaction);
        json.put("type", "bid");
        return json;
    }

    private static JSONObject expectedOrder(Transaction transaction) {
        JSONObject json = new JSONObject();
        Attachment.ColoredCoinsOrderPlacement attachment = (Attachment.ColoredCoinsOrderPlacement) transaction.getAttachment();
        json.put("order", transaction.getStringId());
        json.put("asset", Long.toUnsignedString(attachment.getAssetId()));
        putAccount(json, "account", transaction.getSenderId());
        json.put("quantityQNT", String.valueOf(attachment.getQuantityQNT()));
        json.put("priceTQT", String.valueOf(attachment.getPriceTQT()));
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject expectedOrderCancellation(Transaction transaction) {
        JSONObject json = new JSONObject();
        Attachment.ColoredCoinsOrderCancellation attachment = (Attachment.ColoredCoinsOrderCancellation) transaction.getAttachment();
        json.put("order", Long.toUnsignedString(attachment.getOrderId()));
        putAccount(json, "account", transaction.getSenderId());
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject offer(CurrencyExchangeOffer offer) {
        JSONObject json = new JSONObject();
        json.put("offer", Long.toUnsignedString(offer.getId()));
        putAccount(json, "account", offer.getAccountId());
        json.put("height", offer.getHeight());
        json.put("expirationHeight", offer.getExpirationHeight());
        json.put("currency", Long.toUnsignedString(offer.getCurrencyId()));
        json.put("rateTQT", String.valueOf(offer.getRateTQT()));
        json.put("limit", String.valueOf(offer.getLimit()));
        json.put("supply", String.valueOf(offer.getSupply()));

        putCurrencyInfo( json, offer.getCurrencyId()  );

        return json;
    }

    static JSONObject expectedBuyOffer(Transaction transaction) {
        JSONObject json = expectedOffer(transaction);
        Attachment.MonetarySystemPublishExchangeOffer attachment = (Attachment.MonetarySystemPublishExchangeOffer) transaction.getAttachment();
        json.put("rateTQT", String.valueOf(attachment.getBuyRateTQT()));
        json.put("limit", String.valueOf(attachment.getTotalBuyLimit()));
        json.put("supply", String.valueOf(attachment.getInitialBuySupply()));
        return json;
    }

    static JSONObject expectedSellOffer(Transaction transaction) {
        JSONObject json = expectedOffer(transaction);
        Attachment.MonetarySystemPublishExchangeOffer attachment = (Attachment.MonetarySystemPublishExchangeOffer) transaction.getAttachment();
        json.put("rateTQT", String.valueOf(attachment.getSellRateTQT()));
        json.put("limit", String.valueOf(attachment.getTotalSellLimit()));
        json.put("supply", String.valueOf(attachment.getInitialSellSupply()));
        return json;
    }

    private static JSONObject expectedOffer(Transaction transaction) {
        Attachment.MonetarySystemPublishExchangeOffer attachment = (Attachment.MonetarySystemPublishExchangeOffer) transaction.getAttachment();
        JSONObject json = new JSONObject();
        json.put("offer", transaction.getStringId());
        putAccount(json, "account", transaction.getSenderId());
        json.put("expirationHeight", attachment.getExpirationHeight());
        json.put("currency", Long.toUnsignedString(attachment.getCurrencyId()));
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject availableOffers(CurrencyExchangeOffer.AvailableOffers availableOffers) {
        JSONObject json = new JSONObject();
        json.put("rateTQT", String.valueOf(availableOffers.getRateTQT()));
        json.put("units", String.valueOf(availableOffers.getUnits()));
        json.put("amountTQT", String.valueOf(availableOffers.getAmountTQT()));
        return json;
    }

    static JSONObject shuffling(Shuffling shuffling, boolean includeHoldingInfo) {
        JSONObject json = new JSONObject();
        json.put("shuffling", Long.toUnsignedString(shuffling.getId()));
        putAccount(json, "issuer", shuffling.getIssuerId());
        json.put("holding", Long.toUnsignedString(shuffling.getHoldingId()));
        json.put("holdingType", shuffling.getHoldingType().getCode());
        if (shuffling.getAssigneeAccountId() != 0) {
            putAccount(json, "assignee", shuffling.getAssigneeAccountId());
        }
        json.put("amount", String.valueOf(shuffling.getAmount()));
        json.put("blocksRemaining", shuffling.getBlocksRemaining());
        json.put("participantCount", shuffling.getParticipantCount());
        json.put("registrantCount", shuffling.getRegistrantCount());
        json.put("stage", shuffling.getStage().getCode());
        json.put("shufflingStateHash", Convert.toHexString(shuffling.getStateHash()));
        json.put("shufflingFullHash", Convert.toHexString(shuffling.getFullHash()));
        JSONArray recipientPublicKeys = new JSONArray();
        for (byte[] recipientPublicKey : shuffling.getRecipientPublicKeys()) {
            recipientPublicKeys.add(Convert.toHexString(recipientPublicKey));
        }
        if (recipientPublicKeys.size() > 0) {
            json.put("recipientPublicKeys", recipientPublicKeys);
        }
        if (includeHoldingInfo && shuffling.getHoldingType() != HoldingType.XIN) {
            JSONObject holdingJson = new JSONObject();
            if (shuffling.getHoldingType() == HoldingType.ASSET) {
                putAssetInfo(holdingJson, shuffling.getHoldingId());
            } else if (shuffling.getHoldingType() == HoldingType.CURRENCY) {
                putCurrencyInfo(holdingJson, shuffling.getHoldingId());
            }
            json.put("holdingInfo", holdingJson);
        }
        return json;
    }

    static JSONObject participant(ShufflingParticipant participant) {
        JSONObject json = new JSONObject();
        json.put("shuffling", Long.toUnsignedString(participant.getShufflingId()));
        putAccount(json, "account", participant.getAccountId());
        putAccount(json, "nextAccount", participant.getNextAccountId());
        json.put("state", participant.getState().getCode());
        return json;
    }

    static JSONObject shuffler(Shuffler shuffler, boolean includeParticipantState) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", shuffler.getAccountId());
        putAccount(json, "recipient", Account.getId(shuffler.getRecipientPublicKey()));
        json.put("shufflingFullHash", Convert.toHexString(shuffler.getShufflingFullHash()));
        json.put("shuffling", Long.toUnsignedString(Convert.fullHashToId(shuffler.getShufflingFullHash())));
        if (shuffler.getFailedTransaction() != null) {
            json.put("failedTransaction", unconfirmedTransaction(shuffler.getFailedTransaction()));
            json.put("failureCause", shuffler.getFailureCause().getMessage());
        }
        if (includeParticipantState) {
            ShufflingParticipant participant = ShufflingParticipant.getParticipant(Convert.fullHashToId(shuffler.getShufflingFullHash()), shuffler.getAccountId());
            if (participant != null) {
                json.put("participantState", participant.getState().getCode());
            }
        }
        return json;
    }

    static JSONObject block(Block block, boolean includeTransactions, boolean includeExecutedPhased) {
        JSONObject json = new JSONObject();
        json.put("block", block.getStringId());
        json.put("height", block.getHeight());
        putAccount(json, "generator", block.getGeneratorId());
        json.put("generatorPublicKey", Convert.toHexString(block.getGeneratorPublicKey()));
        json.put("timestamp", block.getTimestamp());
        json.put("numberOfTransactions", block.getTransactions().size());
        json.put("totalAmountTQT", String.valueOf(block.getTotalAmountTQT()));
        json.put("totalFeeTQT", String.valueOf(block.getTotalFeeTQT()));
        json.put("payloadLength", block.getPayloadLength());
        json.put("version", block.getVersion());
        json.put("baseTarget", Long.toUnsignedString(block.getBaseTarget()));
        json.put("cumulativeDifficulty", block.getCumulativeDifficulty().toString());
        if (block.getPreviousBlockId() != 0) {
            json.put("previousBlock", Long.toUnsignedString(block.getPreviousBlockId()));
        }
        if (block.getNextBlockId() != 0) {
            json.put("nextBlock", Long.toUnsignedString(block.getNextBlockId()));
        }
        json.put("payloadHash", Convert.toHexString(block.getPayloadHash()));
        json.put("generationSignature", Convert.toHexString(block.getGenerationSignature()));
        if (block.getVersion() > 1) {
            json.put("previousBlockHash", Convert.toHexString(block.getPreviousBlockHash()));
        }
        json.put("blockSignature", Convert.toHexString(block.getBlockSignature()));
        JSONArray transactions = new JSONArray();
        if (includeTransactions) {
            block.getTransactions().forEach(transaction -> transactions.add(transaction(transaction)));
        } else {
            block.getTransactions().forEach(transaction -> transactions.add(transaction.getStringId()));
        }
        json.put("transactions", transactions);
        if (includeExecutedPhased) {
            JSONArray phasedTransactions = new JSONArray();
            try (DbIterator<PhasingPoll.PhasingPollResult> phasingPollResults = PhasingPoll.getApproved(block.getHeight())) {
                for (PhasingPoll.PhasingPollResult phasingPollResult : phasingPollResults) {
                    long phasedTransactionId = phasingPollResult.getId();
                    if (includeTransactions) {
                        phasedTransactions.add(transaction(Xin.getBlockchain().getTransaction(phasedTransactionId)));
                    } else {
                        phasedTransactions.add(Long.toUnsignedString(phasedTransactionId));
                    }
                }
            }
            json.put("executedPhasedTransactions", phasedTransactions);
        }
        return json;
    }

    static JSONObject encryptedData(EncryptedData encryptedData) {
        JSONObject json = new JSONObject();
        json.put("data", Convert.toHexString(encryptedData.getData()));
        json.put("nonce", Convert.toHexString(encryptedData.getNonce()));
        return json;
    }

    static JSONObject hallmark(Hallmark hallmark) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", Account.getId(hallmark.getPublicKey()));
        json.put("host", hallmark.getHost());
        json.put("port", hallmark.getPort());
        json.put("weight", hallmark.getWeight());
        String dateString = Hallmark.formatDate(hallmark.getDate());
        json.put("date", dateString);
        json.put("valid", hallmark.isValid());
        return json;
    }

    static JSONObject token(Token token) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", Account.getId(token.getPublicKey()));
        json.put("timestamp", token.getTimestamp());
        json.put("valid", token.isValid());
        return json;
    }

    static JSONObject peer(Peer peer) {
        JSONObject json = new JSONObject();
        json.put("address", peer.getHost());
        json.put("port", peer.getPort());
        json.put("state", peer.getState().ordinal());
        json.put("announcedAddress", peer.getAnnouncedAddress());
        json.put("shareAddress", peer.shareAddress());
        if (peer.getHallmark() != null) {
            json.put("hallmark", peer.getHallmark().getHallmarkString());
        }
        json.put("weight", peer.getWeight());
        json.put("downloadedVolume", peer.getDownloadedVolume());
        json.put("uploadedVolume", peer.getUploadedVolume());
        json.put("application", peer.getApplication());
        json.put("version", peer.getVersion());
        json.put("platform", peer.getPlatform());
        if (peer.getApiPort() != 0) {
            json.put("apiPort", peer.getApiPort());
        }
        if (peer.getApiSSLPort() != 0) {
            json.put("apiSSLPort", peer.getApiSSLPort());
        }
        json.put("blacklisted", peer.isBlacklisted());
        json.put("lastUpdated", peer.getLastUpdated());
        json.put("lastConnectAttempt", peer.getLastConnectAttempt());
        json.put("inbound", peer.isInbound());
        json.put("inboundWebSocket", peer.isInboundWebSocket());
        json.put("outboundWebSocket", peer.isOutboundWebSocket());
        if (peer.isBlacklisted()) {
            json.put("blacklistingCause", peer.getBlacklistingCause());
        }
        JSONArray servicesArray = new JSONArray();
        for (Peer.Service service : Peer.Service.values()) {
            if (peer.providesService(service)) {
                servicesArray.add(service.name());
            }
        }
        json.put("services", servicesArray);
        return json;
    }

    static JSONObject poll(Poll poll) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", poll.getAccountId());
        json.put("poll", Long.toUnsignedString(poll.getId()));
        json.put("name", poll.getName());
        json.put("description", poll.getDescription());
        JSONArray options = new JSONArray();
        Collections.addAll(options, poll.getOptions());
        json.put("options", options);
        json.put("finishHeight", poll.getFinishHeight());
        json.put("minNumberOfOptions", poll.getMinNumberOfOptions());
        json.put("maxNumberOfOptions", poll.getMaxNumberOfOptions());
        json.put("minRangeValue", poll.getMinRangeValue());
        json.put("maxRangeValue", poll.getMaxRangeValue());
        putVoteWeighting(json, poll.getVoteWeighting());
        json.put("finished", poll.isFinished());
        json.put("timestamp", poll.getTimestamp());
        return json;
    }

    static JSONObject pollResults(Poll poll, List<Poll.OptionResult> results, VoteWeighting voteWeighting) {
        JSONObject json = new JSONObject();
        json.put("poll", Long.toUnsignedString(poll.getId()));
        if (voteWeighting.getMinBalanceModel() == VoteWeighting.MinBalanceModel.ASSET) {
            json.put("decimals", Asset.getAsset(voteWeighting.getHoldingId()).getDecimals());
        } else if (voteWeighting.getMinBalanceModel() == VoteWeighting.MinBalanceModel.CURRENCY) {
            Currency currency = Currency.getCurrency(voteWeighting.getHoldingId());
            if (currency != null) {
                json.put("decimals", currency.getDecimals());
            } else {
                Transaction currencyIssuance = Xin.getBlockchain().getTransaction(voteWeighting.getHoldingId());
                Attachment.MonetarySystemCurrencyIssuance currencyIssuanceAttachment = (Attachment.MonetarySystemCurrencyIssuance) currencyIssuance.getAttachment();
                json.put("decimals", currencyIssuanceAttachment.getDecimals());
            }
        }
        putVoteWeighting(json, voteWeighting);
        json.put("finished", poll.isFinished());
        JSONArray options = new JSONArray();
        Collections.addAll(options, poll.getOptions());
        json.put("options", options);

        JSONArray resultsJson = new JSONArray();
        for (Poll.OptionResult option : results) {
            JSONObject optionJSON = new JSONObject();
            if (option != null) {
                optionJSON.put("result", String.valueOf(option.getResult()));
                optionJSON.put("weight", String.valueOf(option.getWeight()));
            } else {
                optionJSON.put("result", "");
                optionJSON.put("weight", "0");
            }
            resultsJson.add(optionJSON);
        }
        json.put("results", resultsJson);
        return json;
    }

    interface VoteWeighter {
        long calcWeight(long voterId);
    }

    static JSONObject vote(Vote vote, VoteWeighter weighter) {
        JSONObject json = new JSONObject();
        putAccount(json, "voter", vote.getVoterId());
        json.put("transaction", Long.toUnsignedString(vote.getId()));
        JSONArray votesJson = new JSONArray();
        for (byte v : vote.getVoteBytes()) {
            if (v == Constants.NO_VOTE_VALUE) {
                votesJson.add("");
            } else {
                votesJson.add(Byte.toString(v));
            }
        }
        json.put("votes", votesJson);
        if (weighter != null) {
            json.put("weight", String.valueOf(weighter.calcWeight(vote.getVoterId())));
        }
        return json;
    }

    static JSONObject phasingPoll(PhasingPoll poll, boolean countVotes) {
        JSONObject json = new JSONObject();
        json.put("transaction", Long.toUnsignedString(poll.getId()));
        json.put("transactionFullHash", Convert.toHexString(poll.getFullHash()));
        json.put("finishHeight", poll.getFinishHeight());
        json.put("quorum", String.valueOf(poll.getQuorum()));
        putAccount(json, "account", poll.getAccountId());
        JSONArray whitelistJson = new JSONArray();
        for (long accountId : poll.getWhitelist()) {
            JSONObject whitelisted = new JSONObject();
            putAccount(whitelisted, "whitelisted", accountId);
            whitelistJson.add(whitelisted);
        }
        json.put("whitelist", whitelistJson);
        List<byte[]> linkedFullHashes = poll.getLinkedFullHashes();
        if (linkedFullHashes.size() > 0) {
            JSONArray linkedFullHashesJSON = new JSONArray();
            for (byte[] hash : linkedFullHashes) {
                linkedFullHashesJSON.add(Convert.toHexString(hash));
            }
            json.put("linkedFullHashes", linkedFullHashesJSON);
        }
        if (poll.getHashedSecret() != null) {
            json.put("hashedSecret", Convert.toHexString(poll.getHashedSecret()));
        }
        putVoteWeighting(json, poll.getVoteWeighting());
        PhasingPoll.PhasingPollResult phasingPollResult = PhasingPoll.getResult(poll.getId());
        json.put("finished", phasingPollResult != null);
        if (phasingPollResult != null) {
            json.put("approved", phasingPollResult.isApproved());
            json.put("result", String.valueOf(phasingPollResult.getResult()));
            json.put("executionHeight", phasingPollResult.getHeight());
        } else if (countVotes) {
            json.put("result", String.valueOf(poll.countVotes()));
        }
        return json;
    }

    static JSONObject phasingPollResult(PhasingPoll.PhasingPollResult phasingPollResult) {
        JSONObject json = new JSONObject();
        json.put("transaction", Long.toUnsignedString(phasingPollResult.getId()));
        json.put("approved", phasingPollResult.isApproved());
        json.put("result", String.valueOf(phasingPollResult.getResult()));
        json.put("executionHeight", phasingPollResult.getHeight());
        return json;
    }

    static JSONObject phasingPollVote(PhasingVote vote) {
        JSONObject json = new JSONObject();
        JSONData.putAccount(json, "voter", vote.getVoterId());
        json.put("transaction", Long.toUnsignedString(vote.getVoteId()));
        return json;
    }

    private static void putVoteWeighting(JSONObject json, VoteWeighting voteWeighting) {
        json.put("votingModel", voteWeighting.getVotingModel().getCode());
        json.put("minBalance", String.valueOf(voteWeighting.getMinBalance()));
        json.put("minBalanceModel", voteWeighting.getMinBalanceModel().getCode());
        if (voteWeighting.getHoldingId() != 0) {
            json.put("holding", Long.toUnsignedString(voteWeighting.getHoldingId()));
        }
    }

    static JSONObject phasingOnly(AccountRestrictions.PhasingOnly phasingOnly) {
        JSONObject json = new JSONObject();
        putAccount(json, "account", phasingOnly.getAccountId());
        json.put("quorum", String.valueOf(phasingOnly.getPhasingParams().getQuorum()));
        JSONArray whitelistJson = new JSONArray();
        for (long accountId : phasingOnly.getPhasingParams().getWhitelist()) {
            JSONObject whitelisted = new JSONObject();
            putAccount(whitelisted, "whitelisted", accountId);
            whitelistJson.add(whitelisted);
        }
        json.put("whitelist", whitelistJson);
        json.put("maxFees", String.valueOf(phasingOnly.getMaxFees()));
        json.put("minDuration", phasingOnly.getMinDuration());
        json.put("maxDuration", phasingOnly.getMaxDuration());
        putVoteWeighting(json, phasingOnly.getPhasingParams().getVoteWeighting());
        return json;
    }

    static JSONObject trade(Trade trade, boolean includeAssetInfo) {
        JSONObject json = new JSONObject();
        json.put("timestamp", trade.getTimestamp());
        json.put("quantityQNT", String.valueOf(trade.getQuantityQNT()));
        json.put("priceTQT", String.valueOf(trade.getPriceTQT()));
        json.put("asset", Long.toUnsignedString(trade.getAssetId()));
        json.put("askOrder", Long.toUnsignedString(trade.getAskOrderId()));
        json.put("bidOrder", Long.toUnsignedString(trade.getBidOrderId()));
        json.put("askOrderHeight", trade.getAskOrderHeight());
        json.put("bidOrderHeight", trade.getBidOrderHeight());
        putAccount(json, "seller", trade.getSellerId());
        putAccount(json, "buyer", trade.getBuyerId());
        json.put("block", Long.toUnsignedString(trade.getBlockId()));
        json.put("height", trade.getHeight());
        json.put("tradeType", trade.isBuy() ? "buy" : "sell");
        if (includeAssetInfo) {
            putAssetInfo(json, trade.getAssetId());
        }
        return json;
    }

    static JSONObject assetTransfer(AssetTransfer assetTransfer, boolean includeAssetInfo) {
        JSONObject json = new JSONObject();
        json.put("assetTransfer", Long.toUnsignedString(assetTransfer.getId()));
        json.put("asset", Long.toUnsignedString(assetTransfer.getAssetId()));
        putAccount(json, "sender", assetTransfer.getSenderId());
        putAccount(json, "recipient", assetTransfer.getRecipientId());
        json.put("quantityQNT", String.valueOf(assetTransfer.getQuantityQNT()));
        json.put("height", assetTransfer.getHeight());
        json.put("timestamp", assetTransfer.getTimestamp());
        if (includeAssetInfo) {
            putAssetInfo(json, assetTransfer.getAssetId());
        }
        return json;
    }

    static JSONObject expectedAssetTransfer(Transaction transaction, boolean includeAssetInfo) {
        JSONObject json = new JSONObject();
        Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer) transaction.getAttachment();
        json.put("assetTransfer", transaction.getStringId());
        json.put("asset", Long.toUnsignedString(attachment.getAssetId()));
        putAccount(json, "sender", transaction.getSenderId());
        putAccount(json, "recipient", transaction.getRecipientId());
        json.put("quantityQNT", String.valueOf(attachment.getQuantityQNT()));
        if (includeAssetInfo) {
            putAssetInfo(json, attachment.getAssetId());
        }
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject assetDelete(AssetDelete assetDelete, boolean includeAssetInfo) {
        JSONObject json = new JSONObject();
        json.put("assetDelete", Long.toUnsignedString(assetDelete.getId()));
        json.put("asset", Long.toUnsignedString(assetDelete.getAssetId()));
        putAccount(json, "account", assetDelete.getAccountId());
        json.put("quantityQNT", String.valueOf(assetDelete.getQuantityQNT()));
        json.put("height", assetDelete.getHeight());
        json.put("timestamp", assetDelete.getTimestamp());
        if (includeAssetInfo) {
            putAssetInfo(json, assetDelete.getAssetId());
        }
        return json;
    }

    static JSONObject expectedAssetDelete(Transaction transaction, boolean includeAssetInfo) {
        JSONObject json = new JSONObject();
        Attachment.ColoredCoinsAssetDelete attachment = (Attachment.ColoredCoinsAssetDelete) transaction.getAttachment();
        json.put("assetDelete", transaction.getStringId());
        json.put("asset", Long.toUnsignedString(attachment.getAssetId()));
        putAccount(json, "account", transaction.getSenderId());
        json.put("quantityQNT", String.valueOf(attachment.getQuantityQNT()));
        if (includeAssetInfo) {
            putAssetInfo(json, attachment.getAssetId());
        }
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject assetDividend(AssetDividend assetDividend) {
        JSONObject json = new JSONObject();
        json.put("assetDividend", Long.toUnsignedString(assetDividend.getId()));
        json.put("asset", Long.toUnsignedString(assetDividend.getAssetId()));
        json.put("amountTQTPerQNT", String.valueOf(assetDividend.getAmountTQTPerQNT()));
        json.put("totalDividend", String.valueOf(assetDividend.getTotalDividend()));
        json.put("dividendHeight", assetDividend.getDividendHeight());
        json.put("numberOfAccounts", assetDividend.getNumAccounts());
        json.put("height", assetDividend.getHeight());
        json.put("timestamp", assetDividend.getTimestamp());
        return json;
    }

    static JSONObject currencyTransfer(CurrencyTransfer transfer, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();
        json.put("transfer", Long.toUnsignedString(transfer.getId()));
        json.put("currency", Long.toUnsignedString(transfer.getCurrencyId()));
        putAccount(json, "sender", transfer.getSenderId());
        putAccount(json, "recipient", transfer.getRecipientId());
        json.put("units", String.valueOf(transfer.getUnits()));
        json.put("height", transfer.getHeight());
        json.put("timestamp", transfer.getTimestamp());
        if (includeCurrencyInfo) {
            putCurrencyInfo(json, transfer.getCurrencyId());
        }
        return json;
    }

    static JSONObject expectedCurrencyTransfer(Transaction transaction, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();
        Attachment.MonetarySystemCurrencyTransfer attachment = (Attachment.MonetarySystemCurrencyTransfer) transaction.getAttachment();
        json.put("transfer", transaction.getStringId());
        json.put("currency", Long.toUnsignedString(attachment.getCurrencyId()));
        putAccount(json, "sender", transaction.getSenderId());
        putAccount(json, "recipient", transaction.getRecipientId());
        json.put("units", String.valueOf(attachment.getUnits()));
        if (includeCurrencyInfo) {
            putCurrencyInfo(json, attachment.getCurrencyId());
        }
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject exchange(Exchange exchange, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();
        json.put("transaction", Long.toUnsignedString(exchange.getTransactionId()));
        json.put("timestamp", exchange.getTimestamp());
        json.put("units", String.valueOf(exchange.getUnits()));
        json.put("rateTQT", String.valueOf(exchange.getRate()));
        json.put("currency", Long.toUnsignedString(exchange.getCurrencyId()));
        json.put("offer", Long.toUnsignedString(exchange.getOfferId()));
        putAccount(json, "seller", exchange.getSellerId());
        putAccount(json, "buyer", exchange.getBuyerId());
        json.put("block", Long.toUnsignedString(exchange.getBlockId()));
        json.put("height", exchange.getHeight());
        if (includeCurrencyInfo) {
            putCurrencyInfo(json, exchange.getCurrencyId());
        }
        return json;
    }

    static JSONObject exchangeRequest(ExchangeRequest exchangeRequest, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();
        json.put("transaction", Long.toUnsignedString(exchangeRequest.getId()));
        json.put("subtype", exchangeRequest.isBuy() ? MonetarySystem.EXCHANGE_BUY.getSubtype() : MonetarySystem.EXCHANGE_SELL.getSubtype());
        json.put("timestamp", exchangeRequest.getTimestamp());
        json.put("units", String.valueOf(exchangeRequest.getUnits()));
        json.put("rateTQT", String.valueOf(exchangeRequest.getRate()));
        json.put("height", exchangeRequest.getHeight());
        if (includeCurrencyInfo) {
            putCurrencyInfo(json, exchangeRequest.getCurrencyId());
        }
        return json;
    }

    static JSONObject expectedExchangeRequest(Transaction transaction, boolean includeCurrencyInfo) {
        JSONObject json = new JSONObject();
        json.put("transaction", transaction.getStringId());
        json.put("subtype", transaction.getType().getSubtype());
        Attachment.MonetarySystemExchange attachment = (Attachment.MonetarySystemExchange) transaction.getAttachment();
        json.put("units", String.valueOf(attachment.getUnits()));
        json.put("rateTQT", String.valueOf(attachment.getRateTQT()));
        if (includeCurrencyInfo) {
            putCurrencyInfo(json, attachment.getCurrencyId());
        }
        putExpectedTransaction(json, transaction);
        return json;
    }

    static JSONObject unconfirmedTransaction(Transaction transaction) {
        return unconfirmedTransaction(transaction, null);
    }

    static JSONObject escrowTransaction(Escrow escrow) {
        JSONObject json = new JSONObject();
        json.put("id", Convert.toUnsignedLong(escrow.getId()));
        json.put("sender", Convert.toUnsignedLong(escrow.getSenderId()));
        json.put("senderRS", Convert.rsAccount(escrow.getSenderId()));
        json.put("recipient", Convert.toUnsignedLong(escrow.getRecipientId()));
        json.put("recipientRS", Convert.rsAccount(escrow.getRecipientId()));
        json.put("amountTQT", Convert.toUnsignedLong(Escrow.getEscrowTransaction(escrow.getId()).getAmountTQT()));
        json.put("requiredSigners", escrow.getRequiredSigners());
        json.put("deadline", escrow.getDeadline());
        json.put("deadlineAction", Escrow.decisionToString(escrow.getDeadlineAction()));

        JSONArray signers = new JSONArray();
        for(Escrow.Decision decision : escrow.getDecisions()) {
            if(decision.getAccountId().equals(escrow.getSenderId()) ||
                    decision.getAccountId().equals(escrow.getRecipientId())) {
                continue;
            }
            JSONObject signerDetails = new JSONObject();
            signerDetails.put("id", Convert.toUnsignedLong(decision.getAccountId()));
            signerDetails.put("idRS", Convert.rsAccount(decision.getAccountId()));
            signerDetails.put("decision", Escrow.decisionToString(decision.getDecision()));
            signers.add(signerDetails);
        }
        json.put("signers", signers);
        return json;
    }

    static JSONObject subscription(Subscription subscription) {
        JSONObject json = new JSONObject();
        json.put("id", Convert.toUnsignedLong(subscription.getId()));
        putAccount(json, "sender", subscription.getSenderId());
        putAccount(json, "recipient", subscription.getRecipientId());
        json.put("amountTQT", Convert.toUnsignedLong(subscription.getAmountTQT()));
        json.put("frequency", subscription.getFrequency());
        json.put("timeNext", subscription.getTimeNext());
        return json;
    }

    static JSONObject unconfirmedTransaction(Transaction transaction, Filter<Appendix> filter) {
        JSONObject json = new JSONObject();
        json.put("type", transaction.getType().getType());
        json.put("subtype", transaction.getType().getSubtype());
        json.put("phased", transaction.getPhasing() != null);
        json.put("timestamp", transaction.getTimestamp());
        json.put("deadline", transaction.getDeadline());
        json.put("senderPublicKey", Convert.toHexString(transaction.getSenderPublicKey()));
        if (transaction.getRecipientId() != 0) {
            putAccount(json, "recipient", transaction.getRecipientId());
        }
        json.put("amountTQT", String.valueOf(transaction.getAmountTQT()));
        json.put("feeTQT", String.valueOf(transaction.getFeeTQT()));
        String referencedTransactionFullHash = transaction.getReferencedTransactionFullHash();
        if (referencedTransactionFullHash != null) {
            json.put("referencedTransactionFullHash", referencedTransactionFullHash);
        }
        byte[] signature = Convert.emptyToNull(transaction.getSignature());
        if (signature != null) {
            json.put("signature", Convert.toHexString(signature));
            json.put("signatureHash", Convert.toHexString(Crypto.sha256().digest(signature)));
            json.put("fullHash", transaction.getFullHash());
            json.put("transaction", transaction.getStringId());
        }

        // Ensure transaction ID for auto payments
        if (signature == null && !transaction.getType().isSigned()) {
            json.put("fullHash", transaction.getFullHash());
            json.put("transaction", transaction.getStringId());
        }

        JSONObject attachmentJSON = new JSONObject();
        if (filter == null) {
            for (Appendix appendage : transaction.getAppendages(true)) {
                attachmentJSON.putAll(appendage.getJSONObject());
            }
        } else {
            for (Appendix appendage : transaction.getAppendages(filter, true)) {
                attachmentJSON.putAll(appendage.getJSONObject());
            }
        }
        if (!attachmentJSON.isEmpty()) {
            for (Map.Entry entry : (Iterable<Map.Entry>) attachmentJSON.entrySet()) {
                if (entry.getValue() instanceof Long) {
                    entry.setValue(String.valueOf(entry.getValue()));
                }
            }
            json.put("attachment", attachmentJSON);
        }
        putAccount(json, "sender", transaction.getSenderId());
        json.put("height", transaction.getHeight());
        json.put("version", transaction.getVersion());
        if (transaction.getVersion() > 0) {
            json.put("ecBlockId", Long.toUnsignedString(transaction.getECBlockId()));
            json.put("ecBlockHeight", transaction.getECBlockHeight());
        }

        return json;
    }

    static JSONObject transaction(Transaction transaction) {
        return transaction(transaction, false);
    }

    static JSONObject transaction(Transaction transaction, boolean includePhasingResult) {
        JSONObject json = transaction(transaction, null);
        if (includePhasingResult && transaction.getPhasing() != null) {
            PhasingPoll.PhasingPollResult phasingPollResult = PhasingPoll.getResult(transaction.getId());
            if (phasingPollResult != null) {
                json.put("approved", phasingPollResult.isApproved());
                json.put("result", String.valueOf(phasingPollResult.getResult()));
                json.put("executionHeight", phasingPollResult.getHeight());
            }
        }
        return json;
    }

    static JSONObject transaction(Transaction transaction, Filter<Appendix> filter) {
        JSONObject json = unconfirmedTransaction(transaction, filter);
        json.put("block", Long.toUnsignedString(transaction.getBlockId()));
        json.put("confirmations", Xin.getBlockchain().getHeight() - transaction.getHeight());
        json.put("blockTimestamp", transaction.getBlockTimestamp());
        json.put("transactionIndex", transaction.getIndex());
        return json;
    }

    static JSONObject generator(Generator generator, int elapsedTime) {
        JSONObject response = new JSONObject();
        long deadline = generator.getDeadline();
        putAccount(response, "account", generator.getAccountId());
        response.put("deadline", deadline);
        response.put("hitTime", generator.getHitTime());
        response.put("remaining", Math.max(deadline - elapsedTime, 0));
        return response;
    }

    static JSONObject accountMonitor(FundingMonitor monitor, boolean includeMonitoredAccounts) {
        JSONObject json = new JSONObject();
        json.put("holdingType", monitor.getHoldingType().getCode());
        json.put("account", Long.toUnsignedString(monitor.getAccountId()));
        json.put("accountRS", monitor.getAccountName());
        json.put("holding", Long.toUnsignedString(monitor.getHoldingId()));
        json.put("property", monitor.getProperty());
        json.put("amount", String.valueOf(monitor.getAmount()));
        json.put("threshold", String.valueOf(monitor.getThreshold()));
        json.put("interval", monitor.getInterval());
        if (includeMonitoredAccounts) {
            JSONArray jsonAccounts = new JSONArray();
            List<FundingMonitor.MonitoredAccount> accountList = FundingMonitor.getMonitoredAccounts(monitor);
            accountList.forEach(account -> jsonAccounts.add(JSONData.monitoredAccount(account)));
            json.put("monitoredAccounts", jsonAccounts);
        }
        return json;
    }

    static JSONObject monitoredAccount(FundingMonitor.MonitoredAccount account) {
        JSONObject json = new JSONObject();
        json.put("account", Long.toUnsignedString(account.getAccountId()));
        json.put("accountRS", account.getAccountName());
        json.put("amount", String.valueOf(account.getAmount()));
        json.put("threshold", String.valueOf(account.getThreshold()));
        json.put("interval", account.getInterval());
        return json;
    }

    static JSONObject prunableMessage(PrunableMessage prunableMessage, long readerAccountId, String secretPhrase) {
        JSONObject json = new JSONObject();
        json.put("transaction", Long.toUnsignedString(prunableMessage.getId()));
        if (prunableMessage.getMessage() == null || prunableMessage.getEncryptedData() == null) {
            json.put("isText", prunableMessage.getMessage() != null ? prunableMessage.messageIsText() : prunableMessage.encryptedMessageIsText());
        }
        putAccount(json, "sender", prunableMessage.getSenderId());
        if (prunableMessage.getRecipientId() != 0) {
            putAccount(json, "recipient", prunableMessage.getRecipientId());
        }
        json.put("transactionTimestamp", prunableMessage.getTransactionTimestamp());
        json.put("blockTimestamp", prunableMessage.getBlockTimestamp());
        EncryptedData encryptedData = prunableMessage.getEncryptedData();
        if (encryptedData != null) {
            json.put("encryptedMessage", encryptedData(prunableMessage.getEncryptedData()));
            json.put("encryptedMessageIsText", prunableMessage.encryptedMessageIsText());
            if (secretPhrase != null) {
                byte[] publicKey = prunableMessage.getSenderId() == readerAccountId
                        ? Account.getPublicKey(prunableMessage.getRecipientId()) : Account.getPublicKey(prunableMessage.getSenderId());
                if (publicKey != null) {
                    try {
                        byte[] decrypted = Account.decryptFrom(publicKey, encryptedData, secretPhrase, prunableMessage.isCompressed());
                        json.put("decryptedMessage", Convert.toString(decrypted, prunableMessage.encryptedMessageIsText()));
                    } catch (RuntimeException e) {
                        putException(json, e, "Decryption failed");
                    }
                }
            }
            json.put("isCompressed", prunableMessage.isCompressed());
        }
        if (prunableMessage.getMessage() != null) {
            json.put("message", Convert.toString(prunableMessage.getMessage(), prunableMessage.messageIsText()));
            json.put("messageIsText", prunableMessage.messageIsText());
        }
        return json;
    }

    static JSONObject apiRequestHandler(APIServlet.APIRequestHandler handler) {
        JSONObject json = new JSONObject();
        json.put("allowRequiredBlockParameters", handler.allowRequiredBlockParameters());
        if (handler.getFileParameter() != null) {
            json.put("fileParameter", handler.getFileParameter());
        }
        json.put("requireBlockchain", handler.requireBlockchain());
        json.put("requirePost", handler.requirePost());
        json.put("requirePassword", handler.requirePassword());
        return json;
    }

    static void putPrunableAttachment(JSONObject json, Transaction transaction) {
        JSONObject prunableAttachment = transaction.getPrunableAttachmentJSON();
        if (prunableAttachment != null) {
            json.put("prunableAttachmentJSON", prunableAttachment);
        }
    }

    static void putException(JSONObject json, Exception e) {
        putException(json, e, "");
    }

    static void putException(JSONObject json, Exception e, String error) {
        json.put("errorCode", 4);
        if (error.length() > 0) {
            error += ": ";
        }
        json.put("error", e.toString());
        json.put("errorDescription", error + e.getMessage());
    }

    static void putAccount(JSONObject json, String name, long accountId) {
        json.put(name, Long.toUnsignedString(accountId));
        json.put(name + "RS", Convert.rsAccount(accountId));
    }

    static JSONObject at(AT at) {
        JSONObject json = new JSONObject();
        ByteBuffer bf = ByteBuffer.allocate( 8 );
        bf.order( ByteOrder.LITTLE_ENDIAN );

        bf.put( at.getCreator() );
        bf.clear();
        putAccount(json, "creator", bf.getLong() );
        bf.clear();
        bf.put( at.getId() , 0 , 8 );
        long id = bf.getLong(0);
        json.put("at", Convert.toUnsignedLong( id ));
        json.put("atRS", Convert.rsAccount(id));
        json.put("atVersion", at.getVersion());
        json.put("name", at.getName());
        json.put("description", at.getDescription());
        json.put("creator", Convert.toUnsignedLong(AT_API_Helper.getLong(at.getCreator())));
        json.put("creatorRS", Convert.rsAccount(AT_API_Helper.getLong(at.getCreator())));
        json.put("machineCode", Convert.toHexString(at.getApCode()));
        json.put("machineData", Convert.toHexString(at.getApData()));
        json.put("balanceTQT", Convert.toUnsignedLong(Account.getAccount(id).getBalanceTQT()));
        json.put("prevBalanceTQT", Convert.toUnsignedLong(at.getP_balance()));
        json.put("nextBlock", at.nextHeight());
        json.put("frozen", at.freezeOnSameBalance());
        json.put("running", at.getMachineState().isRunning());
        json.put("stopped", at.getMachineState().isStopped());
        json.put("finished", at.getMachineState().isFinished());
        json.put("dead", at.getMachineState().isDead());
        json.put("minActivation", Convert.toUnsignedLong(at.minActivationAmount()));
        json.put("creationBlock", at.getCreationBlockHeight());
        return json;
    }

    static JSONObject hex2long(String longString){
        JSONObject json = new JSONObject();
        json.put("hex2long", longString);
        return json;
    }

    private static void putCurrencyInfo(JSONObject json, long currencyId) {
        Currency currency = Currency.getCurrency(currencyId);
        if (currency == null) {
            return;
        }
        json.put("name", currency.getName());
        json.put("code", currency.getCode());
        json.put("type", currency.getType());
        json.put("decimals", currency.getDecimals());
        json.put("issuanceHeight", currency.getIssuanceHeight());
        putAccount(json, "issuerAccount", currency.getAccountId());

        json.put("initialSupply", String.valueOf(currency.getInitialSupply()));
        json.put("currentSupply", String.valueOf(currency.getCurrentSupply()));
        json.put("reserveSupply", String.valueOf(currency.getReserveSupply()));
        json.put("maxSupply", String.valueOf(currency.getMaxSupply()));
        json.put("creationHeight", currency.getCreationHeight());
        json.put("minReservePerUnitTQT", String.valueOf(currency.getMinReservePerUnitTQT()));
        json.put("currentReservePerUnitTQT", String.valueOf(currency.getCurrentReservePerUnitTQT()));

        JSONArray types = new JSONArray();
        for (CurrencyType type : CurrencyType.values()) {
            if (currency.is(type)) {
                types.add(type.toString());
            }
        }
        json.put("types", types);

    }

    private static void putAssetInfo(JSONObject json, long assetId) {
        Asset asset = Asset.getAsset(assetId);
        json.put("name", asset.getName());
        json.put("decimals", asset.getDecimals());

        json.put("initialQuantityQNT", String.valueOf(asset.getInitialQuantityQNT()));
        json.put("currentQuantityQNT", String.valueOf(asset.getQuantityQNT()));

    }

    private static void putExpectedTransaction(JSONObject json, Transaction transaction) {
        json.put("height", Xin.getBlockchain().getHeight() + 1);
        json.put("phased", transaction.getPhasing() != null);
        if (transaction.getBlockId() != 0) { // those values may be wrong for unconfirmed transactions
            json.put("transactionHeight", transaction.getHeight());
            json.put("confirmations", Xin.getBlockchain().getHeight() - transaction.getHeight());
        }
    }

    static void ledgerEntry(JSONObject json, LedgerEntry entry, boolean includeTransactions, boolean includeHoldingInfo) {
        putAccount(json, "account", entry.getAccountId());
        json.put("ledgerId", Long.toUnsignedString(entry.getLedgerId()));
        json.put("block", Long.toUnsignedString(entry.getBlockId()));
        json.put("height", entry.getHeight());
        json.put("timestamp", entry.getTimestamp());
        json.put("eventType", entry.getEvent().name());
        json.put("event", Long.toUnsignedString(entry.getEventId()));
        json.put("isTransactionEvent", entry.getEvent().isTransaction());
        json.put("change", String.valueOf(entry.getChange()));
        json.put("balance", String.valueOf(entry.getBalance()));
        AccountLedger.LedgerHolding ledgerHolding = entry.getHolding();
        if (ledgerHolding != null) {
            json.put("holdingType", ledgerHolding.name());
            if (entry.getHoldingId() != null) {
                json.put("holding", Long.toUnsignedString(entry.getHoldingId()));
            }
            if (includeHoldingInfo) {
                JSONObject holdingJson = null;
                if (ledgerHolding == AccountLedger.LedgerHolding.ASSET_BALANCE
                        || ledgerHolding == AccountLedger.LedgerHolding.UNCONFIRMED_ASSET_BALANCE) {
                    holdingJson = new JSONObject();
                    putAssetInfo(holdingJson, entry.getHoldingId());
                } else if (ledgerHolding == AccountLedger.LedgerHolding.CURRENCY_BALANCE
                        || ledgerHolding == AccountLedger.LedgerHolding.UNCONFIRMED_CURRENCY_BALANCE) {
                    holdingJson = new JSONObject();
                    putCurrencyInfo(holdingJson, entry.getHoldingId());
                }
                if (holdingJson != null) {
                    json.put("holdingInfo", holdingJson);
                }
            }
        }
        if (includeTransactions && entry.getEvent().isTransaction()) {
            Transaction transaction = Xin.getBlockchain().getTransaction(entry.getEventId());
            json.put("transaction", JSONData.transaction(transaction));
        }
    }

    private JSONData() {
    } // never

}
