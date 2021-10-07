import { Injectable } from '@angular/core';
import { HttpProviderService } from '../../services/http-provider.service';
import { NodeService } from '../../services/node.service';
import { AppConstants } from '../../config/constants';
import { OptionService } from '../../services/option.service';
import { CommonService } from '../../services/common.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { TransactionService } from '../../services/transaction.service';

@Injectable()
export class ShufflingService {

  constructor(public http: HttpProviderService,
    public nodeService: NodeService,
    public optionsService: OptionService,
    public commonsService: CommonService,
    public sessionStorageService: SessionStorageService,
    public transactionService: TransactionService) { }

  getAllShufflings(firstIndex, lastIndex, includeFinished):any {

    var params = {
      'requestType': 'getAllShufflings',
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
      'includeFinished': includeFinished,
      'includeHoldingInfo': true
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  getAccountShufflings(account, firstIndex, lastIndex, includeFinished) : any{

    var params = {
      'requestType': 'getAccountShufflings',
      'account': account,
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
      'includeFinished': includeFinished,
      'includeHoldingInfo': true
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  createShuffling(publicKey, amount, participantCount, registrationPeriod, holding, holdingType, fee) {

    var params:any = {
      'requestType': 'shufflingCreate',
      'amount': parseInt(amount),
      'publicKey': publicKey,
      'participantCount': participantCount,
      'registrationPeriod': registrationPeriod,
      'holdingType': holdingType,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };

    if(holding){
      params.holding = holding;
    }

    return this.transactionService.createTransaction(params, '', '');
  };

  registerShuffle(publicKey, fee, shufflingFullHash) {

    var params = {
      'requestType': 'shufflingRegister',
      'shufflingFullHash': shufflingFullHash,
      'publicKey': publicKey,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };

    return this.transactionService.createTransaction(params, '', '');
  };

  isLocalHostOrTestnet() {
    var connectionMode = this.optionsService.getOption('CONNECTION_MODE', '');
    if (
      connectionMode === 'TESTNET' ||
      connectionMode === 'LOCAL_HOST' ||
      connectionMode === 'DEVTESTNET') {
      return true;
    }
    if (connectionMode === 'MANUAL') {
      var connectedUrl = this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
        this.optionsService.getOption('RANDOMIZE_NODES', ''));
      if (connectedUrl.indexOf('localhost') > -1) {
        return true;
      }
    }
  }

  getShufflingParticipants(shufflingId): any {

    var params = {
      'requestType': 'getShufflingParticipants',
      'shuffling': shufflingId
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  getShuffling(shufflingId): any {

    var params = {
      'requestType': 'getShuffling',
      'shuffling': shufflingId,
      'includeHoldingInfo': true
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  getShufflers(adminPassword, account, shufflingFullHash, secretPhrase):any {

    var params:any = {
      'requestType': 'getShufflers',
      'secretPhrase': secretPhrase,
      'includeParticipantState': true
    };

    if(adminPassword){
      params.adminPassword = adminPassword;
    }

    if(account){
      params.account = account;
    }

    if(shufflingFullHash){
      params.shufflingFullHash = shufflingFullHash;
    }

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  getShuffleAndStopIfExpired(shuffleId, adminPassword) {
    return this.getShuffling(shuffleId).subscribe((success) => {
      if (!success.errorCode) {
        if ((success.stage === 4 || success.stage === 5)) {
          return this.stopShuffler(
            success.shufflingFullHash,
            undefined,
            1,
            adminPassword,
            this.commonsService.getAccountDetailsFromSession('accountRs'))
            .subscribe( (success) => {
              return Promise.resolve(success);
            }, function (error) {
              return Promise.resolve(error);
            });
        }
        return Promise.resolve('Shuffling is in starat state');
      } else {
        return Promise.resolve(success);
      }
    }, function (error) {
      return Promise.resolve(error);
    })
  };

  getHoldingShufflings(holding, stage, includeFinished, firstIndex, lastIndex, adminPassword) {

    var params = {
      'requestType': 'getHoldingShufflings',
      'holding': holding,
      'stage': stage,
      'includeFinished': includeFinished,
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
      'adminPassword': adminPassword
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  getAssignedShufflings(account, stage, firstIndex, lastIndex, adminPassword) {

    var params = {
      'requestType': 'getAssignedShufflings',
      'account': account,
      'includeHoldingInfo': true,
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
      'adminPassword': adminPassword
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.shufflingsConfig.shufflingEndPoint, params);
  };

  shufflingVerify(shuffling, shufflingStateHash, recipientSecretPhrase, secretPhrase, fee) {
    var params = {
      'requestType': 'shufflingVerify',
      'shuffling': shuffling,
      'shufflingStateHash': shufflingStateHash,
      'recipientSecretPhrase': recipientSecretPhrase,
      'secretPhrase': secretPhrase,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };
    return this.transactionService.createTransaction(params, '', '');
  };

  startShuffler(secretPhrase, shufflingFullHash, recipientSecretPhrase, recipientPublicKey, fee) {
    var params:any = {
      'requestType': 'startShuffler',
      'secretPhrase': secretPhrase,
      'shufflingFullHash': shufflingFullHash,
      'recipientPublicKey': recipientPublicKey,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };
    
    if(recipientSecretPhrase){
      params.recipientSecretPhrase = recipientSecretPhrase;
    }
    return this.transactionService.createTransaction(params, '', '');
  };

  stopShuffler(shufflingFullHash, secretPhrase, fee?, adminPassword?, account?) {
    var params:any = {
      'requestType': 'stopShuffler',
      'shufflingFullHash': shufflingFullHash,
      'secretPhrase': secretPhrase,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };

    if(adminPassword){
      params.adminPassword = adminPassword;
    }

    if(account){
      params.account = account;
    }

    return this.transactionService.createTransaction(params, '', '');
  };

  cancelShuffle(secretPhrase, shufflingId, shufflingStateHash, cancelAccountId, fee) {
    var params = {
      'requestType': 'shufflingCancel',
      'shuffling': shufflingId,
      'shufflingStateHash': shufflingStateHash,
      'secretPhrase': secretPhrase,
      'cancellingAccount': cancelAccountId,
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + "", 10),
      'deadline': this.optionsService.getOption('DEADLINE', ''),
      'broadcast': 'false',
    };
    return this.transactionService.createTransaction(params, '', '');
  };
}
