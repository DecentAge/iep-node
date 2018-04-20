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
import xin.util.Convert;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class IssueCurrency extends CreateTransaction {

    static final IssueCurrency instance = new IssueCurrency();

    private IssueCurrency() {
        super(new APITag[]{APITag.MS, APITag.CREATE_TRANSACTION},
                "name", "code", "description", "type", "initialSupply", "reserveSupply", "maxSupply", "issuanceHeight", "minReservePerUnitTQT",
                "minDifficulty", "maxDifficulty", "ruleset", "algorithm", "decimals");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        String name = Convert.nullToEmpty(req.getParameter("name"));
        String code = Convert.nullToEmpty(req.getParameter("code"));
        String description = Convert.nullToEmpty(req.getParameter("description"));

        if (name.length() < Constants.MIN_CURRENCY_NAME_LENGTH || name.length() > Constants.MAX_CURRENCY_NAME_LENGTH) {
            return JSONResponses.INCORRECT_CURRENCY_NAME_LENGTH;
        }
        if (code.length() < Constants.MIN_CURRENCY_CODE_LENGTH || code.length() > Constants.MAX_CURRENCY_CODE_LENGTH) {
            return JSONResponses.INCORRECT_CURRENCY_CODE_LENGTH;
        }
        if (description.length() > Constants.MAX_CURRENCY_DESCRIPTION_LENGTH) {
            return JSONResponses.INCORRECT_CURRENCY_DESCRIPTION_LENGTH;
        }
        String normalizedName = name.toLowerCase();
        for (int i = 0; i < normalizedName.length(); i++) {
            if (Constants.ALPHABET.indexOf(normalizedName.charAt(i)) < 0) {
                return JSONResponses.INCORRECT_CURRENCY_NAME;
            }
        }
        for (int i = 0; i < code.length(); i++) {
            if (Constants.ALLOWED_CURRENCY_CODE_LETTERS.indexOf(code.charAt(i)) < 0) {
                return JSONResponses.INCORRECT_CURRENCY_CODE;
            }
        }

        int type = 0;
        if (Convert.emptyToNull(req.getParameter("type")) == null) {
            for (CurrencyType currencyType : CurrencyType.values()) {
                if ("1".equals(req.getParameter(currencyType.toString().toLowerCase()))) {
                    type = type | currencyType.getCode();
                }
            }
        } else {
            type = ParameterParser.getInt(req, "type", 0, Integer.MAX_VALUE, false);
        }

        long maxSupply = ParameterParser.getLong(req, "maxSupply", 1, Constants.MAX_CURRENCY_TOTAL_SUPPLY, false);
        long reserveSupply = ParameterParser.getLong(req, "reserveSupply", 0, maxSupply, false);
        long initialSupply = ParameterParser.getLong(req, "initialSupply", 0, maxSupply, false);
        int issuanceHeight = ParameterParser.getInt(req, "issuanceHeight", 0, Integer.MAX_VALUE, false);
        long minReservePerUnit = ParameterParser.getLong(req, "minReservePerUnitTQT", 1, Constants.MAX_BALANCE_TQT, false);
        int minDifficulty = ParameterParser.getInt(req, "minDifficulty", 1, 255, false);
        int maxDifficulty = ParameterParser.getInt(req, "maxDifficulty", 1, 255, false);
        byte ruleset = ParameterParser.getByte(req, "ruleset", (byte) 0, Byte.MAX_VALUE, false);
        byte algorithm = ParameterParser.getByte(req, "algorithm", (byte) 0, Byte.MAX_VALUE, false);
        byte decimals = ParameterParser.getByte(req, "decimals", (byte) 0, Byte.MAX_VALUE, false);
        Account account = ParameterParser.getSenderAccount(req);
        Attachment attachment = new Attachment.MonetarySystemCurrencyIssuance(name, code, description, (byte) type, initialSupply,
                reserveSupply, maxSupply, issuanceHeight, minReservePerUnit, minDifficulty, maxDifficulty, ruleset, algorithm, decimals);

        return createTransaction(req, account, attachment);
    }
}
