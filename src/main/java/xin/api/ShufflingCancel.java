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

import xin.Account;
import xin.Attachment;
import xin.XinException;
import xin.Shuffling;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import static xin.api.JSONResponses.INCORRECT_HOST;

public final class ShufflingCancel extends CreateTransaction {

    static final ShufflingCancel instance = new ShufflingCancel();

    private ShufflingCancel() {
        super(new APITag[]{APITag.SHUFFLING, APITag.CREATE_TRANSACTION}, "shuffling", "cancellingAccount", "shufflingStateHash");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
    	if (!API.isAllowedLocalhost(req.getRemoteHost())) {
    		return INCORRECT_HOST;
        }
        Shuffling shuffling = ParameterParser.getShuffling(req);
        long cancellingAccountId = ParameterParser.getAccountId(req, "cancellingAccount", false);
        byte[] shufflingStateHash = ParameterParser.getBytes(req, "shufflingStateHash", true);
        String secretPhrase = ParameterParser.getSecretPhrase(req, true);
        Attachment.ShufflingCancellation attachment = shuffling.revealKeySeeds(secretPhrase, cancellingAccountId, shufflingStateHash);
        Account account = ParameterParser.getSenderAccount(req);
        return createTransaction(req, account, attachment);
    }
}
