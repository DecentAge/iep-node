import { Injectable } from '@angular/core';
import { HttpProviderService } from '../../services/http-provider.service';
import {NodeService} from '../../services/node.service';
import {OptionService} from '../../services/option.service';
import {AppConstants} from '../../config/constants';
import {TransactionService} from '../../services/transaction.service';
import {SessionStorageService} from '../../services/session-storage.service';

@Injectable()
export class AssetsService {

  GET_ASSET_ORDERS = {
      'BID_ORDER': 'getBidOrders',
      'ASK_ORDER': 'getAskOrders'
  };
  constructor(public http: HttpProviderService,
              public nodeService: NodeService,
              public optionsService: OptionService,
              public transactionService: TransactionService,
              public sessionStorageService: SessionStorageService) { }

    getAssets(firstIndex, lastIndex, order, orderColumn) {
        let params = {
            'requestType': 'getAllAssets',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCounts': true,
            'order': order,
            'orderColumn': orderColumn
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAsset(asset, includeCounts?) {
        let params = {
            'requestType': 'getAsset',
            'asset': asset,
            'includeCounts': includeCounts
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAccountAssets(account) {
        let params = {
            'requestType': 'getAccountAssets',
            'account': account,
            'includeAssetInfo': true,
            'includeCounts': true,
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAccountSingleAsset(account, asset) {
        let params = {
            'requestType': 'getAccountAssets',
            'account': account,
            'asset': asset,
            'includeAssetInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getMultipleAssetLastTrades(assets) {
        let params = {
            'requestType': 'getLastTrades',
            'assets': assets,
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAccountCurrentBidOrders(accountRS, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAccountCurrentBidOrders',
            'account': accountRS,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAccountCurrentAskOrders(accountRS, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAccountCurrentAskOrders',
            'account': accountRS,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    issueAsset(name, description, quantity, decimals, publicKey, fee) {
        let params = {
            'requestType': 'issueAsset',
            'publicKey': publicKey,
            'quantityQNT': parseInt(quantity),
            'name': name,
            'description': description,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'decimals': parseInt(decimals),
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    deleteAssetShares(asset, quantity, fee, publicKey) {
        let params = {
            'requestType': 'deleteAssetShares',
            'publicKey': publicKey,
            'quantityQNT': parseInt(quantity),
            'asset': asset,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    deleteAssetFull(asset, fee, publicKey) {
        let params = {
            'requestType': 'deleteAsset',
            'publicKey': publicKey,
            // 'quantityQNT': parseInt(quantity),
            'asset': asset,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    serachAssets(query) {
        let params = {
            'requestType': 'searchAssets',
            'query': query
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    cancelOrder(order, fee, publicKey, type) {
        let requestType;
        if (type === 'bid') {
            requestType = 'cancelBidOrder';
        } else if (type === 'ask') {
            requestType = 'cancelAskOrder';
        }
        let params = {
            'requestType': requestType,
            'publicKey': publicKey,
            'order': order,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    transferAsset(publicKey, recipientRS, asset, quantity, fee) {
        let params = {
            'requestType': 'transferAsset',
            'recipient': recipientRS,
            'asset': asset,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'quantityQNT': parseInt(quantity),
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    dividendPayment(publicKey, asset, height, amoountPerQNT, fee) {
        let params: any = {
            'requestType': 'dividendPayment',
            'asset': asset,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'amountTQTPerQNT': parseInt(amoountPerQNT, 10),
            'height': parseInt(height, 10),
        };
        let hasPhasing = this.sessionStorageService.getFromSession(
            AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);
        if (hasPhasing) {
            params.phasingFinishHeight = parseInt(height, 10) + 1000;
        }
        return this.transactionService.createTransaction(params, '', '');
    };

    placeOrder(publicKey, price, asset, quantity, fee, requestType) {
        let request;
        if (requestType === 'bid') {
            request = 'placeBidOrder';
        } else {
            request = 'placeAskOrder';
        }
        let params = {
            'requestType': request,
            'priceTQT': parseInt(price, 10),
            'asset': asset,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'quantityQNT': parseInt(quantity, 10),
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    getAssetLastTrades(asset, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getTrades',
            'asset': asset,
            'includeAssetInfo': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAssetOrders(asset, orderType, firstIndex, lastIndex) {
        let params = {
            'requestType': orderType,
            'asset': asset,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAllTrades(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAllTrades',
            'includeAssetInfo': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAllOpenAskOrders(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAllOpenAskOrders',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAllOpenBidOrders(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAllOpenBidOrders',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAllLastTransfers(accountRs, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAssetTransfers',
            'account': accountRs,
            'includeAssetInfo': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getMyTrades(account, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getTrades',
            'account': account,
            'includeAssetInfo': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getExpectedAskOrders(asset) {
        let params = {
            'requestType': 'getExpectedAskOrders',
            'asset': asset,
            'sortByPrice': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getExpectedBidOrders(asset) {
        let params = {
            'requestType': 'getExpectedBidOrders',
            'asset': asset,
            'sortByPrice': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getExpectedAssetDeletes(asset, account) {
        let params = {
            'requestType': 'getExpectedAssetDeletes',
            'includeAssetInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getExpectedAssetTransfers(asset, account) {
        let params = {
            'requestType': 'getExpectedAssetTransfers',
            'includeAssetInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getExpectedOrderCancellations() {

        let params = {
            'requestType': 'getExpectedOrderCancellations'
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getBidOrderTrades(orderid, firstIndex, lastIndex) {

        let params = {
            'requestType': 'getOrderTrades',
            'bidOrder': orderid,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeAssetInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getAskOrderTrades(orderid, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getOrderTrades',
            'askOrder': orderid,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeAssetInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

    getDividendsHistory(asset, firstIndex, lastIndex, timestamp) {
        let params = {
            'requestType': 'getAssetDividends',
            'asset': asset,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'timestamp': timestamp
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.assetsConfig.assetsEndPoint, params );
    };

}
