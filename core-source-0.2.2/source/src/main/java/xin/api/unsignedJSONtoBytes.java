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
 
package xin.api;

import xin.XinException;
import xin.Transaction;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class unsignedJSONtoBytes extends APIServlet.APIRequestHandler {

    static final unsignedJSONtoBytes instance = new unsignedJSONtoBytes();

    private unsignedJSONtoBytes() {
        super(new APITag[] {APITag.TRANSACTIONS}, "unsignedTransactionJSON");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws ParameterException {

        String unsignedTransactionJSONString = Convert.emptyToNull(req.getParameter("unsignedTransactionJSON"));

        JSONObject response = new JSONObject();

        try {
          Transaction transaction = ParameterParser.parseTransaction(unsignedTransactionJSONString, null, null).build();

          response.put("unsignedTransactionBytes", Convert.toHexString(transaction.getUnsignedBytes()));

        } catch (XinException.NotValidException e) {
            JSONData.putException(response, e, "Incorrect unsigned transaction json");
        }
        return response;
    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

    @Override
    protected boolean requireBlockchain() {
        return false;
    }

}
