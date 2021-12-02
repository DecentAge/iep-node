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

import xin.Account;
import xin.Escrow;
import xin.XinException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;

public final class GetAccountEscrowTransactions extends APIServlet.APIRequestHandler {

	static final GetAccountEscrowTransactions instance = new GetAccountEscrowTransactions();

	private GetAccountEscrowTransactions() {
		super(new APITag[] {APITag.ACCOUNTS}, "account");
	}

	@SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

		Account account = ParameterParser.getAccount(req);

		Collection<Escrow> accountEscrows = Escrow.getEscrowTransactionsByParticipent(account.getId());

		JSONObject response = new JSONObject();

		JSONArray escrows = new JSONArray();

		for(Escrow escrow : accountEscrows) {
			escrows.add(JSONData.escrowTransaction(escrow));
		}

		response.put("escrows", escrows);
		return response;
	}
}
