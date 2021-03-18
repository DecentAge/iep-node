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
import xin.Attachment;
import xin.XinException;
import xin.Subscription;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class SubscriptionCancel extends CreateTransaction {

	static SubscriptionCancel instance = new SubscriptionCancel();

	private SubscriptionCancel() {
		super(new APITag[] {APITag.TRANSACTIONS, APITag.CREATE_TRANSACTION},
			  "subscription");
	}

	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
		Account sender = ParameterParser.getSenderAccount(req);

		String subscriptionString = Convert.emptyToNull(req.getParameter("subscription"));
		if(subscriptionString == null) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 3);
			response.put("errorDescription", "Subscription Id not specified");
			return response;
		}

		Long subscriptionId;
		try {
			subscriptionId = Convert.parseUnsignedLong(subscriptionString);
		}
		catch(Exception e) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 4);
			response.put("errorDescription", "Failed to parse subscription id");
			return response;
		}

		Subscription subscription = Subscription.getSubscription(subscriptionId);
		if(subscription == null) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 5);
			response.put("errorDescription", "Subscription not found");
			return response;
		}

		if(sender.getId() != subscription.getSenderId() &&
		   sender.getId()!= subscription.getRecipientId()) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 7);
			response.put("errorDescription", "Must be sender or recipient to cancel subscription");
			return response;
		}

		Attachment.AdvancedPaymentSubscriptionCancel attachment = new Attachment.AdvancedPaymentSubscriptionCancel(subscription.getId());

		return createTransaction(req, sender, 0, 0, attachment);
	}
}
