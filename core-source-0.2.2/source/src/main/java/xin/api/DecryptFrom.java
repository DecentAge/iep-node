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
import xin.XinException;
import xin.crypto.EncryptedData;
import xin.util.Convert;
import xin.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

import static xin.api.JSONResponses.DECRYPTION_FAILED;
import static xin.api.JSONResponses.INCORRECT_ACCOUNT;

public final class DecryptFrom extends APIServlet.APIRequestHandler {

    static final DecryptFrom instance = new DecryptFrom();

    private DecryptFrom() {
        super(new APITag[]{APITag.MESSAGES}, "account", "data", "nonce", "decryptedMessageIsText", "uncompressDecryptedMessage", "secretPhrase");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

        byte[] publicKey = Account.getPublicKey(ParameterParser.getAccountId(req, true));
        if (publicKey == null) {
            return INCORRECT_ACCOUNT;
        }
        String secretPhrase = ParameterParser.getSecretPhrase(req, true);
        byte[] data = Convert.parseHexString(Convert.nullToEmpty(req.getParameter("data")));
        byte[] nonce = Convert.parseHexString(Convert.nullToEmpty(req.getParameter("nonce")));
        EncryptedData encryptedData = new EncryptedData(data, nonce);
        boolean isText = !"false".equalsIgnoreCase(req.getParameter("decryptedMessageIsText"));
        boolean uncompress = !"false".equalsIgnoreCase(req.getParameter("uncompressDecryptedMessage"));
        try {
            byte[] decrypted = Account.decryptFrom(publicKey, encryptedData, secretPhrase, uncompress);
            JSONObject response = new JSONObject();
            response.put("decryptedMessage", isText ? Convert.toString(decrypted) : Convert.toHexString(decrypted));
            return response;
        } catch (RuntimeException e) {
            Logger.logDebugMessage(e.toString());
            return DECRYPTION_FAILED;
        }
    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

}
