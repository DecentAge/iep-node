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
import xin.XinException;
import xin.Subscription;
import xin.db.DbIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class GetAccountSubscriptions extends APIServlet.APIRequestHandler {

	static final GetAccountSubscriptions instance = new GetAccountSubscriptions();

	private GetAccountSubscriptions() {
		super(new APITag[] {APITag.ACCOUNTS}, "account");
	}

	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

		Account account = ParameterParser.getAccount(req);

		JSONObject response = new JSONObject();

		JSONArray subscriptions = new JSONArray();

		DbIterator<Subscription> accountSubscriptions = Subscription.getSubscriptionsByParticipant(account.getId());

		for(Subscription subscription : accountSubscriptions) {
			subscriptions.add(JSONData.subscription(subscription));
		}

		response.put("subscriptions", subscriptions);
		return response;
	}
}
