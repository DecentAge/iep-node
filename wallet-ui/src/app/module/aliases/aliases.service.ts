import {Injectable} from '@angular/core';
import {AppConstants} from '../../config/constants';
import {NodeService} from '../../services/node.service';
import {HttpProviderService} from '../../services/http-provider.service';
import {TransactionService} from '../../services/transaction.service';
import {OptionService} from '../../services/option.service';

@Injectable()
export class AliasesService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public transactionService: TransactionService) {
    }

    getAccountAliases(account, firstIndex, lastIndex) {

        let params = {
            'requestType': 'getAliases',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.aliasesConfig.aliasesEndPoint, params);

    };

    setAlias(publicKey, aliasName, alias, fee) {


        const aliasURI = alias;
        let params = {
            'publicKey': publicKey,
            'requestType': 'setAlias',
            'aliasName': aliasName,
            'aliasURI': aliasURI,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };
        return this.transactionService.createTransaction(params, {}, {});
    };

    deleteAlias(publicKey, aliasName, fee) {
        let params = {
            'publicKey': publicKey,
            'requestType': 'deleteAlias',
            'aliasName': aliasName,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };
        return this.transactionService.createTransaction(params, {}, {});
    };

    searchAlias(query, firstIndex?, lastIndex?): any {
        let params = {
            'requestType': 'getAliasesLike',
            'aliasPrefix': query,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.aliasesConfig.aliasesEndPoint, params);
    };

    sellAlias(publicKey, aliasName, recipientRS, price, fee) {
        let params = {
            'publicKey': publicKey,
            'requestType': 'sellAlias',
            'aliasName': aliasName,
            'priceTQT': price,
            'recipient': recipientRS,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };
        return this.transactionService.createTransaction(params, {}, {});
    };

    cancelAlias(publicKey, aliasName, recipientRS, fee) {


        let params = {
            'publicKey': publicKey,
            'requestType': 'sellAlias',
            'aliasName': aliasName,
            'priceTQT': '0',
            'recipient': recipientRS,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };
        return this.transactionService.createTransaction(params, {}, {});
    };

    buyAlias(publicKey, aliasName, price, fee) {

        let params = {
            'publicKey': publicKey,
            'requestType': 'buyAlias',
            'aliasName': aliasName,
            'amountTQT': parseInt(price),
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };
        return this.transactionService.createTransaction(params, {}, {});
    };

    getAliasesOpenOffers(account, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getAliasesOpenOffers',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.aliasesConfig.aliasesEndPoint, params);
    };

    getAliasesPrivateOffers(account, firstIndex, lastIndex) {

        let params = {
            'requestType': 'getAliasesPrivateOffers',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.aliasesConfig.aliasesEndPoint, params);
    };

    getAliasesPublicOffers(account, firstIndex, lastIndex, order, orderColumn) {
        let params = {
            'requestType': 'getAliasesPublicOffers',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'order': order,
            'orderColumn': orderColumn
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.aliasesConfig.aliasesEndPoint, params);
    };
}
