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

import static xin.api.JSONResponses.ERROR_DISABLED;
import static xin.api.JSONResponses.ERROR_INCORRECT_REQUEST;
import static xin.api.JSONResponses.ERROR_NOT_ALLOWED;
import static xin.api.JSONResponses.POST_REQUIRED;
import static xin.api.JSONResponses.REQUIRED_BLOCK_NOT_FOUND;
import static xin.api.JSONResponses.REQUIRED_LAST_BLOCK_NOT_FOUND;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import xin.Db;
import xin.Xin;
import xin.XinException;
import xin.util.JSON;
import xin.util.Logger;

public final class APIServlet extends HttpServlet {

    public abstract static class APIRequestHandler {

        private final List<String> parameters;
        private final String fileParameter;
        private final Set<APITag> apiTags;

        protected APIRequestHandler(APITag[] apiTags, String... parameters) {
            this(null, apiTags, parameters);
        }

        protected APIRequestHandler(String fileParameter, APITag[] apiTags, String... origParameters) {
            List<String> parameters = new ArrayList<>();
            Collections.addAll(parameters, origParameters);
            if ((requirePassword() || parameters.contains("lastIndex")) && !API.disableAdminPassword) {
                parameters.add("adminPassword");
            }
            if (allowRequiredBlockParameters()) {
                parameters.add("requireBlock");
                parameters.add("requireLastBlock");
            }
            this.parameters = Collections.unmodifiableList(parameters);
            this.apiTags = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(apiTags)));
            this.fileParameter = fileParameter;
        }

        public final List<String> getParameters() {
            return parameters;
        }

        public final Set<APITag> getAPITags() {
            return apiTags;
        }

        public final String getFileParameter() {
            return fileParameter;
        }

        protected abstract JSONStreamAware processRequest(HttpServletRequest request) throws XinException;

        protected JSONStreamAware processRequest(HttpServletRequest request, HttpServletResponse response) throws XinException {
            return processRequest(request);
        }

        protected boolean requirePost() {
            return false;
        }

        protected boolean startDbTransaction() {
            return false;
        }

        protected boolean requirePassword() {
            return false;
        }

        protected boolean allowRequiredBlockParameters() {
            return true;
        }

        protected boolean requireBlockchain() {
            return true;
        }

    }

    private static final boolean enforcePost = Xin.getBooleanProperty("xin.apiServerEnforcePOST");
    static final Map<String, APIRequestHandler> apiRequestHandlers;
    static final Map<String, APIRequestHandler> disabledRequestHandlers;

    static {

        Map<String, APIRequestHandler> map = new HashMap<>();
        Map<String, APIRequestHandler> disabledMap = new HashMap<>();

        map.put("sendMoney", SendMoney.instance);
        map.put("getAccount", GetAccount.instance);
        map.put("getBlockchainTransactions", GetBlockchainTransactions.instance);
        map.put("getUnconfirmedTransactions", GetUnconfirmedTransactions.instance);
        map.put("deleteAccountProperty", DeleteAccountProperty.instance);
        map.put("getAccountBlockCount", GetAccountBlockCount.instance);
        map.put("getAccountBlockIds", GetAccountBlockIds.instance);
        map.put("getAccountBlocks", GetAccountBlocks.instance);
        map.put("getAccountId", GetAccountId.instance);
        map.put("getAccountLedger", GetAccountLedger.instance);
        map.put("getAccountPublicKey", GetAccountPublicKey.instance);
        map.put("getAccountLessors", GetAccountLessors.instance);
        map.put("getAccountAssets", GetAccountAssets.instance);
        map.put("getAccountCurrencies", GetAccountCurrencies.instance);
        map.put("getAccountCurrencyCount", GetAccountCurrencyCount.instance);
        map.put("getAccountAssetCount", GetAccountAssetCount.instance);
        map.put("getAccountProperties", GetAccountProperties.instance);
        map.put("getBalance", GetBalance.instance);
        map.put("getGuaranteedBalance", GetGuaranteedBalance.instance);
        map.put("getUnconfirmedTransactionIds", GetUnconfirmedTransactionIds.instance);
        map.put("searchAccounts", SearchAccounts.instance);
        map.put("setAccountInfo", SetAccountInfo.instance);
        map.put("setAccountProperty", SetAccountProperty.instance);
        map.put("getAccountCurrentAskOrderIds", GetAccountCurrentAskOrderIds.instance);
        map.put("getAccountCurrentBidOrderIds", GetAccountCurrentBidOrderIds.instance);
        map.put("getAccountCurrentAskOrders", GetAccountCurrentAskOrders.instance);
        map.put("getAccountCurrentBidOrders", GetAccountCurrentBidOrders.instance);
        map.put("getAccountExchangeRequests", GetAccountExchangeRequests.instance);
        map.put("startFundingMonitor", StartFundingMonitor.instance);
        map.put("stopFundingMonitor", StopFundingMonitor.instance);
        map.put("getFundingMonitor", GetFundingMonitor.instance);
        map.put("getAccountLedgerEntry", GetAccountLedgerEntry.instance);
        map.put("getAccountBalances", GetAccountBalances.instance);
        map.put("getDistributions", GetDistributions.instance);
        map.put("getActivationHeights", GetActivationHeights.instance);

        map.put("getAllPhasingOnlyControls", GetAllPhasingOnlyControls.instance);
        map.put("setPhasingOnlyControl", SetPhasingOnlyControl.instance);
        map.put("getPhasingOnlyControl", GetPhasingOnlyControl.instance);

        map.put("sellAlias", SellAlias.instance);
        map.put("buyAlias", BuyAlias.instance);
        map.put("getAlias", GetAlias.instance);
        map.put("getAliasCount", GetAliasCount.instance);
        map.put("getAliases", GetAliases.instance);
        map.put("getAliasesLike", GetAliasesLike.instance);
        map.put("deleteAlias", DeleteAlias.instance);
        map.put("setAlias", SetAlias.instance);

        map.put("decryptFrom", DecryptFrom.instance);
        map.put("encryptTo", EncryptTo.instance);
        map.put("getSharedKey", GetSharedKey.instance);
        map.put("readMessage", ReadMessage.instance);
        map.put("sendMessage", SendMessage.instance);

        map.put("verifyPrunableMessage", VerifyPrunableMessage.instance);
        map.put("getAllPrunableMessages", GetAllPrunableMessages.instance);
        map.put("getPrunableMessage", GetPrunableMessage.instance);
        map.put("getPrunableMessages", GetPrunableMessages.instance);
        map.put("downloadPrunableMessage", DownloadPrunableMessage.instance);

        map.put("getAllAssets", GetAllAssets.instance);
        map.put("getAsset", GetAsset.instance);
        map.put("cancelBidOrder", CancelBidOrder.instance);
        map.put("cancelAskOrder", CancelAskOrder.instance);
        map.put("deleteAssetShares", DeleteAssetShares.instance);
        map.put("deleteAsset", DeleteAsset.instance);
        map.put("dividendPayment", DividendPayment.instance);
        map.put("getAllOpenAskOrders", GetAllOpenAskOrders.instance);
        map.put("getAllOpenBidOrders", GetAllOpenBidOrders.instance);
        map.put("getAllTrades", GetAllTrades.instance);
        map.put("getAssets", GetAssets.instance);
        map.put("getAssetIds", GetAssetIds.instance);
        map.put("getAssetsByIssuer", GetAssetsByIssuer.instance);
        map.put("getAssetAccounts", GetAssetAccounts.instance);
        map.put("getAssetAccountCount", GetAssetAccountCount.instance);
        map.put("getAssetTransfers", GetAssetTransfers.instance);
        map.put("getAssetDeletes", GetAssetDeletes.instance);
        map.put("getExpectedAssetTransfers", GetExpectedAssetTransfers.instance);
        map.put("getExpectedAssetDeletes", GetExpectedAssetDeletes.instance);
        map.put("getAskOrder", GetAskOrder.instance);
        map.put("getAskOrderIds", GetAskOrderIds.instance);
        map.put("getAskOrders", GetAskOrders.instance);
        map.put("getBidOrder", GetBidOrder.instance);
        map.put("getBidOrderIds", GetBidOrderIds.instance);
        map.put("getBidOrders", GetBidOrders.instance);
        map.put("getExpectedAskOrders", GetExpectedAskOrders.instance);
        map.put("getExpectedBidOrders", GetExpectedBidOrders.instance);
        map.put("getExpectedOrderCancellations", GetExpectedOrderCancellations.instance);
        map.put("getLastTrades", GetLastTrades.instance);
        map.put("getOrderTrades", GetOrderTrades.instance);
        map.put("getTrades", GetTrades.instance);
        map.put("issueAsset", IssueAsset.instance);
        map.put("placeAskOrder", PlaceAskOrder.instance);
        map.put("placeBidOrder", PlaceBidOrder.instance);
        map.put("searchAssets", SearchAssets.instance);
        map.put("transferAsset", TransferAsset.instance);
        map.put("getAssetDividends", GetAssetDividends.instance);

        map.put("getBlock", GetBlock.instance);
        map.put("getBlocks", GetBlocks.instance);
        map.put("getBlockId", GetBlockId.instance);
        map.put("getECBlock", GetECBlock.instance);

        map.put("startForging", StartForging.instance);
        map.put("stopForging", StopForging.instance);
        map.put("getForging", GetForging.instance);
        map.put("leaseBalance", LeaseBalance.instance);

        map.put("decodeHallmark", DecodeHallmark.instance);
        map.put("markHost", MarkHost.instance);

        map.put("canDeleteCurrency", CanDeleteCurrency.instance);
        map.put("currencyBuy", CurrencyBuy.instance);
        map.put("currencySell", CurrencySell.instance);
        map.put("currencyReserveIncrease", CurrencyReserveIncrease.instance);
        map.put("currencyReserveClaim", CurrencyReserveClaim.instance);
        map.put("deleteCurrency", DeleteCurrency.instance);
        map.put("getExpectedExchangeRequests", GetExpectedExchangeRequests.instance);
        map.put("getAllCurrencies", GetAllCurrencies.instance);
        map.put("getAllExchanges", GetAllExchanges.instance);
        map.put("getAvailableToBuy", GetAvailableToBuy.instance);
        map.put("getAvailableToSell", GetAvailableToSell.instance);
        map.put("getBuyOffers", GetBuyOffers.instance);
        map.put("getSellOffers", GetSellOffers.instance);
        map.put("getExpectedBuyOffers", GetExpectedBuyOffers.instance);
        map.put("getExpectedSellOffers", GetExpectedSellOffers.instance);
        map.put("getCurrency", GetCurrency.instance);
        map.put("getCurrencies", GetCurrencies.instance);
        map.put("getCurrencyFounders", GetCurrencyFounders.instance);
        map.put("getCurrencyIds", GetCurrencyIds.instance);
        map.put("getCurrenciesByIssuer", GetCurrenciesByIssuer.instance);
        map.put("getCurrencyAccounts", GetCurrencyAccounts.instance);
        map.put("getCurrencyAccountCount", GetCurrencyAccountCount.instance);
        map.put("getCurrencyTransfers", GetCurrencyTransfers.instance);
        map.put("getExpectedCurrencyTransfers", GetExpectedCurrencyTransfers.instance);
        map.put("getExchanges", GetExchanges.instance);
        map.put("getExchangesByExchangeRequest", GetExchangesByExchangeRequest.instance);
        map.put("getExchangesByOffer", GetExchangesByOffer.instance);
        map.put("getLastExchanges", GetLastExchanges.instance);
        map.put("getOffer", GetOffer.instance);
        map.put("issueCurrency", IssueCurrency.instance);
        map.put("publishExchangeOffer", PublishExchangeOffer.instance);
        map.put("searchCurrencies", SearchCurrencies.instance);
        map.put("transferCurrency", TransferCurrency.instance);
        // map.put("currencyMint", CurrencyMint.instance);
        // map.put("getMintingTarget", GetMintingTarget.instance);

        map.put("addPeer", AddPeer.instance);
        map.put("blacklistPeer", BlacklistPeer.instance);
        map.put("getInboundPeers", GetInboundPeers.instance);
        map.put("getMyInfo", GetMyInfo.instance);
        map.put("getPeer", GetPeer.instance);
        map.put("getPeers", GetPeers.instance);
        map.put("dumpPeers", DumpPeers.instance);

        map.put("approveTransaction", ApproveTransaction.instance);
        map.put("getAccountPhasedTransactionCount", GetAccountPhasedTransactionCount.instance);
        map.put("getAccountPhasedTransactions", GetAccountPhasedTransactions.instance);
        map.put("getAssetPhasedTransactions", GetAssetPhasedTransactions.instance);
        map.put("getCurrencyPhasedTransactions", GetCurrencyPhasedTransactions.instance);
        map.put("getVoterPhasedTransactions", GetVoterPhasedTransactions.instance);
        map.put("getLinkedPhasedTransactions", GetLinkedPhasedTransactions.instance);
        map.put("getPhasingPoll", GetPhasingPoll.instance);
        map.put("getPhasingPollVote", GetPhasingPollVote.instance);
        map.put("getPhasingPolls", GetPhasingPolls.instance);
        map.put("getPhasingPollVotes", GetPhasingPollVotes.instance);

        map.put("eventRegister", EventRegister.instance);
        map.put("eventWait", EventWait.instance);
        map.put("getBlockchainStatus", GetBlockchainStatus.instance);
        map.put("getState", GetState.instance);
        map.put("getTime", GetTime.instance);
         map.put("getConstants", GetConstants.instance);
        // map.put("getPlugins", GetPlugins.instance);

        map.put("getAccountShufflings", GetAccountShufflings.instance);
        map.put("getAllShufflings", GetAllShufflings.instance);
        map.put("getAssignedShufflings", GetAssignedShufflings.instance);
        map.put("getHoldingShufflings", GetHoldingShufflings.instance);
        map.put("shufflingCreate", ShufflingCreate.instance);
        map.put("shufflingRegister", ShufflingRegister.instance);
        map.put("shufflingProcess", ShufflingProcess.instance);
        map.put("shufflingVerify", ShufflingVerify.instance);
        map.put("shufflingCancel", ShufflingCancel.instance);
        map.put("startShuffler", StartShuffler.instance);
        map.put("stopShuffler", StopShuffler.instance);
        map.put("getShufflers", GetShufflers.instance);
        map.put("getShuffling", GetShuffling.instance);
        map.put("getShufflingParticipants", GetShufflingParticipants.instance);

        map.put("decodeToken", DecodeToken.instance);
        map.put("decodeFileToken", DecodeFileToken.instance);
        map.put("generateToken", GenerateToken.instance);
        map.put("generateFileToken", GenerateFileToken.instance);

        map.put("getTransaction", GetTransaction.instance);
        map.put("broadcastTransaction", BroadcastTransaction.instance);
        map.put("calculateFullHash", CalculateFullHash.instance);
        map.put("getExpectedTransactions", GetExpectedTransactions.instance);
        map.put("getReferencingTransactions", GetReferencingTransactions.instance);
        map.put("getTransactionBytes", GetTransactionBytes.instance);
        map.put("parseTransaction", ParseTransaction.instance);
        map.put("retrievePrunedTransaction", RetrievePrunedTransaction.instance);
        map.put("signTransaction", SignTransaction.instance);

        map.put("castVote", CastVote.instance);
        map.put("createPoll", CreatePoll.instance);
        map.put("getPoll", GetPoll.instance);
        map.put("getAllPolls", GetAllPolls.instance);
        map.put("getPollResult", GetPollResult.instance);
        map.put("getPollVotes", GetPollVotes.instance);
        map.put("getPollVote", GetPollVote.instance);
        map.put("getPolls", GetPolls.instance);
        map.put("searchPolls", SearchPolls.instance);

        map.put("decodeQRCode", DecodeQRCode.instance);
        map.put("encodeQRCode", EncodeQRCode.instance);
        map.put("fullHashToId", FullHashToId.instance);
        map.put("longConvert", LongConvert.instance);
        map.put("hexConvert", HexConvert.instance);
        map.put("rsConvert", RSConvert.instance);
        map.put("hash", Hash.instance);
        // map.put("detectMimeType", DetectMimeType.instance);

        map.put("getAllBroadcastedTransactions", GetAllBroadcastedTransactions.instance);
        map.put("fullReset", FullReset.instance);
        map.put("getLog", GetLog.instance);
        map.put("getStackTraces", GetStackTraces.instance);
        map.put("rebroadcastUnconfirmedTransactions", RebroadcastUnconfirmedTransactions.instance);
        map.put("requeueUnconfirmedTransactions", RequeueUnconfirmedTransactions.instance);
        map.put("setLogging", SetLogging.instance);
        map.put("shutdown", Shutdown.instance);
        map.put("trimDerivedTables", TrimDerivedTables.instance);
        map.put("clearUnconfirmedTransactions", ClearUnconfirmedTransactions.instance);
        map.put("luceneReindex", LuceneReindex.instance);
        map.put("scan", Scan.instance);
        //map.put("getAllWaitingTransactions", GetAllWaitingTransactions.instance);
        //map.put("retrievePrunedData", RetrievePrunedData.instance);
        //map.put("popOff", PopOff.instance);

        map.put("getPeerState", GetPeerState.instance);
        map.put("getTransactions", GetTransactions.instance);
        map.put("sendToken", SendToken.instance);
        map.put("getStatistics", GetStatistics.instance);
        map.put("getAccounts", GetAccounts.instance);
        map.put("getLightClientPing", GetLightClientPing.instance);
        map.put("getAliasesPublicOffers", GetAliasesPublicOffers.instance);
        map.put("getAliasesPrivateOffers", GetAliasesPrivateOffers.instance);
        map.put("getAliasesOpenOffers", GetAliasesOpenOffers.instance);

        map.put("storageMongoDb", StorageMongoDB.instance);
        map.put("storageRethinkDb", StorageRethinkDBPing.instance);
        map.put("storageMySqlDb", StorageMySqlDBPing.instance);

        map.put("gatewayIpfs", GatewayIpfs.instance);
        map.put("gatewayTenderMint", GatewayTendermint.instance);

        map.put("proxyBitcoin", ProxyBitcoin.instance);
        map.put("proxyEthereum", ProxyEthereum.instance);
        map.put("proxyLiteCoin", ProxyLiteCoin.instance);
        map.put("proxyRipple", ProxyRipple.instance);
        map.put("proxyPoloniex", ProxyPoloniex.instance);

        map.put("getServices", GetNodeServices.instance);

        map.put("unsignedJSONtoBytes", unsignedJSONtoBytes.instance);

        map.put("sendMoneyEscrow", SendMoneyEscrow.instance);
        map.put("escrowSign", EscrowSign.instance);
        map.put("getEscrowTransaction", GetEscrowTransaction.instance);
        map.put("getAccountEscrowTransactions", GetAccountEscrowTransactions.instance);

        map.put("sendMoneySubscription", SendMoneySubscription.instance);
        map.put("subscriptionCancel", SubscriptionCancel.instance);
        map.put("getSubscription", GetSubscription.instance);
        map.put("getAccountSubscriptions", GetAccountSubscriptions.instance);
        map.put("getSubscriptionsToAccount", GetSubscriptionsToAccount.instance);

        map.put("createATProgram", CreateATProgram.instance);
        map.put("getAT", GetAT.instance);
        map.put("getATDetails", GetATDetails.instance);
        map.put("getATIds", GetATIds.instance);
        map.put("getATLong", GetATLong.instance);
        map.put("getAccountATs", GetAccountATs.instance);
        map.put("getAllATs", GetAllATs.instance);

        map.put("getAllCrowdfundings", GetAllCrowdfundings.instance);


        API.disabledAPIs.forEach(api -> {
            APIRequestHandler handler = map.remove(api);
            if (handler == null) {
                throw new RuntimeException("Invalid API in disabledAPIs: " + api);
            }
            disabledMap.put(api, handler);
        });
        API.disabledAPITags.forEach(apiTag -> {
            Iterator<Map.Entry<String, APIRequestHandler>> iterator = map.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, APIRequestHandler> entry = iterator.next();
                if (entry.getValue().getAPITags().contains(apiTag)) {
                    disabledMap.put(entry.getKey(), entry.getValue());
                    iterator.remove();
                }
            }
        });
        if (!API.disabledAPIs.isEmpty()) {
            Logger.logInfoMessage("Disabled APIs: " + API.disabledAPIs);
        }
        if (!API.disabledAPITags.isEmpty()) {
            Logger.logInfoMessage("Disabled APITags: " + API.disabledAPITags);
        }

        apiRequestHandlers = Collections.unmodifiableMap(map);
        disabledRequestHandlers = disabledMap.isEmpty() ? Collections.emptyMap() : Collections.unmodifiableMap(disabledMap);
    }

    public static APIRequestHandler getAPIRequestHandler(String requestType) {
        return apiRequestHandlers.get(requestType);
    }

    static void initClass() {
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        process(req, resp);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        process(req, resp);
    }
    
    private void process(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Set response values now in case we create an asynchronous context
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
        resp.setHeader("Pragma", "no-cache");
        resp.setDateHeader("Expires", 0);
        resp.setContentType("text/plain; charset=UTF-8");

        JSONStreamAware response = JSON.emptyJSON;

        try {

            long startTime = System.currentTimeMillis();
           
            if (!API.isAllowed(req.getRemoteHost())) {
                response = ERROR_NOT_ALLOWED;
                return;
            }

            String requestType = req.getParameter("requestType");
            if (requestType == null) {
                response = ERROR_INCORRECT_REQUEST;
                return;
            }

            APIRequestHandler apiRequestHandler = apiRequestHandlers.get(requestType);
            if (apiRequestHandler == null) {
                if (disabledRequestHandlers.containsKey(requestType)) {
                    response = ERROR_DISABLED;
                } else {
                    response = ERROR_INCORRECT_REQUEST;
                }
                return;
            }

            if (enforcePost && apiRequestHandler.requirePost() && !"POST".equals(req.getMethod())) {
                response = POST_REQUIRED;
                return;
            }

            try {
                if (apiRequestHandler.requirePassword()) {
                    API.verifyPassword(req);
                }
                final long requireBlockId = apiRequestHandler.allowRequiredBlockParameters() ?
                        ParameterParser.getUnsignedLong(req, "requireBlock", false) : 0;
                final long requireLastBlockId = apiRequestHandler.allowRequiredBlockParameters() ?
                        ParameterParser.getUnsignedLong(req, "requireLastBlock", false) : 0;
                if (requireBlockId != 0 || requireLastBlockId != 0) {
                    Xin.getBlockchain().readLock();
                }
                try {
                    try {
                        if (apiRequestHandler.startDbTransaction()) {
                            Db.db.beginTransaction();
                        }
                        if (requireBlockId != 0 && !Xin.getBlockchain().hasBlock(requireBlockId)) {
                            response = REQUIRED_BLOCK_NOT_FOUND;
                            return;
                        }
                        if (requireLastBlockId != 0 && requireLastBlockId != Xin.getBlockchain().getLastBlock().getId()) {
                            response = REQUIRED_LAST_BLOCK_NOT_FOUND;
                            return;
                        }
                        response = apiRequestHandler.processRequest(req, resp);
                        if (requireLastBlockId == 0 && requireBlockId != 0 && response instanceof JSONObject) {
                            ((JSONObject) response).put("lastBlock", Xin.getBlockchain().getLastBlock().getStringId());
                        }
                    } finally {
                        if (apiRequestHandler.startDbTransaction()) {
                            Db.db.endTransaction();
                        }
                    }
                } finally {
                    if (requireBlockId != 0 || requireLastBlockId != 0) {
                        Xin.getBlockchain().readUnlock();
                    }
                }
            } catch (ParameterException e) {
                response = e.getErrorResponse();
            } catch (XinException | RuntimeException e) {
                Logger.logDebugMessage("Error processing API request", e);
                JSONObject json = new JSONObject();
                JSONData.putException(json, e);
                response = JSON.prepare(json);
            } catch (ExceptionInInitializerError err) {
                Logger.logErrorMessage("Initialization Error", err.getCause());
                response = ERROR_INCORRECT_REQUEST;
            }
            if (response != null && (response instanceof JSONObject)) {
                ((JSONObject) response).put("requestProcessingTime", System.currentTimeMillis() - startTime);
            }
        } catch (Exception e) {
            Logger.logErrorMessage("Error processing request", e);
            response = ERROR_INCORRECT_REQUEST;
        } finally {
            // The response will be null if we created an asynchronous context
            if (response != null) {
                try (Writer writer = resp.getWriter()) {
                    JSON.writeJSONString(response, writer);
                }
            }
        }

    }

}
