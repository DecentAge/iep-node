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

import org.json.simple.JSONStreamAware;
import xin.Account;
import xin.Asset;
import xin.Attachment;
import xin.XinException;

import javax.servlet.http.HttpServletRequest;

import static xin.api.JSONResponses.NOT_ENOUGH_ASSETS;

public final class DeleteAsset extends CreateTransaction {

    static final DeleteAsset instance = new DeleteAsset();

    private DeleteAsset() {
        super(new APITag[]{APITag.AE, APITag.CREATE_TRANSACTION}, "asset");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

        Asset asset = ParameterParser.getAsset(req);
        Account account = ParameterParser.getSenderAccount(req);

        Attachment attachment = new Attachment.ColoredCoinsAssetCompleteDelete(asset.getId());
        try {
            return createTransaction(req, account, attachment);
        } catch (XinException.InsufficientBalanceException e) {
            return NOT_ENOUGH_ASSETS;
        }
    }

}
