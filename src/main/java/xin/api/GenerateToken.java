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

import xin.Token;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

import static xin.api.JSONResponses.INCORRECT_WEBSITE;
import static xin.api.JSONResponses.MISSING_WEBSITE;
import static xin.api.JSONResponses.INCORRECT_HOST;


public final class GenerateToken extends APIServlet.APIRequestHandler {

    static final GenerateToken instance = new GenerateToken();

    private GenerateToken() {
        super(new APITag[]{APITag.TOKENS}, "website", "secretPhrase");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws ParameterException {
    	if (!API.isAllowedLocalhost(req.getRemoteHost())) {
    		return INCORRECT_HOST;
        }
        String secretPhrase = ParameterParser.getSecretPhrase(req, true);
        String website = Convert.emptyToNull(req.getParameter("website"));
        if (website == null) {
            return MISSING_WEBSITE;
        }

        try {

            String tokenString = Token.generateToken(secretPhrase, website.trim());

            JSONObject response = JSONData.token(Token.parseToken(tokenString, website));
            response.put("token", tokenString);

            return response;

        } catch (RuntimeException e) {
            return INCORRECT_WEBSITE;
        }

    }

    @Override
    protected boolean requirePost() {
        return true;
    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

    @Override
    protected boolean requireBlockchain() {
        return false;
    }

}
