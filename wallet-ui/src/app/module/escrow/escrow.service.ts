import { Injectable } from '@angular/core';
import {OptionService} from '../../services/option.service';
import { HttpProviderService } from '../../services/http-provider.service';
import {TransactionService} from '../../services/transaction.service';
import {NodeService} from '../../services/node.service';
import {AppConstants} from '../../config/constants';

@Injectable()
export class EscrowService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public transactionService: TransactionService) { }

    createEscrow(publicKey, recipientRS, amountTQT, escrowDeadline, deadlineAction, requiredSigners, signers, fee ) {
        let params = {
            'requestType': 'sendMoneyEscrow',
            'publicKey': publicKey,
            'recipient': recipientRS,
            'amountTQT': amountTQT,
            'escrowDeadline': escrowDeadline,
            'deadlineAction': deadlineAction,
            'requiredSigners' : requiredSigners,
            'signers': signers,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };

        return this.transactionService.createTransaction(params, '', '');
    };

    getAccountEscrowTransactions(account, firstIndex, lastIndex   ) {
        let params = {
            'requestType': 'getAccountEscrowTransactions',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.escrowConfig.escrowEndPoint, params );
    };

    getEscrowTransaction = function (escrow, firstIndex, lastIndex   ) {
        let params = {
            'requestType': 'getEscrowTransaction',
            'escrow': escrow,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.escrowConfig.escrowEndPoint, params );
    };

    escrowSign(publicKey, escrow, decision, fee ) {
        let params = {
            'requestType': 'escrowSign',
            'publicKey': publicKey,
            'escrow': escrow,
            'decision': decision,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };

        return this.transactionService.createTransaction(params, '', '');
    };
}
