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

import xin.Account;
import xin.Attachment;
import xin.Currency;
import xin.XinException;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class CurrencyBuy extends CreateTransaction {

    static final CurrencyBuy instance = new CurrencyBuy();

    private CurrencyBuy() {
        super(new APITag[]{APITag.MS, APITag.CREATE_TRANSACTION}, "currency", "rateTQT", "units");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        Currency currency = ParameterParser.getCurrency(req);
        long rateTQT = ParameterParser.getLong(req, "rateTQT", 0, Long.MAX_VALUE, true);
        long units = ParameterParser.getLong(req, "units", 0, Long.MAX_VALUE, true);
        Account account = ParameterParser.getSenderAccount(req);

        Attachment attachment = new Attachment.MonetarySystemExchangeBuy(currency.getId(), rateTQT, units);
        try {
            return createTransaction(req, account, attachment);
        } catch (XinException.InsufficientBalanceException e) {
            return JSONResponses.NOT_ENOUGH_FUNDS;
        }
    }

}
