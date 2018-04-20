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

import xin.crypto.Crypto;
import xin.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.*;

public interface Attachment extends Appendix {

    TransactionType getTransactionType();

    abstract class AbstractAttachment extends Appendix.AbstractAppendix implements Attachment {

        private AbstractAttachment(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        private AbstractAttachment(JSONObject attachmentData) {
            super(attachmentData);
        }

        private AbstractAttachment(int version) {
            super(version);
        }

        private AbstractAttachment() {
        }

        @Override
        final String getAppendixName() {
            return getTransactionType().getName();
        }

        @Override
        final void validate(Transaction transaction) throws XinException.ValidationException {
            getTransactionType().validateAttachment(transaction);
        }

        @Override
        final void apply(Transaction transaction, Account senderAccount, Account recipientAccount) {
            getTransactionType().apply((TransactionImpl) transaction, senderAccount, recipientAccount);
        }

        @Override
        public final Fee getBaselineFee(Transaction transaction) {
            return getTransactionType().getBaselineFee(transaction);
        }

        @Override
        public final Fee getNextFee(Transaction transaction) {
            return getTransactionType().getNextFee(transaction);
        }

        @Override
        public final int getBaselineFeeHeight() {
            return getTransactionType().getBaselineFeeHeight();
        }

        @Override
        public final int getNextFeeHeight() {
            return getTransactionType().getNextFeeHeight();
        }

        @Override
        final boolean isPhasable() {
            return !(this instanceof Prunable) && getTransactionType().isPhasable();
        }

        final int getFinishValidationHeight(Transaction transaction) {
            return isPhased(transaction) ? transaction.getPhasing().getFinishHeight() - 1 : Xin.getBlockchain().getHeight();
        }

    }

    abstract class EmptyAttachment extends AbstractAttachment {

        private EmptyAttachment() {
            super(0);
        }

        @Override
        final int getMySize() {
            return 0;
        }

        @Override
        final void putMyBytes(ByteBuffer buffer) {
        }

        @Override
        final void putMyJSON(JSONObject json) {
        }

        @Override
        final boolean verifyVersion(byte transactionVersion) {
            return true;
        }

    }

    EmptyAttachment ORDINARY_PAYMENT = new EmptyAttachment() {

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Payment.ORDINARY;
        }

    };

