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
import xin.Subscription;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class GetSubscription extends APIServlet.APIRequestHandler {

	static final GetSubscription instance = new GetSubscription();

	private GetSubscription() {
		super(new APITag[] {APITag.ACCOUNTS}, "subscription");
	}

	@SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
		Long subscriptionId;
		try {
			subscriptionId = Convert.parseUnsignedLong(Convert.emptyToNull(req.getParameter("subscription")));
		}
		catch(Exception e) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 3);
			response.put("errorDescription", "Invalid or not specified subscription");
			return response;
		}

		Subscription subscription = Subscription.getSubscription(subscriptionId);
		if(subscription == null) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 5);
			response.put("errorDescription", "Subscription not found");
			return response;
		}

		return JSONData.subscription(subscription);
	}
}
