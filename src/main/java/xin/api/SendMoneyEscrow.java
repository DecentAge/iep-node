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

import xin.*;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

public final class SendMoneyEscrow extends CreateTransaction {

    static final SendMoneyEscrow instance = new SendMoneyEscrow();

    private SendMoneyEscrow() {
        super(new APITag[]{APITag.TRANSACTIONS, APITag.CREATE_TRANSACTION},
                "recipient",
                "amountTQT",
                "escrowDeadline",
                "deadlineAction",
                "requiredSigners",
                "signers");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        Account sender = ParameterParser.getSenderAccount(req);
        Long recipient = ParameterParser.getAccountId(req, "recipient", true);
        Long amountTQT = ParameterParser.getAmountTQT(req);
        String signerString = Convert.emptyToNull(req.getParameter("signers"));

        Long requiredSigners;
        try {
            requiredSigners = Convert.parseLong(req.getParameter("requiredSigners"));
            if (requiredSigners < Constants.ESCROW_MIN_NUM_OF_SIGNERS || requiredSigners > Constants
                    .ESCROW_MAX_NUM_OF_SIGNERS) {
                JSONObject response = new JSONObject();
                response.put("errorCode", 4);
                response.put("errorDescription", "Invalid number of requiredSigners");
                return response;
            }
        } catch (Exception e) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 4);
            response.put("errorDescription", "Invalid requiredSigners parameter");
            return response;
        }

        if (signerString == null) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 3);
            response.put("errorDescription", "Signers not specified");
            return response;
        }

        String signersArray[] = signerString.split(";", 10);

        if (signersArray.length < Constants.ESCROW_MIN_NUM_OF_SIGNERS || signersArray.length > Constants
                .ESCROW_MAX_NUM_OF_SIGNERS || signersArray.length < requiredSigners) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 4);
            response.put("errorDescription", "Invalid number of signers");
            return response;
        }

        ArrayList<Long> signers = new ArrayList<>();

        try {
            for (String signer : signersArray) {
                Long id = Convert.parseAccountId(signer);
                if (id == null) {
                    throw new Exception("");
                }

                signers.add(id);
            }
        } catch (Exception e) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 4);
            response.put("errorDescription", "Invalid signers parameter");
            return response;
        }

        Long totalAmountTQT = Math.addExact(amountTQT, signers.size() * Constants.ONE_XIN);
        if (sender.getBalanceTQT() < totalAmountTQT) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 6);
            response.put("errorDescription", "Insufficient funds");
            return response;
        }

        Long deadline;
        try {
            deadline = Convert.parseLong(req.getParameter("escrowDeadline"));
            if (deadline < 1 || deadline > 7776000) {
                JSONObject response = new JSONObject();
                response.put("errorCode", 4);
                response.put("errorDescription", "Escrow deadline must be 1 - 7776000");
                return response;
            }
        } catch (Exception e) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 4);
            response.put("errorDescription", "Invalid escrowDeadline parameter");
            return response;
        }

        Escrow.DecisionType deadlineAction = Escrow.stringToDecision(req.getParameter("deadlineAction"));
        if (deadlineAction == null || deadlineAction == Escrow.DecisionType.UNDECIDED) {
            JSONObject response = new JSONObject();
            response.put("errorCode", 4);
            response.put("errorDescription", "Invalid deadlineAction parameter");
            return response;
        }

        Attachment.AdvancedPaymentEscrowCreation attachment = new Attachment.AdvancedPaymentEscrowCreation(amountTQT, deadline.intValue(), deadlineAction, requiredSigners.intValue(), signers);

        return createTransaction(req, sender, recipient, 0, attachment);
    }
}
