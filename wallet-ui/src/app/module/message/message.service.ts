import { Injectable } from '@angular/core';
import {AppConstants} from "../../config/constants";
import {SessionStorageService} from "../../services/session-storage.service";
import {NodeService} from "../../services/node.service";
import {OptionService} from "../../services/option.service";
import {HttpProviderService} from "../../services/http-provider.service";
import {TransactionService} from "../../services/transaction.service";

@Injectable()
export class MessageService {

  constructor(public sessionStorageService: SessionStorageService,
              public optionsService: OptionService,
              public nodeService: NodeService,
              public http: HttpProviderService,
              public transactionService: TransactionService) { }

    getAccountDetailsFromSession(keyName) {
        let accountDetails = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
        if (keyName) {
            return accountDetails[keyName];
        }
        return accountDetails;
    }

    getMessages(account, firstIndex, lastIndex, type, subtype) {
        let params = {
            'requestType': 'getBlockchainTransactions',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'type': type,
            'subtype': subtype,
            'withMessage': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
    };

    getAccountDetails(accountRS) {
        let params = {
            'requestType': 'getAccount',
            'account': accountRS
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
    };

    sendMessage(senderPublicKey, recipientRS, fee, data, nonce, recipientPublicKey, prunable) {
        let params = {
            'requestType': 'sendMessage',
            'publicKey': senderPublicKey,
            'recipient': recipientRS,
            'encryptedMessageData': data,
            'encryptedMessageNonce': nonce,
            'messageToEncryptIsText': 'true',
            'compressMessageToEncrypt': 'true',
            'encryptedMessageIsPrunable': prunable,
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
            'recipientPublicKey': recipientPublicKey,
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false',
        };

        return this.transactionService.createTransaction(params, '', '');
    };

    broadcastMessage(transactionBytes, prunableAttachmentJSON) {
        let params = {
            'requestType': 'broadcastTransaction',
            'transactionBytes': transactionBytes,
        };
        if(prunableAttachmentJSON){
            params['prunableAttachmentJSON'] = JSON.stringify(prunableAttachmentJSON);
        }
        return this.http.post(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);

    };
}
