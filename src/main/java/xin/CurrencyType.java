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

import xin.crypto.HashFunction;

import java.util.EnumSet;
import java.util.Set;

/**
 * Define and validate currency capabilities
 */
public enum CurrencyType {

    /**
     * Can be exchanged from/to XIN<br>
     */
    EXCHANGEABLE(0x01) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                if (!validators.contains(CLAIMABLE)) {
                    throw new XinException.NotValidException("Currency is not exchangeable and not claimable");
                }
            }
            if (transaction.getType() instanceof MonetarySystem.MonetarySystemExchange || transaction.getType() == MonetarySystem.PUBLISH_EXCHANGE_OFFER) {
                throw new XinException.NotValidException("Currency is not exchangeable");
            }
        }
    },
    /**
     * Transfers are only allowed from/to issuer account<br>
     * Only issuer account can publish exchange offer<br>
     */
    CONTROLLABLE(0x02) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.CURRENCY_TRANSFER) {
                if (currency == null || (currency.getAccountId() != transaction.getSenderId() && currency.getAccountId() != transaction.getRecipientId())) {
                    throw new XinException.NotValidException("Controllable currency can only be transferred to/from issuer account");
                }
            }
            if (transaction.getType() == MonetarySystem.PUBLISH_EXCHANGE_OFFER) {
                if (currency == null || currency.getAccountId() != transaction.getSenderId()) {
                    throw new XinException.NotValidException("Only currency issuer can publish an exchange offer for controllable currency");
                }
            }
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) {
        }

    },
    /**
     * Can be reserved before the currency is active, reserve is distributed to founders once the currency becomes active<br>
     */
    RESERVABLE(0x04) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException {
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                Attachment.MonetarySystemCurrencyIssuance attachment = (Attachment.MonetarySystemCurrencyIssuance) transaction.getAttachment();
                int issuanceHeight = attachment.getIssuanceHeight();
                int finishHeight = attachment.getFinishValidationHeight(transaction);
                if (issuanceHeight <= finishHeight) {
                    throw new XinException.NotCurrentlyValidException(
                            String.format("Reservable currency activation height %d not higher than transaction apply height %d",
                                    issuanceHeight, finishHeight));
                }
                if (attachment.getMinReservePerUnitTQT() <= 0) {
                    throw new XinException.NotValidException("Minimum reserve per unit must be > 0");
                }
                if (Math.multiplyExact(attachment.getMinReservePerUnitTQT(), attachment.getReserveSupply()) > Constants.MAX_BALANCE_TQT) {
                    throw new XinException.NotValidException("Minimum reserve per unit is too large");
                }
                if (attachment.getReserveSupply() <= attachment.getInitialSupply()) {
                    throw new XinException.NotValidException("Reserve supply must exceed initial supply");
                }
                if (!validators.contains(MINTABLE) && attachment.getReserveSupply() < attachment.getMaxSupply()) {
                    throw new XinException.NotValidException("Max supply must not exceed reserve supply for reservable and non-mintable currency");
                }
            }
            if (transaction.getType() == MonetarySystem.RESERVE_INCREASE) {
                Attachment.MonetarySystemReserveIncrease attachment = (Attachment.MonetarySystemReserveIncrease) transaction.getAttachment();
                if (currency != null && currency.getIssuanceHeight() <= attachment.getFinishValidationHeight(transaction)) {
                    throw new XinException.NotCurrentlyValidException("Cannot increase reserve for active currency");
                }
            }
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.RESERVE_INCREASE) {
                throw new XinException.NotValidException("Cannot increase reserve since currency is not reservable");
            }
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                Attachment.MonetarySystemCurrencyIssuance attachment = (Attachment.MonetarySystemCurrencyIssuance) transaction.getAttachment();
                if (attachment.getIssuanceHeight() != 0) {
                    throw new XinException.NotValidException("Issuance height for non-reservable currency must be 0");
                }
                if (attachment.getMinReservePerUnitTQT() > 0) {
                    throw new XinException.NotValidException("Minimum reserve per unit for non-reservable currency must be 0 ");
                }
                if (attachment.getReserveSupply() > 0) {
                    throw new XinException.NotValidException("Reserve supply for non-reservable currency must be 0");
                }
                if (!validators.contains(MINTABLE) && attachment.getInitialSupply() < attachment.getMaxSupply()) {
                    throw new XinException.NotValidException("Initial supply for non-reservable and non-mintable currency must be equal to max supply");
                }
            }
        }
    },
    /**
     * Is {@link #RESERVABLE} and can be claimed after currency is active<br>
     * Cannot be {@link #EXCHANGEABLE}
     */
    CLAIMABLE(0x08) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException {
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                Attachment.MonetarySystemCurrencyIssuance attachment = (Attachment.MonetarySystemCurrencyIssuance) transaction.getAttachment();
                if (!validators.contains(RESERVABLE)) {
                    throw new XinException.NotValidException("Claimable currency must be reservable");
                }
                if (validators.contains(MINTABLE)) {
                    throw new XinException.NotValidException("Claimable currency cannot be mintable");
                }
                if (attachment.getInitialSupply() > 0) {
                    throw new XinException.NotValidException("Claimable currency must have initial supply 0");
                }
            }
            if (transaction.getType() == MonetarySystem.RESERVE_CLAIM) {
                if (currency == null || !currency.isActive()) {
                    throw new XinException.NotCurrentlyValidException("Cannot claim reserve since currency is not yet active");
                }
            }
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.RESERVE_CLAIM) {
                throw new XinException.NotValidException("Cannot claim reserve since currency is not claimable");
            }
        }
    },
    /**
     * Can be minted using proof of work algorithm<br>
     */
    MINTABLE(0x10) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                Attachment.MonetarySystemCurrencyIssuance issuanceAttachment = (Attachment.MonetarySystemCurrencyIssuance) transaction.getAttachment();
                try {
                    HashFunction hashFunction = HashFunction.getHashFunction(issuanceAttachment.getAlgorithm());
                    if (!CurrencyMinting.acceptedHashFunctions.contains(hashFunction)) {
                        throw new XinException.NotValidException("Invalid minting algorithm " + hashFunction);
                    }
                } catch (IllegalArgumentException e) {
                    throw new XinException.NotValidException("Illegal algorithm code specified", e);
                }
                if (issuanceAttachment.getMinDifficulty() < 1 || issuanceAttachment.getMaxDifficulty() > 255 ||
                        issuanceAttachment.getMaxDifficulty() < issuanceAttachment.getMinDifficulty()) {
                    throw new XinException.NotValidException(
                            String.format("Invalid minting difficulties min %d max %d, difficulty must be between 1 and 255, max larger than min",
                                    issuanceAttachment.getMinDifficulty(), issuanceAttachment.getMaxDifficulty()));
                }
                if (issuanceAttachment.getMaxSupply() <= issuanceAttachment.getReserveSupply()) {
                    throw new XinException.NotValidException("Max supply for mintable currency must exceed reserve supply");
                }
            }
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.NotValidException {
            if (transaction.getType() == MonetarySystem.CURRENCY_ISSUANCE) {
                Attachment.MonetarySystemCurrencyIssuance issuanceAttachment = (Attachment.MonetarySystemCurrencyIssuance) transaction.getAttachment();
                if (issuanceAttachment.getMinDifficulty() != 0 ||
                        issuanceAttachment.getMaxDifficulty() != 0 ||
                        issuanceAttachment.getAlgorithm() != 0) {
                    throw new XinException.NotValidException("Non mintable currency should not specify algorithm or difficulty");
                }
            }
            if (transaction.getType() == MonetarySystem.CURRENCY_MINTING) {
                throw new XinException.NotValidException("Currency is not mintable");
            }
        }

    },
    /**
     * Several accounts can shuffle their currency units and then distributed to recipients<br>
     */
    NON_SHUFFLEABLE(0x20) {
        @Override
        void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException {
            if (transaction.getType() == ShufflingTransaction.SHUFFLING_CREATION) {
                throw new XinException.NotValidException("Shuffling is not allowed for this currency");
            }
        }

        @Override
        void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException {
        }
    };

    private final int code;

    CurrencyType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    abstract void validate(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException;

    abstract void validateMissing(Currency currency, Transaction transaction, Set<CurrencyType> validators) throws XinException.ValidationException;

    public static CurrencyType get(int code) {
        for (CurrencyType currencyType : values()) {
            if (currencyType.getCode() == code) {
                return currencyType;
            }
        }
        return null;
    }

    static void validate(Currency currency, Transaction transaction) throws XinException.ValidationException {
        if (currency == null) {
            throw new XinException.NotCurrentlyValidException("Unknown currency: " + transaction.getAttachment().getJSONObject());
        }
        validate(currency, currency.getType(), transaction);
    }

    static void validate(int type, Transaction transaction) throws XinException.ValidationException {
        validate(null, type, transaction);
    }

    private static void validate(Currency currency, int type, Transaction transaction) throws XinException.ValidationException {
        if (transaction.getAmountTQT() != 0) {
            throw new XinException.NotValidException("Currency transaction token amount must be 0");
        }

        final EnumSet<CurrencyType> validators = EnumSet.noneOf(CurrencyType.class);
        for (CurrencyType validator : CurrencyType.values()) {
            if ((validator.getCode() & type) != 0) {
                validators.add(validator);
            }
        }
        if (validators.isEmpty()) {
            throw new XinException.NotValidException("Currency type not specified");
        }
        for (CurrencyType validator : CurrencyType.values()) {
            if ((validator.getCode() & type) != 0) {
                validator.validate(currency, transaction, validators);
            } else {
                validator.validateMissing(currency, transaction, validators);
            }
        }
    }

    static void validateCurrencyNaming(long issuerAccountId, Attachment.MonetarySystemCurrencyIssuance attachment) throws XinException.ValidationException {
        String name = attachment.getName();
        String code = attachment.getCode();
        String description = attachment.getDescription();
        if (name.length() < Constants.MIN_CURRENCY_NAME_LENGTH || name.length() > Constants.MAX_CURRENCY_NAME_LENGTH
                || name.length() < code.length()
                || code.length() < Constants.MIN_CURRENCY_CODE_LENGTH || code.length() > Constants.MAX_CURRENCY_CODE_LENGTH
                || description.length() > Constants.MAX_CURRENCY_DESCRIPTION_LENGTH) {
            throw new XinException.NotValidException(String.format("Invalid currency name %s code %s or description %s", name, code, description));
        }
        String normalizedName = name.toLowerCase();
        String normalizedCode = code.toLowerCase();

        for (int i = 0; i < normalizedName.length(); i++) {
            if (Constants.ALPHABET.indexOf(normalizedName.charAt(i)) < 0) {
                throw new XinException.NotValidException("Invalid currency name: " + normalizedName);
            }
        }

        for (int i = 0; i < code.length(); i++) {
            if (Constants.ALLOWED_CURRENCY_CODE_LETTERS.indexOf(code.charAt(i)) < 0) {
                throw new XinException.NotValidException("Invalid currency code: " + code + " code must be all upper case");
            }
        }

        if (

            "xin".equals(normalizedName) ||
            "btc".equals(normalizedName) ||
            "eth".equals(normalizedName) ||
            "ltc".equals(normalizedName) ||
            "xrp".equals(normalizedName) ||
            "xmr".equals(normalizedName)

        ) {
            throw new XinException.NotValidException("Currency name already used");
        }

        if (

            "xin".equals(normalizedCode) ||
            "btc".equals(normalizedCode) ||
            "eth".equals(normalizedCode) ||
            "ltc".equals(normalizedCode) ||
            "xrp".equals(normalizedCode) ||
            "xmr".equals(normalizedCode)

        ) {
            throw new XinException.NotValidException("Currency code restricted");
        }

        Currency currency;
        if ((currency = Currency.getCurrencyByName(normalizedName)) != null && !currency.canBeDeletedBy(issuerAccountId)) {
            throw new XinException.NotCurrentlyValidException("Currency name already used: " + normalizedName);
        }
        if ((currency = Currency.getCurrencyByCode(name)) != null && !currency.canBeDeletedBy(issuerAccountId)) {
            throw new XinException.NotCurrentlyValidException("Currency name already used as code: " + normalizedName);
        }
        if ((currency = Currency.getCurrencyByCode(code)) != null && !currency.canBeDeletedBy(issuerAccountId)) {
            throw new XinException.NotCurrentlyValidException("Currency code already used: " + code);
        }
        if ((currency = Currency.getCurrencyByName(code)) != null && !currency.canBeDeletedBy(issuerAccountId)) {
            throw new XinException.NotCurrentlyValidException("Currency code already used as name: " + code);
        }
    }

}
