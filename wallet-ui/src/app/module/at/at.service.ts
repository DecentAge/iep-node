import { Injectable } from '@angular/core';
import { HttpProviderService } from '../../services/http-provider.service';
import { NodeService } from '../../services/node.service';
import { AppConstants } from '../../config/constants';
import { OptionService } from '../../services/option.service';
import { TransactionService } from '../../services/transaction.service';

@Injectable()
export class AtService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public transactionService: TransactionService) {
    }

    createATProgram(publicKey, name, description, creationBytes, code, data, dpages, cspages, uspages, minActivationAmountTQT, fee) {

        var params = {
            'publicKey': publicKey,
            'requestType': 'createATProgram',
            'name': name,
            'description': description,
            'creationBytes': creationBytes,
            'code': code,
            'data': data,
            'dpages': dpages,
            'cspages': cspages,
            'uspages': uspages,
            'minActivationAmountTQT': parseInt(minActivationAmountTQT),
            'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
            'deadline': this.optionsService.getOption('DEADLINE', ''),
            'broadcast': 'false'
        };

        return this.transactionService.createTransaction(params, '', '');
    };

    getAT(at) {

        var params = {
            'requestType': 'getAT',
            'at': at
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };

    getATDetails(at) {

        var params = {
            'requestType': 'getATDetails',
            'at': at
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };

    getATIds() {

        var params = {
            'requestType': 'getATIds'
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };

    getAllATs(): any {

        var params = {
            'requestType': 'getAllATs'
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };

    getATLong(hexString) {

        var params = {
            'requestType': 'getATLong',
            'hexString': hexString
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };

    getAccountATs(account): any {

        var params = {
            'requestType': 'getAccountATs',
            'account': account
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.ATConfig.ATEndPoint, params);
    };
}
