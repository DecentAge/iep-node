import { Injectable } from '@angular/core';
import { HttpProviderService } from '../../services/http-provider.service';
import { NodeService } from '../../services/node.service';
import { AppConstants } from '../../config/constants';
import { OptionService } from '../../services/option.service';
import { CommonService } from '../../services/common.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { TransactionService } from '../../services/transaction.service';

@Injectable()
export class CrowdfundingService {

  constructor(public http: HttpProviderService,
    public nodeService: NodeService,
    public optionsService: OptionService,
    public commonsService: CommonService,
    public sessionStorageService: SessionStorageService,
    public transactionService: TransactionService) { }

  createCampaign(
    publicKey,
    name,
    code,
    desc,
    type,
    initialSupply,
    reserveSupply,
    maxSupply,
    decimals,
    fee,
    minReservePerUnitTQT,
    issuanceHeight
  ) {
    var params = {
      'publicKey': publicKey,
      'requestType': 'issueCurrency',
      'name': name,
      'code': code,
      'description': desc,
      'type': type,
      'initialSupply': parseInt(initialSupply),
      'reserveSupply': parseInt(reserveSupply),
      'maxSupply': parseInt(maxSupply),
      'minReservePerUnitTQT': parseInt(minReservePerUnitTQT),
      'issuanceHeight': parseInt(issuanceHeight),
      'decimals': parseInt(decimals),
      'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
      'broadcast': 'false',
      'deadline': this.optionsService.getOption('DEADLINE','')
    };

    return this.transactionService.createTransaction(params, '', '');

  };

  getAllCampaigns(firstIndex, lastIndex, account?): any {

    var params: any = {
      'requestType': 'getAllCrowdfundings',
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
      'includeCounts': false,
      'includeAmounts': true,
      'orderColumn': 'issuance_height',
      'order': 'desc'
    };

    if(account){
      params.account = account;
    }
    
    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
      this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.crowdfundingConfig.crowdfundingEndPoint, params);

  };

  getCampaignFounders(currency, firstIndex, lastIndex): any {

    var params = {
      'requestType': 'getCurrencyFounders',
      'currency': currency,
      'firstIndex': firstIndex,
      'lastIndex': lastIndex,
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.crowdfundingConfig.crowdfundingEndPoint, params);
  };

  setCampaignReserve(currency, amountPerUnitTQT, publicKey): any {

    // Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
    
    var params = {
      'requestType': 'currencyReserveIncrease',
      'publicKey': publicKey,
      'currency': currency,
      'amountPerUnitTQT': amountPerUnitTQT,
      'feeTQT': parseInt((1 * AppConstants.baseConfig.TOKEN_QUANTS) + '', 10),
      'broadcast': 'false',
      'deadline': this.optionsService.getOption('DEADLINE','')
    };

    return this.transactionService.createTransaction(params, '', '');
  };

  getCampaignClaim(currency, units, lastIndex): any {

    var params = {
      'requestType': 'currencyReserveClaim',
      'currency': currency,
      'units': units,
      'lastIndex': lastIndex,
    };

    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''), ''), AppConstants.crowdfundingConfig.crowdfundingEndPoint, params);
  };

}
