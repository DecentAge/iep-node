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
import xin.Account;
import xin.XinException;
import xin.db.DbIterator;
import xin.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class GetAccount extends APIServlet.APIRequestHandler {

    static final GetAccount instance = new GetAccount();

    private GetAccount() {
        super(new APITag[]{APITag.ACCOUNTS}, "account", "includeLessors", "includeAssets", "includeCurrencies", "includeEffectiveBalance", "includeCurrentHeight");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

        Account account = ParameterParser.getAccount(req);
        boolean includeLessors = "true".equalsIgnoreCase(req.getParameter("includeLessors"));
        boolean includeAssets = "true".equalsIgnoreCase(req.getParameter("includeAssets"));
        boolean includeCurrencies = "true".equalsIgnoreCase(req.getParameter("includeCurrencies"));
        boolean includeEffectiveBalance = "true".equalsIgnoreCase(req.getParameter("includeEffectiveBalance"));
        boolean includeCurrentHeight = "true".equalsIgnoreCase(req.getParameter("includeCurrentHeight"));

        JSONObject response = JSONData.accountBalance(account, includeEffectiveBalance);
        JSONData.putAccount(response, "account", account.getId());

        byte[] publicKey = Account.getPublicKey(account.getId());
        if (publicKey != null) {
            response.put("publicKey", Convert.toHexString(publicKey));
        }
        Account.AccountInfo accountInfo = account.getAccountInfo();
        if (accountInfo != null) {
            response.put("name", Convert.nullToEmpty(accountInfo.getName()));
            response.put("description", Convert.nullToEmpty(accountInfo.getDescription()));
        }
        Account.AccountLease accountLease = account.getAccountLease();

        if (accountLease != null) {

            JSONData.putAccount(response, "currentLessee", accountLease.getCurrentLesseeId());
            response.put("currentLeasingHeightFrom", accountLease.getCurrentLeasingHeightFrom());
            response.put("currentLeasingHeightTo", accountLease.getCurrentLeasingHeightTo());

            if (accountLease.getNextLesseeId() != 0) {
                JSONData.putAccount(response, "nextLessee", accountLease.getNextLesseeId());
                response.put("nextLeasingHeightFrom", accountLease.getNextLeasingHeightFrom());
                response.put("nextLeasingHeightTo", accountLease.getNextLeasingHeightTo());
            }
        }

        if (!account.getControls().isEmpty()) {
            JSONArray accountControlsJson = new JSONArray();
            account.getControls().forEach(accountControl -> accountControlsJson.add(accountControl.toString()));
            response.put("accountControls", accountControlsJson);
        }

        if (includeLessors) {
            try (DbIterator<Account> lessors = account.getLessors()) {

              JSONArray lessorInfo = new JSONArray();

                if (lessors.hasNext()) {

                    while (lessors.hasNext()) {
                        Account lessor = lessors.next();

                        lessorInfo.add(JSONData.lessor(lessor, includeEffectiveBalance ));
                    }

                }

                response.put("accountLeases", lessorInfo);

            }
        }

        if (includeAssets) {
            try (DbIterator<Account.AccountAsset> accountAssets = account.getAssets(0, -1)) {
                JSONArray assetBalances = new JSONArray();
                JSONArray unconfirmedAssetBalances = new JSONArray();
                while (accountAssets.hasNext()) {
                    Account.AccountAsset accountAsset = accountAssets.next();
                    JSONObject assetBalance = new JSONObject();
                    assetBalance.put("asset", Long.toUnsignedString(accountAsset.getAssetId()));
                    assetBalance.put("balanceQNT", String.valueOf(accountAsset.getQuantityQNT()));
                    assetBalances.add(assetBalance);
                    JSONObject unconfirmedAssetBalance = new JSONObject();
                    unconfirmedAssetBalance.put("asset", Long.toUnsignedString(accountAsset.getAssetId()));
                    unconfirmedAssetBalance.put("unconfirmedBalanceQNT", String.valueOf(accountAsset.getUnconfirmedQuantityQNT()));
                    unconfirmedAssetBalances.add(unconfirmedAssetBalance);
                }
                if (assetBalances.size() > 0) {
                    response.put("assetBalances", assetBalances);
                }
                if (unconfirmedAssetBalances.size() > 0) {
                    response.put("unconfirmedAssetBalances", unconfirmedAssetBalances);
                }
            }
        }

        if (includeCurrencies) {
            try (DbIterator<Account.AccountCurrency> accountCurrencies = account.getCurrencies(0, -1)) {
                JSONArray currencyJSON = new JSONArray();
                while (accountCurrencies.hasNext()) {
                    currencyJSON.add(JSONData.accountCurrency(accountCurrencies.next(), false, true));
                }
                if (currencyJSON.size() > 0) {
                    response.put("accountCurrencies", currencyJSON);
                }
            }
        }

        // adding height for lessor calculatiosn

        if (includeCurrentHeight) {
          Block lastBlock = Xin.getBlockchain().getLastBlock();
          response.put("height", lastBlock.getHeight() + 0);
        }

        return response;

    }

}
