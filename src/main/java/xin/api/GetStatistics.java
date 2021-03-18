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
import xin.peer.Peers;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class GetStatistics extends APIServlet.APIRequestHandler {

    static final GetStatistics instance = new GetStatistics();

    private GetStatistics() {
        super(new APITag[]{APITag.INFO}, "", "");
    }

    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {

        JSONObject response = new JSONObject();

        Block lastBlock = Xin.getBlockchain().getLastBlock();

        response.put("numberOfBlocks", lastBlock.getHeight() + 1);
        response.put("numberOfTransactions", Xin.getBlockchain().getTransactionCount());
        response.put("numberOfAccounts", Account.getCount());
        response.put("numberOfAssets", Asset.getCount());

        int askCount = Order.Ask.getCount();
        int bidCount = Order.Bid.getCount();

        response.put("numberOfAsks", askCount);
        response.put("numberOfBids", askCount);

        response.put("numberOfOrders", askCount + bidCount);
        response.put("numberOfAskOrders", askCount);
        response.put("numberOfBidOrders", bidCount);

        response.put("numberOfTrades", Trade.getCount());
        response.put("numberOfTransfers", AssetTransfer.getCount());
        response.put("numberOfCurrencies", Currency.getCount());
        response.put("numberOfOffers", CurrencyBuyOffer.getCount());
        response.put("numberOfExchangeRequests", ExchangeRequest.getCount());
        response.put("numberOfExchanges", Exchange.getCount());
        response.put("numberOfCurrencyTransfers", CurrencyTransfer.getCount());
        response.put("numberOfAliases", Alias.getCount());
        response.put("numberOfPolls", Poll.getCount());
        response.put("numberOfVotes", Vote.getCount());
        response.put("numberOfAccountLeases", Account.getAccountLeaseCount());
        response.put("numberOfActiveAccountLeases", Account.getActiveLeaseCount());

        response.put("numberOfShufflings", Shuffling.getCount());
        response.put("numberOfActiveShufflings", Shuffling.getActiveCount());

        response.put("numberOfPhasingOnlyAccounts", AccountRestrictions.PhasingOnly.getCount());

        response.put("numberOfPeers", Peers.getAllPeers().size());
        response.put("numberOfActivePeers", Peers.getActivePeers().size());

        return response;

    }

}
