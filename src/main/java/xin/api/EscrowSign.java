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
import xin.Escrow;
import xin.XinException;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class EscrowSign extends CreateTransaction {

	static final EscrowSign instance = new EscrowSign();

	private EscrowSign() {
		super(new APITag[] {APITag.TRANSACTIONS, APITag.CREATE_TRANSACTION},
			  "escrow",
			  "decision");
	}

	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
		Long escrowId;
		try {
			escrowId = Convert.parseUnsignedLong(Convert.emptyToNull(req.getParameter("escrow")));
		}
		catch(Exception e) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 3);
			response.put("errorDescription", "Invalid or not specified escrow");
			return response;
		}

		Escrow escrow = Escrow.getEscrowTransaction(escrowId);
		if(escrow == null) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 5);
			response.put("errorDescription", "Escrow transaction not found");
			return response;
		}

		Escrow.DecisionType decision = Escrow.stringToDecision(req.getParameter("decision"));
		if(decision == null) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 5);
			response.put("errorDescription", "Invalid or not specified action");
			return response;
		}

		Account sender = ParameterParser.getSenderAccount(req);
		if(!(escrow.getSenderId().equals(sender.getId())) &&
		   !(escrow.getRecipientId().equals(sender.getId())) &&
		   !escrow.isIdSigner(sender.getId())) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 5);
			response.put("errorDescription", "Invalid or not specified action");
			return response;
		}

		if(escrow.getSenderId().equals(sender.getId()) && decision != Escrow.DecisionType.RELEASE) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 4);
			response.put("errorDescription", "Sender can only release");
			return response;
		}

		if(escrow.getRecipientId().equals(sender.getId()) && decision != Escrow.DecisionType.REFUND) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 4);
			response.put("errorDescription", "Recipient can only refund");
			return response;
		}

		Attachment.AdvancedPaymentEscrowSign attachment = new Attachment.AdvancedPaymentEscrowSign(escrow.getId(), decision);

		return createTransaction(req, sender, 0, 0, attachment);
		
	}
}
