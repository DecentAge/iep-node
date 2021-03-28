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

import xin.AccountLedger;
import xin.AccountLedger.LedgerEntry;
import xin.XinException;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public class GetAccountLedgerEntry extends APIServlet.APIRequestHandler {

    /**
     * GetAccountLedgerEntry instance
     */
    static final GetAccountLedgerEntry instance = new GetAccountLedgerEntry();

    /**
     * Create the GetAccountLedgerEntry instance
     */
    private GetAccountLedgerEntry() {
        super(new APITag[]{APITag.ACCOUNTS}, "ledgerId", "includeTransaction", "includeHoldingInfo");
    }

    /**
     * Process the GetAccountLedgerEntry API request
     *
     * @param req API request
     * @return API response
     * @throws XinException Invalid request
     */
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        //
        // Process the request parameters
        //
        long ledgerId = ParameterParser.getUnsignedLong(req, "ledgerId", true);
        boolean includeTransaction = "true".equalsIgnoreCase(req.getParameter("includeTransaction"));
        boolean includeHoldingInfo = "true".equalsIgnoreCase(req.getParameter("includeHoldingInfo"));

        //
        // Get the ledger entry
        //
        LedgerEntry ledgerEntry = AccountLedger.getEntry(ledgerId);
        if (ledgerEntry == null)
            return JSONResponses.UNKNOWN_ENTRY;
        //
        // Return the response
        //
        JSONObject response = new JSONObject();
        JSONData.ledgerEntry(response, ledgerEntry, includeTransaction, includeHoldingInfo);
        return response;
    }

    /**
     * No required block parameters
     *
     * @return FALSE to disable the required block parameters
     */
    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }
}
