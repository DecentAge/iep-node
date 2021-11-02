import { Injectable } from '@angular/core';
import {SessionStorageService} from './session-storage.service';
import {AppConstants} from '../config/constants';
import { HttpProviderService } from './http-provider.service';
import {NodeService} from './node.service';
import {OptionService} from './option.service';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionService {

  constructor(public sessionStorageService: SessionStorageService,
              public http: HttpProviderService,
              public nodeService: NodeService,
              public optionsService: OptionService) { }


    createTransaction(requestParameters, messageParameters, phasingParameters): Observable<any> {
        let finalJson = {};
        return Observable.create((subscriber) => {
            this.getBlockChainStatus().subscribe((success) => {
                this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK, success.numberOfBlocks);
                if (!phasingParameters) {
                    phasingParameters = this.createPhasingParameters();
                }
                finalJson = this.copyJson(requestParameters, finalJson);
                finalJson = this.copyJson(phasingParameters, finalJson);
                finalJson = this.copyJson(messageParameters, finalJson);

                subscriber.next(this.http.post(this.nodeService.getNodeUrl(), AppConstants.baseConfig.apiEndPoint, finalJson ));
                subscriber.complete();
            });
        });
    };

    getBlockChainStatus(): Observable<any> {

        let params = {
            'requestType': 'getBlockchainStatus',
        };

        return this.http.get(this.nodeService.getNodeUrl(),  AppConstants.dashboardConfig.apiEndPoint, params )

    };

    copyJson(fromJson, toJson) {
        fromJson = fromJson || {};
        toJson = toJson || {};
        for (let key in fromJson) {
            if (fromJson.hasOwnProperty(key)) {
                toJson[key] = toJson[key] || fromJson[key];
            }
        }
        return toJson;
    }

    createPhasingParameters() {
        let hasPhasing = this.sessionStorageService.getFromSession(
            AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);
        let phasingParams: any = {};
        if (hasPhasing) {
            let accountPhasingOptions: any = this.sessionStorageService.getFromSession(
            AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY);
            phasingParams.phased = true;
            phasingParams.phasingVotingModel = accountPhasingOptions.votingModel;
            phasingParams.phasingQuorum = accountPhasingOptions.quorum;
            phasingParams.phasingMinBalance = accountPhasingOptions.minBalance;
            phasingParams.phasingMinBalanceModel = accountPhasingOptions.minBalanceModel;
            phasingParams.phasingWhitelisted =
            this.getWhitelistedAccountsFromPhasingJson(accountPhasingOptions.whitelist);
            let blockHeight = this.sessionStorageService.getFromSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK) || 0;
            // TODO: Change $rootscope to AppConstant for "options.TX_HEIGHT" where value assign done
            phasingParams.phasingFinishHeight = blockHeight + AppConstants.options.TX_HEIGHT;
        }
        return phasingParams;
    }

    getWhitelistedAccountsFromPhasingJson(controlWhiteListJson) {
        let accounts = [];
        for (let i = 0; i < controlWhiteListJson.length; i++) {
            accounts[i] = controlWhiteListJson[i].whitelisted;
        }
        return accounts;
    }

}
