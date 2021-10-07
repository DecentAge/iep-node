import { Injectable } from '@angular/core';
import {OptionService} from '../../services/option.service';
import { HttpProviderService } from '../../services/http-provider.service';
import {TransactionService} from '../../services/transaction.service';
import {NodeService} from '../../services/node.service';
import {AppConstants} from '../../config/constants';

@Injectable()
export class SubscriptionService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public transactionService: TransactionService) { }

    createSubscription (publicKey, recipient, amountTQT, frequency, fee) {
        let params = {
            'publicKey': publicKey,
            'requestType': 'sendMoneySubscription',
            'recipient': recipient,
            'amountTQT': amountTQT,
            'frequency': frequency,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'broadcast': 'false',
            'deadline': this.optionsService.getOption('DEADLINE', '')
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    subscriptionCancel (publicKey, subscription, fee ) {
        let params = {
            'requestType': 'subscriptionCancel',
            'publicKey': publicKey,
            'subscription': subscription,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'broadcast': 'false',
            'deadline': this.optionsService.getOption('DEADLINE', '')
        };
        return this.transactionService.createTransaction(params, '', '');
    };

    getSubscription (subscription, firstIndex, lastIndex   ) {
        let params = {
            'requestType': 'getSubscription',
            'subscription': subscription,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.subscriptionConfig.subscriptionEndPoint, params );
    };

    getAccountSubscriptions (account, firstIndex, lastIndex   ) {
        let params = {
            'requestType': 'getAccountSubscriptions',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.subscriptionConfig.subscriptionEndPoint, params );
    };

    getSubscriptionsToAccount (account, firstIndex, lastIndex   ) {
        let params = {
            'requestType': 'getSubscriptionsToAccount',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.subscriptionConfig.subscriptionEndPoint, params );
    };
}
