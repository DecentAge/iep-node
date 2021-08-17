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
import xin.crypto.Crypto;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import static xin.api.JSONResponses.INCORRECT_HOST;
import static xin.api.JSONResponses.*;

public final class StartFundingMonitor extends APIServlet.APIRequestHandler {

    static final StartFundingMonitor instance = new StartFundingMonitor();

    private StartFundingMonitor() {
        super(new APITag[]{APITag.ACCOUNTS}, "holdingType", "holding", "property", "amount", "threshold",
                "interval", "secretPhrase","adminPassword");
    }

    /**
     * Process the request
     *
     * @param req Client request
     * @return Client response
     * @throws XinException Unable to process request
     */
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
    	if (!API.isAllowed(req.getRemoteHost())) {
    		return INCORRECT_HOST;
        }
    	API.verifyPassword(req);

        HoldingType holdingType = ParameterParser.getHoldingType(req);
        long holdingId = ParameterParser.getHoldingId(req, holdingType);
        String property = ParameterParser.getAccountProperty(req, true);
        long amount = ParameterParser.getLong(req, "amount", 0, Long.MAX_VALUE, true);
        if (amount < FundingMonitor.MIN_FUND_AMOUNT) {
            throw new ParameterException(incorrect("amount", "Minimum funding amount is " + FundingMonitor.MIN_FUND_AMOUNT));
        }
        long threshold = ParameterParser.getLong(req, "threshold", 0, Long.MAX_VALUE, true);
        if (threshold < FundingMonitor.MIN_FUND_THRESHOLD) {
            throw new ParameterException(incorrect("threshold", "Minimum funding threshold is " + FundingMonitor.MIN_FUND_THRESHOLD));
        }
        int interval = ParameterParser.getInt(req, "interval", FundingMonitor.MIN_FUND_INTERVAL, Integer.MAX_VALUE, true);
        String secretPhrase = ParameterParser.getSecretPhrase(req, true);
        switch (holdingType) {
            case ASSET:
                Asset asset = Asset.getAsset(holdingId);
                if (asset == null) {
                    throw new ParameterException(JSONResponses.UNKNOWN_ASSET);
                }
                break;
            case CURRENCY:
                Currency currency = Currency.getCurrency(holdingId);
                if (currency == null) {
                    throw new ParameterException(JSONResponses.UNKNOWN_CURRENCY);
                }
                break;
        }
        Account account = Account.getAccount(Crypto.getPublicKey(secretPhrase));
        if (account == null) {
            throw new ParameterException(UNKNOWN_ACCOUNT);
        }
        if (FundingMonitor.startMonitor(holdingType, holdingId, property, amount, threshold, interval, secretPhrase)) {
            JSONObject response = new JSONObject();
            response.put("started", true);
            return response;
        } else {
            return MONITOR_ALREADY_STARTED;
        }
    }

    @Override
    protected boolean requirePost() {
        return true;
    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }
}
