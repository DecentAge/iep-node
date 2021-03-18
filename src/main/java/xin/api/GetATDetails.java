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

import org.json.simple.JSONStreamAware;
import xin.XinException;

import javax.servlet.http.HttpServletRequest;

public class GetATDetails extends APIServlet.APIRequestHandler {
	static final GetATDetails instance = new GetATDetails();

    private GetATDetails() {
        super(new APITag[] {APITag.AT}, "at");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
        return JSONData.at(ParameterParser.getAT(req));
    }
}
