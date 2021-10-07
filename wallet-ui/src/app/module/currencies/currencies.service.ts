import { Injectable } from '@angular/core';
import {OptionService} from '../../services/option.service';
import { HttpProviderService } from '../../services/http-provider.service';
import {TransactionService} from '../../services/transaction.service';
import {NodeService} from '../../services/node.service';
import {AppConstants} from '../../config/constants';

@Injectable()
export class CurrenciesService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public transactionService: TransactionService) { }

    getCurrencies(firstIndex, lastIndex): any {

        let params = {
            'requestType': 'getAllCurrencies',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCounts': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getCurrency(currencyCode) {
        let params = {
            'requestType': 'getCurrency',
            'code': currencyCode,
            'includeCounts': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getCurrencyById(currencyId):any {

        let params = {
            'requestType': 'getCurrency',
            'currency': currencyId,
            'includeCounts': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getAccountCurrencies(account):any {
        let params = {
            'requestType': 'getAccountCurrencies',
            'account': account,
            'includeCurrencyInfo': true,
            'includeCounts': true,
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getSingleAccountCurrency(account, currency):any {
        let params = {
            'requestType': 'getAccountCurrencies',
            'account': account,
            'currency': currency,
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getMultipleCurrenctLastExchanges(currency) {
        let params = {
            'requestType': 'getLastExchanges',
            'currencies': currency,
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    issueCurrency =
        function (publicKey, name, code, description, type, initialSupply, maxSupply, decimals, fee,
                  minCurrencyAmount, activHeight, reserveSupply) {
            let params = {
                'publicKey': publicKey,
                'requestType': 'issueCurrency',
                'name': name,
                'code': code,
                'description': description,
                'type': type,
                'initialSupply': parseInt(initialSupply, 10),
                'maxSupply': parseInt(maxSupply, 10),
                'decimals': parseInt(decimals, 10),
                'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
                'broadcast': 'false',
                'deadline': this.optionsService.getOption('DEADLINE', ''),
                'minReservePerUnitTQT': minCurrencyAmount,
                'reserveSupply': reserveSupply,
                'issuanceHeight': parseInt(activHeight, 10)

            };
            return this.transactionService.createTransaction(params, '', '');
        };

    canDeleteCurrency(currency, accountRS): any {
        let params = {
            'requestType': 'canDeleteCurrency',
            'account': accountRS,
            'currency': currency,
        };

        return this.http.post(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    deleteCurrency(currency, fee, publicKey) {
        let params = {
            'requestType': 'deleteCurrency',
            'publicKey': publicKey,
            'currency': currency,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    searchCurrencies(query) {

        let params = {
            'requestType': 'searchCurrencies',
            'query': query,
            'includeCounts': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    transferCurrency(publicKey, recipientRS, currency, units, fee) {
        let params = {
            'requestType': 'transferCurrency',
            'recipient': recipientRS,
            'currency': currency,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'units': parseInt(units, 10),
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    getBlockChainStatus(): any {
        let params = {
            'requestType': 'getBlockchainStatus',
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    publishExchangeOffer(publicKey, currency, limits, supply, expirationHeight, fee) {
        let params = {
            'requestType': 'publishExchangeOffer',
            'currency': currency,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
            'buyRateTQT': parseInt(limits.buyRate, 10),
            'sellRateTQT': parseInt(limits.sellRate, 10),
            'totalBuyLimit': parseInt(limits.totalBuy, 10),
            'totalSellLimit': parseInt(limits.totalSell, 10),
            'initialBuySupply': parseInt(supply.initialBuy, 10),
            'initialSellSupply': parseInt(supply.initialSell, 10),
            'expirationHeight': parseInt(expirationHeight, 10)
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    getAllExchanges(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAllExchanges',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    currencyReserveClaim(publicKey, currency, units, fee) {
        let params = {
            'requestType': 'currencyReserveClaim',
            'currency': currency,
            'units': units,
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    currencyReserveIncrease(publicKey, currency, amountPerUnit, fee) {
        let params = {
            'requestType': 'currencyReserveIncrease',
            'currency': currency,
            'amountPerUnitTQT': parseInt(amountPerUnit, 10),
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    buyCurrency(publicKey, currency, rateTQT, units, fee) {
        let params = {
            'requestType': 'currencyBuy',
            'currency': currency,
            'rateTQT': parseInt(rateTQT, 10),
            'units': parseInt(units, 10),
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };

        return this.transactionService.createTransaction(params, '', '');
    };

    sellCurrency(publicKey, currency, rateTQT, units, fee) {
        let params = {
            'requestType': 'currencySell',
            'currency': currency,
            'rateTQT': parseInt(rateTQT, 10),
            'units': parseInt(units, 10),
            'publicKey': publicKey,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    // getAvailableToBuy(currency, units  ) {
    //     this.restangular.withConfig( (RestangularConfigurer) => {
    //         RestangularConfigurer.setBaseUrl(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), '');
    //     });
    //     let params = {
    //         'requestType': 'getAvailableToBuy',
    //         'currency': accountRs,
    //         'units': units
    //     };
    //     return this.restangular.all(AppConstants.currenciesConfig.currenciesEndPoint).customGET('', params);
    // };
    //
    // getAvailableToSell(currency, units  ) {
    //     this.restangular.withConfig( (RestangularConfigurer) => {
    //         RestangularConfigurer.setBaseUrl(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), '');
    //     });
    //     let params = {
    //         'requestType': 'getAvailableToSell',
    //         'currency': currency,
    //         'units': units
    //     };
    //     return this.restangular.all(AppConstants.currenciesConfig.currenciesEndPoint).customGET('', params);
    // };

    getBuyOffers( account, currency, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getBuyOffers',
            'account': account,
            'currency': currency,
            'availableOnly': true,
            'sortByRate': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getSellOffers(account, currency, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getSellOffers',
            'account': account,
            'currency': currency,
            'availableOnly': true,
            'sortByRate': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getCurrencyAccounts(currency, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getCurrencyAccounts',
            'currency': currency,
            'availableOnly': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getCurrencyFounders(currency, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getCurrencyFounders',
            'currency': currency,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getCurrencyTransfers(currency, account, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getCurrencyTransfers',
            'currency': currency,
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getExchanges(currency, account, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getExchanges',
            'currency': currency,
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getDeskExchanges(currency, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getExchanges',
            'currency': currency,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getAccountExchangeRequests(accountRs, currency, firstIndex, lastIndex ) {
        let params = {
            'requestType': 'getAccountExchangeRequests',
            'account': accountRs,
            'currency': accountRs,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getExpectedCurrencyTransfers(currency, account, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getExpectedCurrencyTransfers',
            'currency': currency,
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getExpectedExchangeRequests(currency, account, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getExpectedExchangeRequests',
            'currency': currency,
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCurrencyInfo': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getExpectedSellOffers(currency, account, firstIndex, lastIndex):any {
        let params = {
            'requestType': 'getExpectedSellOffers',
            'currency': currency,
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'sortByRate': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getAvailableToSell(currency, units   ) {
        let params = {
            'requestType': 'getAvailableToSell',
            'currency': currency,
            'units': units
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };

    getAvailableToBuy(currency, units   ) {
        let params = {
            'requestType': 'getAvailableToBuy',
            'currency': currency,
            'units': units
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.currenciesConfig.currenciesEndPoint, params );
    };


}
