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
import xin.util.Convert;
import xin.util.JSON;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

import static xin.api.JSONResponses.INCORRECT_HOST;
import static xin.api.JSONResponses.INCORRECT_PUBLIC_KEY;

public final class ShufflingProcess extends CreateTransaction {

    static final ShufflingProcess instance = new ShufflingProcess();

    private ShufflingProcess() {
        super(new APITag[]{APITag.SHUFFLING, APITag.CREATE_TRANSACTION},
                "shuffling", "recipientSecretPhrase", "recipientPublicKey");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
    	if (!API.isAllowedLocalhost(req.getRemoteHost())) {
    		return INCORRECT_HOST;
        }
        Shuffling shuffling = ParameterParser.getShuffling(req);
        if (shuffling.getStage() != Shuffling.Stage.PROCESSING) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 11);
            response.put("errorDescription", "Shuffling is not in processing, stage " + shuffling.getStage());
            return JSON.prepare(response);
        }
        Account senderAccount = ParameterParser.getSenderAccount(req);
        long senderId = senderAccount.getId();
        if (shuffling.getAssigneeAccountId() != senderId) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 12);
            response.put("errorDescription", String.format("Account %s cannot process shuffling since shuffling assignee is %s",
                    Convert.rsAccount(senderId), Convert.rsAccount(shuffling.getAssigneeAccountId())));
            return JSON.prepare(response);
        }
        ShufflingParticipant participant = shuffling.getParticipant(senderId);
        if (participant == null) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 13);
            response.put("errorDescription", String.format("Account %s is not a participant of shuffling %d",
                    Convert.rsAccount(senderId), shuffling.getId()));
            return JSON.prepare(response);
        }

        String secretPhrase = ParameterParser.getSecretPhrase(req, true);
        byte[] recipientPublicKey = ParameterParser.getPublicKey(req, "recipient");
        if (Account.getAccount(recipientPublicKey) != null) {
            return INCORRECT_PUBLIC_KEY; // do not allow existing account to be used as recipient
        }

        Attachment.ShufflingAttachment attachment = shuffling.process(senderId, secretPhrase, recipientPublicKey);
        return createTransaction(req, senderAccount, attachment);
    }

}