    public static final EmptyAttachment AT_PAYMENT = new EmptyAttachment() {

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AutomatedTransactions.AT_PAYMENT;
        }

    };

    // the message payload is in the Appendix
    EmptyAttachment ARBITRARY_MESSAGE = new EmptyAttachment() {

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ARBITRARY_MESSAGE;
        }

    };

    final class MessagingAliasAssignment extends AbstractAttachment {

        private final String aliasName;
        private final String aliasURI;

        MessagingAliasAssignment(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH).trim();
            aliasURI = Convert.readString(buffer, buffer.getShort(), Constants.MAX_ALIAS_URI_LENGTH).trim();
        }

        MessagingAliasAssignment(JSONObject attachmentData) {
            super(attachmentData);
            aliasName = Convert.nullToEmpty((String) attachmentData.get("alias")).trim();
            aliasURI = Convert.nullToEmpty((String) attachmentData.get("uri")).trim();
        }

        public MessagingAliasAssignment(String aliasName, String aliasURI) {
            this.aliasName = aliasName.trim();
            this.aliasURI = aliasURI.trim();
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(aliasName).length + 2 + Convert.toBytes(aliasURI).length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] alias = Convert.toBytes(this.aliasName);
            byte[] uri = Convert.toBytes(this.aliasURI);
            buffer.put((byte) alias.length);
            buffer.put(alias);
            buffer.putShort((short) uri.length);
            buffer.put(uri);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("alias", aliasName);
            attachment.put("uri", aliasURI);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ALIAS_ASSIGNMENT;
        }

        public String getAliasName() {
            return aliasName;
        }

        public String getAliasURI() {
            return aliasURI;
        }
    }

    final class MessagingAliasSell extends AbstractAttachment {

        private final String aliasName;
        private final long priceTQT;

        MessagingAliasSell(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH);
            this.priceTQT = buffer.getLong();
        }

        MessagingAliasSell(JSONObject attachmentData) {
            super(attachmentData);
            this.aliasName = Convert.nullToEmpty((String) attachmentData.get("alias"));
            this.priceTQT = Convert.parseLong(attachmentData.get("priceTQT"));
        }

        public MessagingAliasSell(String aliasName, long priceTQT) {
            this.aliasName = aliasName;
            this.priceTQT = priceTQT;
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ALIAS_SELL;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(aliasName).length + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] aliasBytes = Convert.toBytes(aliasName);
            buffer.put((byte) aliasBytes.length);
            buffer.put(aliasBytes);
            buffer.putLong(priceTQT);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("alias", aliasName);
            attachment.put("priceTQT", priceTQT);
        }

        public String getAliasName() {
            return aliasName;
        }

        public long getPriceTQT() {
            return priceTQT;
        }
    }

    final class MessagingAliasBuy extends AbstractAttachment {

        private final String aliasName;

        MessagingAliasBuy(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH);
        }

        MessagingAliasBuy(JSONObject attachmentData) {
            super(attachmentData);
            this.aliasName = Convert.nullToEmpty((String) attachmentData.get("alias"));
        }

        public MessagingAliasBuy(String aliasName) {
            this.aliasName = aliasName;
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ALIAS_BUY;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(aliasName).length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] aliasBytes = Convert.toBytes(aliasName);
            buffer.put((byte) aliasBytes.length);
            buffer.put(aliasBytes);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("alias", aliasName);
        }

        public String getAliasName() {
            return aliasName;
        }
    }

    final class MessagingAliasDelete extends AbstractAttachment {

        private final String aliasName;

        MessagingAliasDelete(final ByteBuffer buffer, final byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH);
        }

        MessagingAliasDelete(final JSONObject attachmentData) {
            super(attachmentData);
            this.aliasName = Convert.nullToEmpty((String) attachmentData.get("alias"));
        }

        public MessagingAliasDelete(final String aliasName) {
            this.aliasName = aliasName;
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ALIAS_DELETE;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(aliasName).length;
        }

        @Override
        void putMyBytes(final ByteBuffer buffer) {
            byte[] aliasBytes = Convert.toBytes(aliasName);
            buffer.put((byte) aliasBytes.length);
            buffer.put(aliasBytes);
        }

        @Override
        void putMyJSON(final JSONObject attachment) {
            attachment.put("alias", aliasName);
        }

        public String getAliasName() {
            return aliasName;
        }
    }

    final class MessagingPollCreation extends AbstractAttachment {

        public final static class PollBuilder {
            private final String pollName;
            private final String pollDescription;
            private final String[] pollOptions;

            private final int finishHeight;
            private final byte votingModel;

            private long minBalance = 0;
            private byte minBalanceModel;

            private final byte minNumberOfOptions;
            private final byte maxNumberOfOptions;

            private final byte minRangeValue;
            private final byte maxRangeValue;

            private long holdingId;

            public PollBuilder(final String pollName, final String pollDescription, final String[] pollOptions,
                               final int finishHeight, final byte votingModel,
                               byte minNumberOfOptions, byte maxNumberOfOptions,
                               byte minRangeValue, byte maxRangeValue) {
                this.pollName = pollName;
                this.pollDescription = pollDescription;
                this.pollOptions = pollOptions;

                this.finishHeight = finishHeight;
                this.votingModel = votingModel;
                this.minNumberOfOptions = minNumberOfOptions;
                this.maxNumberOfOptions = maxNumberOfOptions;
                this.minRangeValue = minRangeValue;
                this.maxRangeValue = maxRangeValue;

                this.minBalanceModel = VoteWeighting.VotingModel.get(votingModel).getMinBalanceModel().getCode();
            }

            public PollBuilder minBalance(byte minBalanceModel, long minBalance) {
                this.minBalanceModel = minBalanceModel;
                this.minBalance = minBalance;
                return this;
            }

            public PollBuilder holdingId(long holdingId) {
                this.holdingId = holdingId;
                return this;
            }

            public MessagingPollCreation build() {
                return new MessagingPollCreation(this);
            }
        }

        private final String pollName;
        private final String pollDescription;
        private final String[] pollOptions;

        private final int finishHeight;

        private final byte minNumberOfOptions;
        private final byte maxNumberOfOptions;
        private final byte minRangeValue;
        private final byte maxRangeValue;
        private final VoteWeighting voteWeighting;

        MessagingPollCreation(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.pollName = Convert.readString(buffer, buffer.getShort(), Constants.MAX_POLL_NAME_LENGTH);
            this.pollDescription = Convert.readString(buffer, buffer.getShort(), Constants.MAX_POLL_DESCRIPTION_LENGTH);

            this.finishHeight = buffer.getInt();

            int numberOfOptions = buffer.get();
            if (numberOfOptions > Constants.MAX_POLL_OPTION_COUNT) {
                throw new XinException.NotValidException("Invalid number of poll options: " + numberOfOptions);
            }

            this.pollOptions = new String[numberOfOptions];
            for (int i = 0; i < numberOfOptions; i++) {
                this.pollOptions[i] = Convert.readString(buffer, buffer.getShort(), Constants.MAX_POLL_OPTION_LENGTH);
            }

            byte votingModel = buffer.get();

            this.minNumberOfOptions = buffer.get();
            this.maxNumberOfOptions = buffer.get();

            this.minRangeValue = buffer.get();
            this.maxRangeValue = buffer.get();

            long minBalance = buffer.getLong();
            byte minBalanceModel = buffer.get();
            long holdingId = buffer.getLong();
            this.voteWeighting = new VoteWeighting(votingModel, holdingId, minBalance, minBalanceModel);
        }

        MessagingPollCreation(JSONObject attachmentData) {
            super(attachmentData);

            this.pollName = ((String) attachmentData.get("name")).trim();
            this.pollDescription = ((String) attachmentData.get("description")).trim();
            this.finishHeight = ((Long) attachmentData.get("finishHeight")).intValue();

            JSONArray options = (JSONArray) attachmentData.get("options");
            this.pollOptions = new String[options.size()];
            for (int i = 0; i < pollOptions.length; i++) {
                this.pollOptions[i] = ((String) options.get(i)).trim();
            }
            byte votingModel = ((Long) attachmentData.get("votingModel")).byteValue();

            this.minNumberOfOptions = ((Long) attachmentData.get("minNumberOfOptions")).byteValue();
            this.maxNumberOfOptions = ((Long) attachmentData.get("maxNumberOfOptions")).byteValue();
            this.minRangeValue = ((Long) attachmentData.get("minRangeValue")).byteValue();
            this.maxRangeValue = ((Long) attachmentData.get("maxRangeValue")).byteValue();

            long minBalance = Convert.parseLong(attachmentData.get("minBalance"));
            byte minBalanceModel = ((Long) attachmentData.get("minBalanceModel")).byteValue();
            long holdingId = Convert.parseUnsignedLong((String) attachmentData.get("holding"));
            this.voteWeighting = new VoteWeighting(votingModel, holdingId, minBalance, minBalanceModel);
        }

        private MessagingPollCreation(PollBuilder builder) {
            this.pollName = builder.pollName;
            this.pollDescription = builder.pollDescription;
            this.pollOptions = builder.pollOptions;
            this.finishHeight = builder.finishHeight;
            this.minNumberOfOptions = builder.minNumberOfOptions;
            this.maxNumberOfOptions = builder.maxNumberOfOptions;
            this.minRangeValue = builder.minRangeValue;
            this.maxRangeValue = builder.maxRangeValue;
            this.voteWeighting = new VoteWeighting(builder.votingModel, builder.holdingId, builder.minBalance, builder.minBalanceModel);
        }

        @Override
        int getMySize() {
            int size = 2 + Convert.toBytes(pollName).length + 2 + Convert.toBytes(pollDescription).length + 1;
            for (String pollOption : pollOptions) {
                size += 2 + Convert.toBytes(pollOption).length;
            }

            size += 4 + 1 + 1 + 1 + 1 + 1 + 8 + 1 + 8;

            return size;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] name = Convert.toBytes(this.pollName);
            byte[] description = Convert.toBytes(this.pollDescription);
            byte[][] options = new byte[this.pollOptions.length][];
            for (int i = 0; i < this.pollOptions.length; i++) {
                options[i] = Convert.toBytes(this.pollOptions[i]);
            }

            buffer.putShort((short) name.length);
            buffer.put(name);
            buffer.putShort((short) description.length);
            buffer.put(description);
            buffer.putInt(finishHeight);
            buffer.put((byte) options.length);
            for (byte[] option : options) {
                buffer.putShort((short) option.length);
                buffer.put(option);
            }
            buffer.put(this.voteWeighting.getVotingModel().getCode());

            buffer.put(this.minNumberOfOptions);
            buffer.put(this.maxNumberOfOptions);
            buffer.put(this.minRangeValue);
            buffer.put(this.maxRangeValue);

            buffer.putLong(this.voteWeighting.getMinBalance());
            buffer.put(this.voteWeighting.getMinBalanceModel().getCode());
            buffer.putLong(this.voteWeighting.getHoldingId());
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("name", this.pollName);
            attachment.put("description", this.pollDescription);
            attachment.put("finishHeight", this.finishHeight);
            JSONArray options = new JSONArray();
            if (this.pollOptions != null) {
                Collections.addAll(options, this.pollOptions);
            }
            attachment.put("options", options);


            attachment.put("minNumberOfOptions", this.minNumberOfOptions);
            attachment.put("maxNumberOfOptions", this.maxNumberOfOptions);

            attachment.put("minRangeValue", this.minRangeValue);
            attachment.put("maxRangeValue", this.maxRangeValue);

            attachment.put("votingModel", this.voteWeighting.getVotingModel().getCode());

            attachment.put("minBalance", this.voteWeighting.getMinBalance());
            attachment.put("minBalanceModel", this.voteWeighting.getMinBalanceModel().getCode());
            attachment.put("holding", Long.toUnsignedString(this.voteWeighting.getHoldingId()));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.POLL_CREATION;
        }

        public String getPollName() {
            return pollName;
        }

        public String getPollDescription() {
            return pollDescription;
        }

        public int getFinishHeight() {
            return finishHeight;
        }

        public String[] getPollOptions() {
            return pollOptions;
        }

        public byte getMinNumberOfOptions() {
            return minNumberOfOptions;
        }

        public byte getMaxNumberOfOptions() {
            return maxNumberOfOptions;
        }

        public byte getMinRangeValue() {
            return minRangeValue;
        }

        public byte getMaxRangeValue() {
            return maxRangeValue;
        }

        public VoteWeighting getVoteWeighting() {
            return voteWeighting;
        }

    }

    final class MessagingVoteCasting extends AbstractAttachment {

        private final long pollId;
        private final byte[] pollVote;

        public MessagingVoteCasting(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            pollId = buffer.getLong();
            int numberOfOptions = buffer.get();
            if (numberOfOptions > Constants.MAX_POLL_OPTION_COUNT) {
                throw new XinException.NotValidException("More than " + Constants.MAX_POLL_OPTION_COUNT + " options in a vote");
            }
            pollVote = new byte[numberOfOptions];
            buffer.get(pollVote);
        }

        public MessagingVoteCasting(JSONObject attachmentData) {
            super(attachmentData);
            pollId = Convert.parseUnsignedLong((String) attachmentData.get("poll"));
            JSONArray vote = (JSONArray) attachmentData.get("vote");
            pollVote = new byte[vote.size()];
            for (int i = 0; i < pollVote.length; i++) {
                pollVote[i] = ((Long) vote.get(i)).byteValue();
            }
        }

        public MessagingVoteCasting(long pollId, byte[] pollVote) {
            this.pollId = pollId;
            this.pollVote = pollVote;
        }

        @Override
        int getMySize() {
            return 8 + 1 + this.pollVote.length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(this.pollId);
            buffer.put((byte) this.pollVote.length);
            buffer.put(this.pollVote);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("poll", Long.toUnsignedString(this.pollId));
            JSONArray vote = new JSONArray();
            if (this.pollVote != null) {
                for (byte aPollVote : this.pollVote) {
                    vote.add(aPollVote);
                }
            }
            attachment.put("vote", vote);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.VOTE_CASTING;
        }

        public long getPollId() {
            return pollId;
        }

        public byte[] getPollVote() {
            return pollVote;
        }
    }

    final class MessagingPhasingVoteCasting extends AbstractAttachment {

        private final List<byte[]> transactionFullHashes;
        private final byte[] revealedSecret;

        MessagingPhasingVoteCasting(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            byte length = buffer.get();
            transactionFullHashes = new ArrayList<>(length);
            for (int i = 0; i < length; i++) {
                byte[] hash = new byte[32];
                buffer.get(hash);
                transactionFullHashes.add(hash);
            }
            int secretLength = buffer.getInt();
            if (secretLength > Constants.MAX_PHASING_REVEALED_SECRET_LENGTH) {
                throw new XinException.NotValidException("Invalid revealed secret length " + secretLength);
            }
            if (secretLength > 0) {
                revealedSecret = new byte[secretLength];
                buffer.get(revealedSecret);
            } else {
                revealedSecret = Convert.EMPTY_BYTE;
            }
        }

        MessagingPhasingVoteCasting(JSONObject attachmentData) {
            super(attachmentData);
            JSONArray hashes = (JSONArray) attachmentData.get("transactionFullHashes");
            transactionFullHashes = new ArrayList<>(hashes.size());
            hashes.forEach(hash -> transactionFullHashes.add(Convert.parseHexString((String) hash)));
            String revealedSecret = Convert.emptyToNull((String) attachmentData.get("revealedSecret"));
            this.revealedSecret = revealedSecret != null ? Convert.parseHexString(revealedSecret) : Convert.EMPTY_BYTE;
        }

        public MessagingPhasingVoteCasting(List<byte[]> transactionFullHashes, byte[] revealedSecret) {
            this.transactionFullHashes = transactionFullHashes;
            this.revealedSecret = revealedSecret;
        }

        @Override
        int getMySize() {
            return 1 + 32 * transactionFullHashes.size() + 4 + revealedSecret.length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.put((byte) transactionFullHashes.size());
            transactionFullHashes.forEach(buffer::put);
            buffer.putInt(revealedSecret.length);
            buffer.put(revealedSecret);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            JSONArray jsonArray = new JSONArray();
            transactionFullHashes.forEach(hash -> jsonArray.add(Convert.toHexString(hash)));
            attachment.put("transactionFullHashes", jsonArray);
            if (revealedSecret.length > 0) {
                attachment.put("revealedSecret", Convert.toHexString(revealedSecret));
            }
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.PHASING_VOTE_CASTING;
        }

        public List<byte[]> getTransactionFullHashes() {
            return transactionFullHashes;
        }

        public byte[] getRevealedSecret() {
            return revealedSecret;
        }
    }

    final class MessagingHubAnnouncement extends AbstractAttachment {

        private final long minFeePerByteTQT;
        private final String[] uris;

        MessagingHubAnnouncement(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.minFeePerByteTQT = buffer.getLong();
            int numberOfUris = buffer.get();
            if (numberOfUris > Constants.MAX_HUB_ANNOUNCEMENT_URIS) {
                throw new XinException.NotValidException("Invalid number of URIs: " + numberOfUris);
            }
            this.uris = new String[numberOfUris];
            for (int i = 0; i < uris.length; i++) {
                uris[i] = Convert.readString(buffer, buffer.getShort(), Constants.MAX_HUB_ANNOUNCEMENT_URI_LENGTH);
            }
        }

        MessagingHubAnnouncement(JSONObject attachmentData) throws XinException.NotValidException {
            super(attachmentData);
            this.minFeePerByteTQT = (Long) attachmentData.get("minFeePerByte");
            try {
                JSONArray urisData = (JSONArray) attachmentData.get("uris");
                this.uris = new String[urisData.size()];
                for (int i = 0; i < uris.length; i++) {
                    uris[i] = (String) urisData.get(i);
                }
            } catch (RuntimeException e) {
                throw new XinException.NotValidException("Error parsing hub terminal announcement parameters", e);
            }
        }

        public MessagingHubAnnouncement(long minFeePerByteTQT, String[] uris) {
            this.minFeePerByteTQT = minFeePerByteTQT;
            this.uris = uris;
        }

        @Override
        int getMySize() {
            int size = 8 + 1;
            for (String uri : uris) {
                size += 2 + Convert.toBytes(uri).length;
            }
            return size;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(minFeePerByteTQT);
            buffer.put((byte) uris.length);
            for (String uri : uris) {
                byte[] uriBytes = Convert.toBytes(uri);
                buffer.putShort((short) uriBytes.length);
                buffer.put(uriBytes);
            }
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("minFeePerByteTQT", minFeePerByteTQT);
            JSONArray uris = new JSONArray();
            Collections.addAll(uris, this.uris);
            attachment.put("uris", uris);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.HUB_ANNOUNCEMENT;
        }

        public long getMinFeePerByteTQT() {
            return minFeePerByteTQT;
        }

        public String[] getUris() {
            return uris;
        }

    }

    final class MessagingAccountInfo extends AbstractAttachment {

        private final String name;
        private final String description;

        MessagingAccountInfo(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.name = Convert.readString(buffer, buffer.get(), Constants.MAX_ACCOUNT_NAME_LENGTH);
            this.description = Convert.readString(buffer, buffer.getShort(), Constants.MAX_ACCOUNT_DESCRIPTION_LENGTH);
        }

        MessagingAccountInfo(JSONObject attachmentData) {
            super(attachmentData);
            this.name = Convert.nullToEmpty((String) attachmentData.get("name"));
            this.description = Convert.nullToEmpty((String) attachmentData.get("description"));
        }

        public MessagingAccountInfo(String name, String description) {
            this.name = name;
            this.description = description;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(name).length + 2 + Convert.toBytes(description).length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] name = Convert.toBytes(this.name);
            byte[] description = Convert.toBytes(this.description);
            buffer.put((byte) name.length);
            buffer.put(name);
            buffer.putShort((short) description.length);
            buffer.put(description);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("name", name);
            attachment.put("description", description);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ACCOUNT_INFO;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

    }

    final class MessagingAccountProperty extends AbstractAttachment {

        private final String property;
        private final String value;

        MessagingAccountProperty(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.property = Convert.readString(buffer, buffer.get(), Constants.MAX_ACCOUNT_PROPERTY_NAME_LENGTH).trim();
            this.value = Convert.readString(buffer, buffer.get(), Constants.MAX_ACCOUNT_PROPERTY_VALUE_LENGTH).trim();
        }

        MessagingAccountProperty(JSONObject attachmentData) {
            super(attachmentData);
            this.property = Convert.nullToEmpty((String) attachmentData.get("property")).trim();
            this.value = Convert.nullToEmpty((String) attachmentData.get("value")).trim();
        }

        public MessagingAccountProperty(String property, String value) {
            this.property = property.trim();
            this.value = Convert.nullToEmpty(value).trim();
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(property).length + 1 + Convert.toBytes(value).length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] property = Convert.toBytes(this.property);
            byte[] value = Convert.toBytes(this.value);
            buffer.put((byte) property.length);
            buffer.put(property);
            buffer.put((byte) value.length);
            buffer.put(value);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("property", property);
            attachment.put("value", value);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ACCOUNT_PROPERTY;
        }

        public String getProperty() {
            return property;
        }

        public String getValue() {
            return value;
        }

    }

    final class MessagingAccountPropertyDelete extends AbstractAttachment {

        private final long propertyId;

        MessagingAccountPropertyDelete(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.propertyId = buffer.getLong();
        }

        MessagingAccountPropertyDelete(JSONObject attachmentData) {
            super(attachmentData);
            this.propertyId = Convert.parseUnsignedLong((String) attachmentData.get("property"));
        }

        public MessagingAccountPropertyDelete(long propertyId) {
            this.propertyId = propertyId;
        }

        @Override
        int getMySize() {
            return 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(propertyId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("property", Long.toUnsignedString(propertyId));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ACCOUNT_PROPERTY_DELETE;
        }

        public long getPropertyId() {
            return propertyId;
        }

    }

    final class ColoredCoinsAssetIssuance extends AbstractAttachment {

        private final String name;
        private final String description;
        private final long quantityQNT;
        private final byte decimals;

        ColoredCoinsAssetIssuance(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.name = Convert.readString(buffer, buffer.get(), Constants.MAX_ASSET_NAME_LENGTH);
            this.description = Convert.readString(buffer, buffer.getShort(), Constants.MAX_ASSET_DESCRIPTION_LENGTH);
            this.quantityQNT = buffer.getLong();
            this.decimals = buffer.get();
        }

        ColoredCoinsAssetIssuance(JSONObject attachmentData) {
            super(attachmentData);
            this.name = (String) attachmentData.get("name");
            this.description = Convert.nullToEmpty((String) attachmentData.get("description"));
            this.quantityQNT = Convert.parseLong(attachmentData.get("quantityQNT"));
            this.decimals = ((Long) attachmentData.get("decimals")).byteValue();
        }

        public ColoredCoinsAssetIssuance(String name, String description, long quantityQNT, byte decimals) {
            this.name = name;
            this.description = Convert.nullToEmpty(description);
            this.quantityQNT = quantityQNT;
            this.decimals = decimals;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(name).length + 2 + Convert.toBytes(description).length + 8 + 1;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] name = Convert.toBytes(this.name);
            byte[] description = Convert.toBytes(this.description);
            buffer.put((byte) name.length);
            buffer.put(name);
            buffer.putShort((short) description.length);
            buffer.put(description);
            buffer.putLong(quantityQNT);
            buffer.put(decimals);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("name", name);
            attachment.put("description", description);
            attachment.put("quantityQNT", quantityQNT);
            attachment.put("decimals", decimals);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASSET_ISSUANCE;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public long getQuantityQNT() {
            return quantityQNT;
        }

        public byte getDecimals() {
            return decimals;
        }
    }

    final class ColoredCoinsAssetTransfer extends AbstractAttachment {

        private final long assetId;
        private final long quantityQNT;
        private final String comment;

        ColoredCoinsAssetTransfer(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.assetId = buffer.getLong();
            this.quantityQNT = buffer.getLong();
            this.comment = getVersion() == 0 ? Convert.readString(buffer, buffer.getShort(), Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH) : null;
        }

        ColoredCoinsAssetTransfer(JSONObject attachmentData) {
            super(attachmentData);
            this.assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
            this.quantityQNT = Convert.parseLong(attachmentData.get("quantityQNT"));
            this.comment = getVersion() == 0 ? Convert.nullToEmpty((String) attachmentData.get("comment")) : null;
        }

        public ColoredCoinsAssetTransfer(long assetId, long quantityQNT) {
            this.assetId = assetId;
            this.quantityQNT = quantityQNT;
            this.comment = null;
        }

        @Override
        int getMySize() {
            return 8 + 8 + (getVersion() == 0 ? (2 + Convert.toBytes(comment).length) : 0);
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(assetId);
            buffer.putLong(quantityQNT);
            if (getVersion() == 0 && comment != null) {
                byte[] commentBytes = Convert.toBytes(this.comment);
                buffer.putShort((short) commentBytes.length);
                buffer.put(commentBytes);
            }
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("asset", Long.toUnsignedString(assetId));
            attachment.put("quantityQNT", quantityQNT);
            if (getVersion() == 0) {
                attachment.put("comment", comment);
            }
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASSET_TRANSFER;
        }

        public long getAssetId() {
            return assetId;
        }

        public long getQuantityQNT() {
            return quantityQNT;
        }

        public String getComment() {
            return comment;
        }

    }

    final class ColoredCoinsAssetDelete extends AbstractAttachment {

        private final long assetId;
        private final long quantityQNT;

        ColoredCoinsAssetDelete(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.assetId = buffer.getLong();
            this.quantityQNT = buffer.getLong();
        }

        ColoredCoinsAssetDelete(JSONObject attachmentData) {
            super(attachmentData);
            this.assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
            this.quantityQNT = Convert.parseLong(attachmentData.get("quantityQNT"));
        }

        public ColoredCoinsAssetDelete(long assetId, long quantityQNT) {
            this.assetId = assetId;
            this.quantityQNT = quantityQNT;
        }

        @Override
        int getMySize() {
            return 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(assetId);
            buffer.putLong(quantityQNT);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("asset", Long.toUnsignedString(assetId));
            attachment.put("quantityQNT", quantityQNT);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASSET_DELETE;
        }

        public long getAssetId() {
            return assetId;
        }

        public long getQuantityQNT() {
            return quantityQNT;
        }

    }

    final class ColoredCoinsAssetCompleteDelete extends AbstractAttachment {

        private final long assetId;

        ColoredCoinsAssetCompleteDelete(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.assetId = buffer.getLong();
        }

        ColoredCoinsAssetCompleteDelete(JSONObject attachmentData) {
            super(attachmentData);
            this.assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
        }

        public ColoredCoinsAssetCompleteDelete(long assetId) {
            this.assetId = assetId;
        }

        @Override
        int getMySize() {
            return 8 ;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(assetId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("asset", Long.toUnsignedString(assetId));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASSET_COMPLETE_DELETE;
        }

        public long getAssetId() {
            return assetId;
        }

    }

    abstract class ColoredCoinsOrderPlacement extends AbstractAttachment {

        private final long assetId;
        private final long quantityQNT;
        private final long priceTQT;

        private ColoredCoinsOrderPlacement(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.assetId = buffer.getLong();
            this.quantityQNT = buffer.getLong();
            this.priceTQT = buffer.getLong();
        }

        private ColoredCoinsOrderPlacement(JSONObject attachmentData) {
            super(attachmentData);
            this.assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
            this.quantityQNT = Convert.parseLong(attachmentData.get("quantityQNT"));
            this.priceTQT = Convert.parseLong(attachmentData.get("priceTQT"));
        }

        private ColoredCoinsOrderPlacement(long assetId, long quantityQNT, long priceTQT) {
            this.assetId = assetId;
            this.quantityQNT = quantityQNT;
            this.priceTQT = priceTQT;
        }

        @Override
        int getMySize() {
            return 8 + 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(assetId);
            buffer.putLong(quantityQNT);
            buffer.putLong(priceTQT);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("asset", Long.toUnsignedString(assetId));
            attachment.put("quantityQNT", quantityQNT);
            attachment.put("priceTQT", priceTQT);
        }

        public long getAssetId() {
            return assetId;
        }

        public long getQuantityQNT() {
            return quantityQNT;
        }

        public long getPriceTQT() {
            return priceTQT;
        }
    }

    final class ColoredCoinsAskOrderPlacement extends ColoredCoinsOrderPlacement {

        ColoredCoinsAskOrderPlacement(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        ColoredCoinsAskOrderPlacement(JSONObject attachmentData) {
            super(attachmentData);
        }

        public ColoredCoinsAskOrderPlacement(long assetId, long quantityQNT, long priceTQT) {
            super(assetId, quantityQNT, priceTQT);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASK_ORDER_PLACEMENT;
        }

    }

    final class ColoredCoinsBidOrderPlacement extends ColoredCoinsOrderPlacement {

        ColoredCoinsBidOrderPlacement(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        ColoredCoinsBidOrderPlacement(JSONObject attachmentData) {
            super(attachmentData);
        }

        public ColoredCoinsBidOrderPlacement(long assetId, long quantityQNT, long priceTQT) {
            super(assetId, quantityQNT, priceTQT);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.BID_ORDER_PLACEMENT;
        }

    }

    abstract class ColoredCoinsOrderCancellation extends AbstractAttachment {

        private final long orderId;

        private ColoredCoinsOrderCancellation(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.orderId = buffer.getLong();
        }

        private ColoredCoinsOrderCancellation(JSONObject attachmentData) {
            super(attachmentData);
            this.orderId = Convert.parseUnsignedLong((String) attachmentData.get("order"));
        }

        private ColoredCoinsOrderCancellation(long orderId) {
            this.orderId = orderId;
        }

        @Override
        int getMySize() {
            return 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(orderId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("order", Long.toUnsignedString(orderId));
        }

        public long getOrderId() {
            return orderId;
        }
    }

    final class ColoredCoinsAskOrderCancellation extends ColoredCoinsOrderCancellation {

        ColoredCoinsAskOrderCancellation(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        ColoredCoinsAskOrderCancellation(JSONObject attachmentData) {
            super(attachmentData);
        }

        public ColoredCoinsAskOrderCancellation(long orderId) {
            super(orderId);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASK_ORDER_CANCELLATION;
        }

    }

    final class ColoredCoinsBidOrderCancellation extends ColoredCoinsOrderCancellation {

        ColoredCoinsBidOrderCancellation(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        ColoredCoinsBidOrderCancellation(JSONObject attachmentData) {
            super(attachmentData);
        }

        public ColoredCoinsBidOrderCancellation(long orderId) {
            super(orderId);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.BID_ORDER_CANCELLATION;
        }

    }

    final class ColoredCoinsDividendPayment extends AbstractAttachment {

        private final long assetId;
        private final int height;
        private final long amountTQTPerQNT;

        ColoredCoinsDividendPayment(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.assetId = buffer.getLong();
            this.height = buffer.getInt();
            this.amountTQTPerQNT = buffer.getLong();
        }

        ColoredCoinsDividendPayment(JSONObject attachmentData) {
            super(attachmentData);
            this.assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
            this.height = ((Long) attachmentData.get("height")).intValue();
            this.amountTQTPerQNT = Convert.parseLong(attachmentData.get("amountTQTPerQNT"));
        }

        public ColoredCoinsDividendPayment(long assetId, int height, long amountTQTPerQNT) {
            this.assetId = assetId;
            this.height = height;
            this.amountTQTPerQNT = amountTQTPerQNT;
        }

        @Override
        int getMySize() {
            return 8 + 4 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(assetId);
            buffer.putInt(height);
            buffer.putLong(amountTQTPerQNT);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("asset", Long.toUnsignedString(assetId));
            attachment.put("height", height);
            attachment.put("amountTQTPerQNT", amountTQTPerQNT);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.DIVIDEND_PAYMENT;
        }

        public long getAssetId() {
            return assetId;
        }

        public int getHeight() {
            return height;
        }

        public long getAmountTQTPerQNT() {
            return amountTQTPerQNT;
        }

    }

    public final static class AdvancedPaymentEscrowCreation extends AbstractAttachment {

        private final Long amountTQT;
        private final byte requiredSigners;
        private final SortedSet<Long> signers = new TreeSet<>();
        private final int deadline;
        private final Escrow.DecisionType deadlineAction;

        AdvancedPaymentEscrowCreation(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.amountTQT = buffer.getLong();
            this.deadline = buffer.getInt();
            this.deadlineAction = Escrow.byteToDecision(buffer.get());
            this.requiredSigners = buffer.get();
            byte totalSigners = buffer.get();
            if(totalSigners > 10 || totalSigners <= 0) {
                throw new XinException.NotValidException("Invalid number of signers listed on create escrow transaction");
            }
            for(int i = 0; i < totalSigners; i++) {
                if(!this.signers.add(buffer.getLong())) {
                    throw new XinException.NotValidException("Duplicate signer on escrow creation");
                }
            }
        }

        AdvancedPaymentEscrowCreation(JSONObject attachmentData) throws XinException.NotValidException {
            super(attachmentData);
            this.amountTQT = Convert.parseUnsignedLong((String)attachmentData.get("amountTQT"));
            this.deadline = ((Long)attachmentData.get("deadline")).intValue();
            this.deadlineAction = Escrow.stringToDecision((String)attachmentData.get("deadlineAction"));
            this.requiredSigners = ((Long)attachmentData.get("requiredSigners")).byteValue();
            int totalSigners = ((JSONArray)attachmentData.get("signers")).size();
            if(totalSigners > 10 || totalSigners <= 0) {
                throw new XinException.NotValidException("Invalid number of signers listed on create escrow transaction");
            }
            //this.signers.addAll((JSONArray)attachmentData.get("signers"));
            JSONArray signersJson = (JSONArray)attachmentData.get("signers");
            for(int i = 0; i < signersJson.size(); i++) {
                this.signers.add(Convert.parseUnsignedLong((String)signersJson.get(i)));
            }
            if(this.signers.size() != ((JSONArray)attachmentData.get("signers")).size()) {
                throw new XinException.NotValidException("Duplicate signer on escrow creation");
            }
        }

        public AdvancedPaymentEscrowCreation(Long amountTQT, int deadline, Escrow.DecisionType deadlineAction,
                                             int requiredSigners, Collection<Long> signers) throws XinException.NotValidException {
            this.amountTQT = amountTQT;
            this.deadline = deadline;
            this.deadlineAction = deadlineAction;
            this.requiredSigners = (byte)requiredSigners;
            if(signers.size() > 10 || signers.size() == 0) {
                throw new XinException.NotValidException("Invalid number of signers listed on create escrow transaction");
            }
            this.signers.addAll(signers);
            if(this.signers.size() != signers.size()) {
                throw new XinException.NotValidException("Duplicate signer on escrow creation");
            }
        }

        @Override
        int getMySize() {
            int size = 8 + 4 + 1 + 1 + 1;
            size += (signers.size() * 8);
            return size;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(this.amountTQT);
            buffer.putInt(this.deadline);
            buffer.put(Escrow.decisionToByte(this.deadlineAction));
            buffer.put(this.requiredSigners);
            byte totalSigners = (byte) this.signers.size();
            buffer.put(totalSigners);
            for(Long id : this.signers) {
                buffer.putLong(id);
            }
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("amountTQT", Convert.toUnsignedLong(this.amountTQT));
            attachment.put("deadline", this.deadline);
            attachment.put("deadlineAction", Escrow.decisionToString(this.deadlineAction));
            attachment.put("requiredSigners", (int)this.requiredSigners);
            JSONArray ids = new JSONArray();
        
            for(Long signer : this.signers) {
                ids.add(Convert.toUnsignedLong(signer));
            }
            attachment.put("signers", ids);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.ESCROW_CREATION;
        }

        public Long getAmountTQT() { return amountTQT; }

        public int getDeadline() { return deadline; }

        public Escrow.DecisionType getDeadlineAction() { return deadlineAction; }

        public int getRequiredSigners() { return (int)requiredSigners; }

        public Collection<Long> getSigners() { return Collections.unmodifiableCollection(signers); }

        public int getTotalSigners() { return signers.size(); }
    }

    public final static class AdvancedPaymentEscrowSign extends AbstractAttachment {

        private final Long escrowId;
        private final Escrow.DecisionType decision;

        AdvancedPaymentEscrowSign(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.escrowId = buffer.getLong();
            this.decision = Escrow.byteToDecision(buffer.get());
        }

        AdvancedPaymentEscrowSign(JSONObject attachmentData) {
            super(attachmentData);
            this.escrowId = Convert.parseUnsignedLong((String)attachmentData.get("escrowId"));
            this.decision = Escrow.stringToDecision((String)attachmentData.get("decision"));
        }

        public AdvancedPaymentEscrowSign(Long escrowId, Escrow.DecisionType decision) {
            this.escrowId = escrowId;
            this.decision = decision;
        }

        @Override
        int getMySize() {
            return 8 + 1;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(this.escrowId);
            buffer.put(Escrow.decisionToByte(this.decision));
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("escrowId", Convert.toUnsignedLong(this.escrowId));
            attachment.put("decision", Escrow.decisionToString(this.decision));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.ESCROW_SIGN;
        }

        public Long getEscrowId() { return this.escrowId; }

        public Escrow.DecisionType getDecision() { return this.decision; }
    }

    public final static class AdvancedPaymentEscrowResult extends AbstractAttachment {

        private final Long escrowId;
        private final Escrow.DecisionType decision;

        AdvancedPaymentEscrowResult(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.escrowId = buffer.getLong();
            this.decision = Escrow.byteToDecision(buffer.get());
        }

        AdvancedPaymentEscrowResult(JSONObject attachmentData) {
            super(attachmentData);
            this.escrowId = Convert.parseUnsignedLong((String) attachmentData.get("escrowId"));
            this.decision = Escrow.stringToDecision((String)attachmentData.get("decision"));
        }

        public AdvancedPaymentEscrowResult(Long escrowId, Escrow.DecisionType decision) {
            this.escrowId = escrowId;
            this.decision = decision;
        }

        @Override
        int getMySize() {
            return 8 + 1;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(this.escrowId);
            buffer.put(Escrow.decisionToByte(this.decision));
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("escrowId", Convert.toUnsignedLong(this.escrowId));
            attachment.put("decision", Escrow.decisionToString(this.decision));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.ESCROW_RESULT;
        }
    }

    public final static class AdvancedPaymentSubscriptionSubscribe extends AbstractAttachment {

        private final Integer frequency;

        AdvancedPaymentSubscriptionSubscribe(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.frequency = buffer.getInt();
        }

        AdvancedPaymentSubscriptionSubscribe(JSONObject attachmentData) {
            super(attachmentData);
            this.frequency = ((Long)attachmentData.get("frequency")).intValue();
        }

        public AdvancedPaymentSubscriptionSubscribe(int frequency) {
            this.frequency = frequency;
        }

        @Override
        int getMySize() {
            return 4;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putInt(this.frequency);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("frequency", this.frequency);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.SUBSCRIPTION_SUBSCRIBE;
        }

        public Integer getFrequency() { return this.frequency; }
    }

    public final static class AdvancedPaymentSubscriptionCancel extends AbstractAttachment {

        private final Long subscriptionId;

        AdvancedPaymentSubscriptionCancel(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.subscriptionId = buffer.getLong();
        }

        AdvancedPaymentSubscriptionCancel(JSONObject attachmentData) {
            super(attachmentData);
            this.subscriptionId = Convert.parseUnsignedLong((String)attachmentData.get("subscriptionId"));
        }

        public AdvancedPaymentSubscriptionCancel(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        @Override
        int getMySize() {
            return 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(subscriptionId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("subscriptionId", Convert.toUnsignedLong(this.subscriptionId));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.SUBSCRIPTION_CANCEL;
        }

        public Long getSubscriptionId() { return this.subscriptionId; }
    }

    public final static class AdvancedPaymentSubscriptionPayment extends AbstractAttachment {

        private final Long subscriptionId;

        AdvancedPaymentSubscriptionPayment(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.subscriptionId = buffer.getLong();
        }

        AdvancedPaymentSubscriptionPayment(JSONObject attachmentData) {
            super(attachmentData);
            this.subscriptionId = Convert.parseUnsignedLong((String) attachmentData.get("subscriptionId"));
        }

        public AdvancedPaymentSubscriptionPayment(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }


        @Override
        int getMySize() {
            return 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(this.subscriptionId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("subscriptionId", Convert.toUnsignedLong(this.subscriptionId));
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AdvancedPayment.SUBSCRIPTION_PAYMENT;
        }
    }

    public final static class AutomatedTransactionsCreation extends AbstractAttachment{

        private final String name;
        private final String description;
        private final byte[] creationBytes;


        AutomatedTransactionsCreation(ByteBuffer buffer,
                                      byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);

            this.name = Convert.readString( buffer , buffer.get() , Constants.MAX_AUTOMATED_TRANSACTION_NAME_LENGTH );
            this.description = Convert.readString( buffer , buffer.getShort() , Constants.MAX_AUTOMATED_TRANSACTION_DESCRIPTION_LENGTH );

            byte[] dst = new byte[ buffer.capacity() - buffer.position() ];
            buffer.get( dst , 0 , buffer.capacity() - buffer.position() );
            this.creationBytes = dst;

        }

        AutomatedTransactionsCreation(JSONObject attachmentData) throws XinException.NotValidException {
            super(attachmentData);

            this.name = ( String ) attachmentData.get( "name" );
            this.description = ( String ) attachmentData.get( "description" );

            this.creationBytes = Convert.parseHexString( (String) attachmentData.get( "creationBytes" ) );

        }

        public AutomatedTransactionsCreation( String name, String description , byte[] creationBytes ) throws XinException.NotValidException
        {
            this.name = name;
            this.description = description;
            this.creationBytes = creationBytes;

        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AutomatedTransactions.AUTOMATED_TRANSACTION_CREATION;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes( name ).length + 2 + Convert.toBytes( description ).length + creationBytes.length;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] nameBytes = Convert.toBytes( name );
            buffer.put( ( byte ) nameBytes.length );
            buffer.put( nameBytes );
            byte[] descriptionBytes = Convert.toBytes( description );
            buffer.putShort( ( short ) descriptionBytes.length );
            buffer.put( descriptionBytes );

            buffer.put( creationBytes );
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("name", name);
            attachment.put("description", description);
            attachment.put("creationBytes", Convert.toHexString( creationBytes ) );
        }

        public String getName() { return name; }

        public String getDescription() { return description; }

        public byte[] getCreationBytes() {
            return creationBytes;
        }


    }

    final class AccountControlEffectiveBalanceLeasing extends AbstractAttachment {

        private final int period;

        AccountControlEffectiveBalanceLeasing(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.period = Short.toUnsignedInt(buffer.getShort());
        }

        AccountControlEffectiveBalanceLeasing(JSONObject attachmentData) {
            super(attachmentData);
            this.period = ((Long) attachmentData.get("period")).intValue();
        }

        public AccountControlEffectiveBalanceLeasing(int period) {
            this.period = period;
        }

        @Override
        int getMySize() {
            return 2;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putShort((short) period);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("period", period);
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AccountControl.EFFECTIVE_BALANCE_LEASING;
        }

        public int getPeriod() {
            return period;
        }
    }

    interface MonetarySystemAttachment {

        long getCurrencyId();

    }

    final class MonetarySystemCurrencyIssuance extends AbstractAttachment {

        private final String name;
        private final String code;
        private final String description;
        private final byte type;
        private final long initialSupply;
        private final long reserveSupply;
        private final long maxSupply;
        private final int issuanceHeight;
        private final long minReservePerUnitTQT;
        private final int minDifficulty;
        private final int maxDifficulty;
        private final byte ruleset;
        private final byte algorithm;
        private final byte decimals;

        MonetarySystemCurrencyIssuance(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            this.name = Convert.readString(buffer, buffer.get(), Constants.MAX_CURRENCY_NAME_LENGTH);
            this.code = Convert.readString(buffer, buffer.get(), Constants.MAX_CURRENCY_CODE_LENGTH);
            this.description = Convert.readString(buffer, buffer.getShort(), Constants.MAX_CURRENCY_DESCRIPTION_LENGTH);
            this.type = buffer.get();
            this.initialSupply = buffer.getLong();
            this.reserveSupply = buffer.getLong();
            this.maxSupply = buffer.getLong();
            this.issuanceHeight = buffer.getInt();
            this.minReservePerUnitTQT = buffer.getLong();
            this.minDifficulty = buffer.get() & 0xFF;
            this.maxDifficulty = buffer.get() & 0xFF;
            this.ruleset = buffer.get();
            this.algorithm = buffer.get();
            this.decimals = buffer.get();
        }

        MonetarySystemCurrencyIssuance(JSONObject attachmentData) {
            super(attachmentData);
            this.name = (String) attachmentData.get("name");
            this.code = (String) attachmentData.get("code");
            this.description = (String) attachmentData.get("description");
            this.type = ((Long) attachmentData.get("type")).byteValue();
            this.initialSupply = Convert.parseLong(attachmentData.get("initialSupply"));
            this.reserveSupply = Convert.parseLong(attachmentData.get("reserveSupply"));
            this.maxSupply = Convert.parseLong(attachmentData.get("maxSupply"));
            this.issuanceHeight = ((Long) attachmentData.get("issuanceHeight")).intValue();
            this.minReservePerUnitTQT = Convert.parseLong(attachmentData.get("minReservePerUnitTQT"));
            this.minDifficulty = ((Long) attachmentData.get("minDifficulty")).intValue();
            this.maxDifficulty = ((Long) attachmentData.get("maxDifficulty")).intValue();
            this.ruleset = ((Long) attachmentData.get("ruleset")).byteValue();
            this.algorithm = ((Long) attachmentData.get("algorithm")).byteValue();
            this.decimals = ((Long) attachmentData.get("decimals")).byteValue();
        }

        public MonetarySystemCurrencyIssuance(String name, String code, String description, byte type, long initialSupply, long reserveSupply,
                                              long maxSupply, int issuanceHeight, long minReservePerUnitTQT, int minDifficulty, int maxDifficulty,
                                              byte ruleset, byte algorithm, byte decimals) {
            this.name = name;
            this.code = code;
            this.description = description;
            this.type = type;
            this.initialSupply = initialSupply;
            this.reserveSupply = reserveSupply;
            this.maxSupply = maxSupply;
            this.issuanceHeight = issuanceHeight;
            this.minReservePerUnitTQT = minReservePerUnitTQT;
            this.minDifficulty = minDifficulty;
            this.maxDifficulty = maxDifficulty;
            this.ruleset = ruleset;
            this.algorithm = algorithm;
            this.decimals = decimals;
        }

        @Override
        int getMySize() {
            return 1 + Convert.toBytes(name).length + 1 + Convert.toBytes(code).length + 2 +
                    Convert.toBytes(description).length + 1 + 8 + 8 + 8 + 4 + 8 + 1 + 1 + 1 + 1 + 1;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            byte[] name = Convert.toBytes(this.name);
            byte[] code = Convert.toBytes(this.code);
            byte[] description = Convert.toBytes(this.description);
            buffer.put((byte) name.length);
            buffer.put(name);
            buffer.put((byte) code.length);
            buffer.put(code);
            buffer.putShort((short) description.length);
            buffer.put(description);
            buffer.put(type);
            buffer.putLong(initialSupply);
            buffer.putLong(reserveSupply);
            buffer.putLong(maxSupply);
            buffer.putInt(issuanceHeight);
            buffer.putLong(minReservePerUnitTQT);
            buffer.put((byte) minDifficulty);
            buffer.put((byte) maxDifficulty);
            buffer.put(ruleset);
            buffer.put(algorithm);
            buffer.put(decimals);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("name", name);
            attachment.put("code", code);
            attachment.put("description", description);
            attachment.put("type", type);
            attachment.put("initialSupply", initialSupply);
            attachment.put("reserveSupply", reserveSupply);
            attachment.put("maxSupply", maxSupply);
            attachment.put("issuanceHeight", issuanceHeight);
            attachment.put("minReservePerUnitTQT", minReservePerUnitTQT);
            attachment.put("minDifficulty", minDifficulty);
            attachment.put("maxDifficulty", maxDifficulty);
            attachment.put("ruleset", ruleset);
            attachment.put("algorithm", algorithm);
            attachment.put("decimals", decimals);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.CURRENCY_ISSUANCE;
        }

        public String getName() {
            return name;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }

        public byte getType() {
            return type;
        }

        public long getInitialSupply() {
            return initialSupply;
        }

        public long getReserveSupply() {
            return reserveSupply;
        }

        public long getMaxSupply() {
            return maxSupply;
        }

        public int getIssuanceHeight() {
            return issuanceHeight;
        }

        public long getMinReservePerUnitTQT() {
            return minReservePerUnitTQT;
        }

        public int getMinDifficulty() {
            return minDifficulty;
        }

        public int getMaxDifficulty() {
            return maxDifficulty;
        }

        public byte getRuleset() {
            return ruleset;
        }

        public byte getAlgorithm() {
            return algorithm;
        }

        public byte getDecimals() {
            return decimals;
        }
    }

    final class MonetarySystemReserveIncrease extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;
        private final long amountPerUnitTQT;

        MonetarySystemReserveIncrease(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
            this.amountPerUnitTQT = buffer.getLong();
        }

        MonetarySystemReserveIncrease(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.amountPerUnitTQT = Convert.parseLong(attachmentData.get("amountPerUnitTQT"));
        }

        public MonetarySystemReserveIncrease(long currencyId, long amountPerUnitTQT) {
            this.currencyId = currencyId;
            this.amountPerUnitTQT = amountPerUnitTQT;
        }

        @Override
        int getMySize() {
            return 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
            buffer.putLong(amountPerUnitTQT);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("amountPerUnitTQT", amountPerUnitTQT);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.RESERVE_INCREASE;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getAmountPerUnitTQT() {
            return amountPerUnitTQT;
        }

    }

    final class MonetarySystemReserveClaim extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;
        private final long units;

        MonetarySystemReserveClaim(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
            this.units = buffer.getLong();
        }

        MonetarySystemReserveClaim(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.units = Convert.parseLong(attachmentData.get("units"));
        }

        public MonetarySystemReserveClaim(long currencyId, long units) {
            this.currencyId = currencyId;
            this.units = units;
        }

        @Override
        int getMySize() {
            return 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
            buffer.putLong(units);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("units", units);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.RESERVE_CLAIM;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getUnits() {
            return units;
        }

    }

    final class MonetarySystemCurrencyTransfer extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;
        private final long units;

        MonetarySystemCurrencyTransfer(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
            this.units = buffer.getLong();
        }

        MonetarySystemCurrencyTransfer(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.units = Convert.parseLong(attachmentData.get("units"));
        }

        public MonetarySystemCurrencyTransfer(long currencyId, long units) {
            this.currencyId = currencyId;
            this.units = units;
        }

        @Override
        int getMySize() {
            return 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
            buffer.putLong(units);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("units", units);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.CURRENCY_TRANSFER;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getUnits() {
            return units;
        }
    }

    final class MonetarySystemPublishExchangeOffer extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;
        private final long buyRateTQT;
        private final long sellRateTQT;
        private final long totalBuyLimit;
        private final long totalSellLimit;
        private final long initialBuySupply;
        private final long initialSellSupply;
        private final int expirationHeight;

        MonetarySystemPublishExchangeOffer(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
            this.buyRateTQT = buffer.getLong();
            this.sellRateTQT = buffer.getLong();
            this.totalBuyLimit = buffer.getLong();
            this.totalSellLimit = buffer.getLong();
            this.initialBuySupply = buffer.getLong();
            this.initialSellSupply = buffer.getLong();
            this.expirationHeight = buffer.getInt();
        }

        MonetarySystemPublishExchangeOffer(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.buyRateTQT = Convert.parseLong(attachmentData.get("buyRateTQT"));
            this.sellRateTQT = Convert.parseLong(attachmentData.get("sellRateTQT"));
            this.totalBuyLimit = Convert.parseLong(attachmentData.get("totalBuyLimit"));
            this.totalSellLimit = Convert.parseLong(attachmentData.get("totalSellLimit"));
            this.initialBuySupply = Convert.parseLong(attachmentData.get("initialBuySupply"));
            this.initialSellSupply = Convert.parseLong(attachmentData.get("initialSellSupply"));
            this.expirationHeight = ((Long) attachmentData.get("expirationHeight")).intValue();
        }

        public MonetarySystemPublishExchangeOffer(long currencyId, long buyRateTQT, long sellRateTQT, long totalBuyLimit,
                                                  long totalSellLimit, long initialBuySupply, long initialSellSupply, int expirationHeight) {
            this.currencyId = currencyId;
            this.buyRateTQT = buyRateTQT;
            this.sellRateTQT = sellRateTQT;
            this.totalBuyLimit = totalBuyLimit;
            this.totalSellLimit = totalSellLimit;
            this.initialBuySupply = initialBuySupply;
            this.initialSellSupply = initialSellSupply;
            this.expirationHeight = expirationHeight;
        }

        @Override
        int getMySize() {
            return 8 + 8 + 8 + 8 + 8 + 8 + 8 + 4;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
            buffer.putLong(buyRateTQT);
            buffer.putLong(sellRateTQT);
            buffer.putLong(totalBuyLimit);
            buffer.putLong(totalSellLimit);
            buffer.putLong(initialBuySupply);
            buffer.putLong(initialSellSupply);
            buffer.putInt(expirationHeight);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("buyRateTQT", buyRateTQT);
            attachment.put("sellRateTQT", sellRateTQT);
            attachment.put("totalBuyLimit", totalBuyLimit);
            attachment.put("totalSellLimit", totalSellLimit);
            attachment.put("initialBuySupply", initialBuySupply);
            attachment.put("initialSellSupply", initialSellSupply);
            attachment.put("expirationHeight", expirationHeight);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.PUBLISH_EXCHANGE_OFFER;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getBuyRateTQT() {
            return buyRateTQT;
        }

        public long getSellRateTQT() {
            return sellRateTQT;
        }

        public long getTotalBuyLimit() {
            return totalBuyLimit;
        }

        public long getTotalSellLimit() {
            return totalSellLimit;
        }

        public long getInitialBuySupply() {
            return initialBuySupply;
        }

        public long getInitialSellSupply() {
            return initialSellSupply;
        }

        public int getExpirationHeight() {
            return expirationHeight;
        }

    }

    abstract class MonetarySystemExchange extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;
        private final long rateTQT;
        private final long units;

        private MonetarySystemExchange(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
            this.rateTQT = buffer.getLong();
            this.units = buffer.getLong();
        }

        private MonetarySystemExchange(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.rateTQT = Convert.parseLong(attachmentData.get("rateTQT"));
            this.units = Convert.parseLong(attachmentData.get("units"));
        }

        private MonetarySystemExchange(long currencyId, long rateTQT, long units) {
            this.currencyId = currencyId;
            this.rateTQT = rateTQT;
            this.units = units;
        }

        @Override
        int getMySize() {
            return 8 + 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
            buffer.putLong(rateTQT);
            buffer.putLong(units);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("rateTQT", rateTQT);
            attachment.put("units", units);
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getRateTQT() {
            return rateTQT;
        }

        public long getUnits() {
            return units;
        }

    }

    final class MonetarySystemExchangeBuy extends MonetarySystemExchange {

        MonetarySystemExchangeBuy(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        MonetarySystemExchangeBuy(JSONObject attachmentData) {
            super(attachmentData);
        }

        public MonetarySystemExchangeBuy(long currencyId, long rateTQT, long units) {
            super(currencyId, rateTQT, units);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.EXCHANGE_BUY;
        }

    }

    final class MonetarySystemExchangeSell extends MonetarySystemExchange {

        MonetarySystemExchangeSell(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        MonetarySystemExchangeSell(JSONObject attachmentData) {
            super(attachmentData);
        }

        public MonetarySystemExchangeSell(long currencyId, long rateTQT, long units) {
            super(currencyId, rateTQT, units);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.EXCHANGE_SELL;
        }

    }

    final class MonetarySystemCurrencyMinting extends AbstractAttachment implements MonetarySystemAttachment {

        private final long nonce;
        private final long currencyId;
        private final long units;
        private final long counter;

        MonetarySystemCurrencyMinting(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.nonce = buffer.getLong();
            this.currencyId = buffer.getLong();
            this.units = buffer.getLong();
            this.counter = buffer.getLong();
        }

        MonetarySystemCurrencyMinting(JSONObject attachmentData) {
            super(attachmentData);
            this.nonce = Convert.parseLong(attachmentData.get("nonce"));
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
            this.units = Convert.parseLong(attachmentData.get("units"));
            this.counter = Convert.parseLong(attachmentData.get("counter"));
        }

        public MonetarySystemCurrencyMinting(long nonce, long currencyId, long units, long counter) {
            this.nonce = nonce;
            this.currencyId = currencyId;
            this.units = units;
            this.counter = counter;
        }

        @Override
        int getMySize() {
            return 8 + 8 + 8 + 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(nonce);
            buffer.putLong(currencyId);
            buffer.putLong(units);
            buffer.putLong(counter);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("nonce", nonce);
            attachment.put("currency", Long.toUnsignedString(currencyId));
            attachment.put("units", units);
            attachment.put("counter", counter);
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.CURRENCY_MINTING;
        }

        public long getNonce() {
            return nonce;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }

        public long getUnits() {
            return units;
        }

        public long getCounter() {
            return counter;
        }

    }

    final class MonetarySystemCurrencyDeletion extends AbstractAttachment implements MonetarySystemAttachment {

        private final long currencyId;

        MonetarySystemCurrencyDeletion(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.currencyId = buffer.getLong();
        }

        MonetarySystemCurrencyDeletion(JSONObject attachmentData) {
            super(attachmentData);
            this.currencyId = Convert.parseUnsignedLong((String) attachmentData.get("currency"));
        }

        public MonetarySystemCurrencyDeletion(long currencyId) {
            this.currencyId = currencyId;
        }

        @Override
        int getMySize() {
            return 8;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(currencyId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("currency", Long.toUnsignedString(currencyId));
        }

        @Override
        public TransactionType getTransactionType() {
            return MonetarySystem.CURRENCY_DELETION;
        }

        @Override
        public long getCurrencyId() {
            return currencyId;
        }
    }

    final class ShufflingCreation extends AbstractAttachment {

        private final long holdingId;
        private final HoldingType holdingType;
        private final long amount;
        private final byte participantCount;
        private final short registrationPeriod;

        ShufflingCreation(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.holdingId = buffer.getLong();
            this.holdingType = HoldingType.get(buffer.get());
            this.amount = buffer.getLong();
            this.participantCount = buffer.get();
            this.registrationPeriod = buffer.getShort();
        }

        ShufflingCreation(JSONObject attachmentData) {
            super(attachmentData);
            this.holdingId = Convert.parseUnsignedLong((String) attachmentData.get("holding"));
            this.holdingType = HoldingType.get(((Long) attachmentData.get("holdingType")).byteValue());
            this.amount = Convert.parseLong(attachmentData.get("amount"));
            this.participantCount = ((Long) attachmentData.get("participantCount")).byteValue();
            this.registrationPeriod = ((Long) attachmentData.get("registrationPeriod")).shortValue();
        }

        public ShufflingCreation(long holdingId, HoldingType holdingType, long amount, byte participantCount, short registrationPeriod) {
            this.holdingId = holdingId;
            this.holdingType = holdingType;
            this.amount = amount;
            this.participantCount = participantCount;
            this.registrationPeriod = registrationPeriod;
        }

        @Override
        int getMySize() {
            return 8 + 1 + 8 + 1 + 2;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(holdingId);
            buffer.put(holdingType.getCode());
            buffer.putLong(amount);
            buffer.put(participantCount);
            buffer.putShort(registrationPeriod);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("holding", Long.toUnsignedString(holdingId));
            attachment.put("holdingType", holdingType.getCode());
            attachment.put("amount", amount);
            attachment.put("participantCount", participantCount);
            attachment.put("registrationPeriod", registrationPeriod);
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_CREATION;
        }

        public long getHoldingId() {
            return holdingId;
        }

        public HoldingType getHoldingType() {
            return holdingType;
        }

        public long getAmount() {
            return amount;
        }

        public byte getParticipantCount() {
            return participantCount;
        }

        public short getRegistrationPeriod() {
            return registrationPeriod;
        }
    }

    interface ShufflingAttachment extends Attachment {

        long getShufflingId();

        byte[] getShufflingStateHash();

    }

    abstract class AbstractShufflingAttachment extends AbstractAttachment implements ShufflingAttachment {

        private final long shufflingId;
        private final byte[] shufflingStateHash;

        private AbstractShufflingAttachment(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.shufflingId = buffer.getLong();
            this.shufflingStateHash = new byte[32];
            buffer.get(this.shufflingStateHash);
        }

        private AbstractShufflingAttachment(JSONObject attachmentData) {
            super(attachmentData);
            this.shufflingId = Convert.parseUnsignedLong((String) attachmentData.get("shuffling"));
            this.shufflingStateHash = Convert.parseHexString((String) attachmentData.get("shufflingStateHash"));
        }

        private AbstractShufflingAttachment(long shufflingId, byte[] shufflingStateHash) {
            this.shufflingId = shufflingId;
            this.shufflingStateHash = shufflingStateHash;
        }

        @Override
        int getMySize() {
            return 8 + 32;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.putLong(shufflingId);
            buffer.put(shufflingStateHash);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("shuffling", Long.toUnsignedString(shufflingId));
            attachment.put("shufflingStateHash", Convert.toHexString(shufflingStateHash));
        }

        @Override
        public final long getShufflingId() {
            return shufflingId;
        }

        @Override
        public final byte[] getShufflingStateHash() {
            return shufflingStateHash;
        }

    }

    final class ShufflingRegistration extends AbstractAttachment implements ShufflingAttachment {

        private final byte[] shufflingFullHash;

        ShufflingRegistration(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.shufflingFullHash = new byte[32];
            buffer.get(this.shufflingFullHash);
        }

        ShufflingRegistration(JSONObject attachmentData) {
            super(attachmentData);
            this.shufflingFullHash = Convert.parseHexString((String) attachmentData.get("shufflingFullHash"));
        }

        public ShufflingRegistration(byte[] shufflingFullHash) {
            this.shufflingFullHash = shufflingFullHash;
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_REGISTRATION;
        }

        @Override
        int getMySize() {
            return 32;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            buffer.put(shufflingFullHash);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            attachment.put("shufflingFullHash", Convert.toHexString(shufflingFullHash));
        }

        @Override
        public long getShufflingId() {
            return Convert.fullHashToId(shufflingFullHash);
        }

        @Override
        public byte[] getShufflingStateHash() {
            return shufflingFullHash;
        }

    }

    final class ShufflingProcessing extends AbstractShufflingAttachment implements Prunable {

        private static final byte[] emptyDataHash = Crypto.sha256().digest();

        static ShufflingProcessing parse(JSONObject attachmentData) {
            if (!Appendix.hasAppendix(ShufflingTransaction.SHUFFLING_PROCESSING.getName(), attachmentData)) {
                return null;
            }
            return new ShufflingProcessing(attachmentData);
        }

        private volatile byte[][] data;
        private final byte[] hash;

        ShufflingProcessing(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            this.hash = new byte[32];
            buffer.get(hash);
            this.data = Arrays.equals(hash, emptyDataHash) ? Convert.EMPTY_BYTES : null;
        }

        ShufflingProcessing(JSONObject attachmentData) {
            super(attachmentData);
            JSONArray jsonArray = (JSONArray) attachmentData.get("data");
            if (jsonArray != null) {
                this.data = new byte[jsonArray.size()][];
                for (int i = 0; i < this.data.length; i++) {
                    this.data[i] = Convert.parseHexString((String) jsonArray.get(i));
                }
                this.hash = null;
            } else {
                this.hash = Convert.parseHexString(Convert.emptyToNull((String) attachmentData.get("hash")));
                this.data = Arrays.equals(hash, emptyDataHash) ? Convert.EMPTY_BYTES : null;
            }
        }

        ShufflingProcessing(long shufflingId, byte[][] data, byte[] shufflingStateHash) {
            super(shufflingId, shufflingStateHash);
            this.data = data;
            this.hash = null;
        }

        @Override
        int getMyFullSize() {
            int size = super.getMySize();
            if (data != null) {
                size += 1;
                for (byte[] bytes : data) {
                    size += 4;
                    size += bytes.length;
                }
            }
            return size / 2;
        }

        @Override
        int getMySize() {
            return super.getMySize() + 32;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            super.putMyBytes(buffer);
            buffer.put(getHash());
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            super.putMyJSON(attachment);
            if (data != null) {
                JSONArray jsonArray = new JSONArray();
                attachment.put("data", jsonArray);
                for (byte[] bytes : data) {
                    jsonArray.add(Convert.toHexString(bytes));
                }
            }
            attachment.put("hash", Convert.toHexString(getHash()));
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_PROCESSING;
        }

        @Override
        public byte[] getHash() {
            if (hash != null) {
                return hash;
            } else if (data != null) {
                MessageDigest digest = Crypto.sha256();
                for (byte[] bytes : data) {
                    digest.update(bytes);
                }
                return digest.digest();
            } else {
                throw new IllegalStateException("Both hash and data are null");
            }
        }

        public byte[][] getData() {
            return data;
        }

        @Override
        void loadPrunable(Transaction transaction, boolean includeExpiredPrunable) {
            if (data == null && shouldLoadPrunable(transaction, includeExpiredPrunable)) {
                data = ShufflingParticipant.getData(getShufflingId(), transaction.getSenderId());
            }
        }

        @Override
        public boolean hasPrunableData() {
            return data != null;
        }

        @Override
        public void restorePrunableData(Transaction transaction, int blockTimestamp, int height) {
            ShufflingParticipant.restoreData(getShufflingId(), transaction.getSenderId(), getData(), transaction.getTimestamp(), height);
        }

    }

    final class ShufflingRecipients extends AbstractShufflingAttachment {

        private final byte[][] recipientPublicKeys;

        ShufflingRecipients(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            int count = buffer.get();
            if (count > Constants.MAX_NUMBER_OF_SHUFFLING_PARTICIPANTS || count < 0) {
                throw new XinException.NotValidException("Invalid data count " + count);
            }
            this.recipientPublicKeys = new byte[count][];
            for (int i = 0; i < count; i++) {
                this.recipientPublicKeys[i] = new byte[32];
                buffer.get(this.recipientPublicKeys[i]);
            }
        }

        ShufflingRecipients(JSONObject attachmentData) {
            super(attachmentData);
            JSONArray jsonArray = (JSONArray) attachmentData.get("recipientPublicKeys");
            this.recipientPublicKeys = new byte[jsonArray.size()][];
            for (int i = 0; i < this.recipientPublicKeys.length; i++) {
                this.recipientPublicKeys[i] = Convert.parseHexString((String) jsonArray.get(i));
            }
        }

        ShufflingRecipients(long shufflingId, byte[][] recipientPublicKeys, byte[] shufflingStateHash) {
            super(shufflingId, shufflingStateHash);
            this.recipientPublicKeys = recipientPublicKeys;
        }

        @Override
        int getMySize() {
            int size = super.getMySize();
            size += 1;
            size += 32 * recipientPublicKeys.length;
            return size;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            super.putMyBytes(buffer);
            buffer.put((byte) recipientPublicKeys.length);
            for (byte[] bytes : recipientPublicKeys) {
                buffer.put(bytes);
            }
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            super.putMyJSON(attachment);
            JSONArray jsonArray = new JSONArray();
            attachment.put("recipientPublicKeys", jsonArray);
            for (byte[] bytes : recipientPublicKeys) {
                jsonArray.add(Convert.toHexString(bytes));
            }
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_RECIPIENTS;
        }

        public byte[][] getRecipientPublicKeys() {
            return recipientPublicKeys;
        }

    }

    final class ShufflingVerification extends AbstractShufflingAttachment {

        ShufflingVerification(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
        }

        ShufflingVerification(JSONObject attachmentData) {
            super(attachmentData);
        }

        public ShufflingVerification(long shufflingId, byte[] shufflingStateHash) {
            super(shufflingId, shufflingStateHash);
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_VERIFICATION;
        }

    }

    final class ShufflingCancellation extends AbstractShufflingAttachment {

        private final byte[][] blameData;
        private final byte[][] keySeeds;
        private final long cancellingAccountId;

        ShufflingCancellation(ByteBuffer buffer, byte transactionVersion) throws XinException.NotValidException {
            super(buffer, transactionVersion);
            int count = buffer.get();
            if (count > Constants.MAX_NUMBER_OF_SHUFFLING_PARTICIPANTS || count <= 0) {
                throw new XinException.NotValidException("Invalid data count " + count);
            }
            this.blameData = new byte[count][];
            for (int i = 0; i < count; i++) {
                int size = buffer.getInt();
                if (size > Constants.MAX_PAYLOAD_LENGTH) {
                    throw new XinException.NotValidException("Invalid data size " + size);
                }
                this.blameData[i] = new byte[size];
                buffer.get(this.blameData[i]);
            }
            count = buffer.get();
            if (count > Constants.MAX_NUMBER_OF_SHUFFLING_PARTICIPANTS || count <= 0) {
                throw new XinException.NotValidException("Invalid keySeeds count " + count);
            }
            this.keySeeds = new byte[count][];
            for (int i = 0; i < count; i++) {
                this.keySeeds[i] = new byte[32];
                buffer.get(this.keySeeds[i]);
            }
            this.cancellingAccountId = buffer.getLong();
        }

        ShufflingCancellation(JSONObject attachmentData) {
            super(attachmentData);
            JSONArray jsonArray = (JSONArray) attachmentData.get("blameData");
            this.blameData = new byte[jsonArray.size()][];
            for (int i = 0; i < this.blameData.length; i++) {
                this.blameData[i] = Convert.parseHexString((String) jsonArray.get(i));
            }
            jsonArray = (JSONArray) attachmentData.get("keySeeds");
            this.keySeeds = new byte[jsonArray.size()][];
            for (int i = 0; i < this.keySeeds.length; i++) {
                this.keySeeds[i] = Convert.parseHexString((String) jsonArray.get(i));
            }
            this.cancellingAccountId = Convert.parseUnsignedLong((String) attachmentData.get("cancellingAccount"));
        }

        ShufflingCancellation(long shufflingId, byte[][] blameData, byte[][] keySeeds, byte[] shufflingStateHash, long cancellingAccountId) {
            super(shufflingId, shufflingStateHash);
            this.blameData = blameData;
            this.keySeeds = keySeeds;
            this.cancellingAccountId = cancellingAccountId;
        }

        @Override
        public TransactionType getTransactionType() {
            return ShufflingTransaction.SHUFFLING_CANCELLATION;
        }

        @Override
        int getMySize() {
            int size = super.getMySize();
            size += 1;
            for (byte[] bytes : blameData) {
                size += 4;
                size += bytes.length;
            }
            size += 1;
            size += 32 * keySeeds.length;
            size += 8;
            return size;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            super.putMyBytes(buffer);
            buffer.put((byte) blameData.length);
            for (byte[] bytes : blameData) {
                buffer.putInt(bytes.length);
                buffer.put(bytes);
            }
            buffer.put((byte) keySeeds.length);
            for (byte[] bytes : keySeeds) {
                buffer.put(bytes);
            }
            buffer.putLong(cancellingAccountId);
        }

        @Override
        void putMyJSON(JSONObject attachment) {
            super.putMyJSON(attachment);
            JSONArray jsonArray = new JSONArray();
            attachment.put("blameData", jsonArray);
            for (byte[] bytes : blameData) {
                jsonArray.add(Convert.toHexString(bytes));
            }
            jsonArray = new JSONArray();
            attachment.put("keySeeds", jsonArray);
            for (byte[] bytes : keySeeds) {
                jsonArray.add(Convert.toHexString(bytes));
            }
            if (cancellingAccountId != 0) {
                attachment.put("cancellingAccount", Long.toUnsignedString(cancellingAccountId));
            }
        }

        public byte[][] getBlameData() {
            return blameData;
        }

        public byte[][] getKeySeeds() {
            return keySeeds;
        }

        public long getCancellingAccountId() {
            return cancellingAccountId;
        }

        byte[] getHash() {
            MessageDigest digest = Crypto.sha256();
            for (byte[] bytes : blameData) {
                digest.update(bytes);
            }
            return digest.digest();
        }

    }

    final class SetPhasingOnly extends AbstractAttachment {

        private final PhasingParams phasingParams;
        private final long maxFees;
        private final short minDuration;
        private final short maxDuration;

        public SetPhasingOnly(PhasingParams params, long maxFees, short minDuration, short maxDuration) {
            phasingParams = params;
            this.maxFees = maxFees;
            this.minDuration = minDuration;
            this.maxDuration = maxDuration;
        }

        SetPhasingOnly(ByteBuffer buffer, byte transactionVersion) {
            super(buffer, transactionVersion);
            phasingParams = new PhasingParams(buffer);
            maxFees = buffer.getLong();
            minDuration = buffer.getShort();
            maxDuration = buffer.getShort();
        }

        SetPhasingOnly(JSONObject attachmentData) {
            super(attachmentData);
            JSONObject phasingControlParams = (JSONObject) attachmentData.get("phasingControlParams");
            phasingParams = new PhasingParams(phasingControlParams);
            maxFees = Convert.parseLong(attachmentData.get("controlMaxFees"));
            minDuration = ((Long) attachmentData.get("controlMinDuration")).shortValue();
            maxDuration = ((Long) attachmentData.get("controlMaxDuration")).shortValue();
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.AccountControl.SET_PHASING_ONLY;
        }

        @Override
        int getMySize() {
            return phasingParams.getMySize() + 8 + 2 + 2;
        }

        @Override
        void putMyBytes(ByteBuffer buffer) {
            phasingParams.putMyBytes(buffer);
            buffer.putLong(maxFees);
            buffer.putShort(minDuration);
            buffer.putShort(maxDuration);
        }

        @Override
        void putMyJSON(JSONObject json) {
            JSONObject phasingControlParams = new JSONObject();
            phasingParams.putMyJSON(phasingControlParams);
            json.put("phasingControlParams", phasingControlParams);
            json.put("controlMaxFees", maxFees);
            json.put("controlMinDuration", minDuration);
            json.put("controlMaxDuration", maxDuration);
        }

        public PhasingParams getPhasingParams() {
            return phasingParams;
        }

        public long getMaxFees() {
            return maxFees;
        }

        public short getMinDuration() {
            return minDuration;
        }

        public short getMaxDuration() {
            return maxDuration;
        }

    }
}
