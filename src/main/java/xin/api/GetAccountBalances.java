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

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import xin.Account;
import xin.XinException;
import xin.db.DbIterator;

public class GetAccountBalances extends APIServlet.APIRequestHandler {

    static final GetAccountBalances instance = new GetAccountBalances();

    private GetAccountBalances() {
        super(new APITag[]{APITag.ACCOUNTS}, "index", "size");
    }

    @SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        int index = ParameterParser.getInt(req, "index", 0, 100, true);
        int size = ParameterParser.getInt(req, "size", 0, 50, true);
        
        if (size <= 0) size = 1;
        if (size > 50) size = 50;
        
        if(index < 0) index = 0;
        if(index > 100) index = 100;
        
        int to = (index +1) * size;
        int from = to - size;
        to = to - 1;
        
        JSONObject response = new JSONObject();
        try (DbIterator<Account> accounts = Account.getAccountBalances(from, to)) {
        	JSONArray accountInfo = new JSONArray();
            if (accounts.hasNext()) {
                while (accounts.hasNext()) {
                    Account account = accounts.next();
                    accountInfo.add(JSONData.accountBalance(account, true));
                }
            }
            response.put("balances", accountInfo);
            response.put("total", Account.getCount());
        }
        return response;
    }
}
