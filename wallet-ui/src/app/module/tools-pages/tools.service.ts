import { Injectable } from '@angular/core';
import {HttpProviderService} from '../../services/http-provider.service';
import {NodeService} from '../../services/node.service';
import {AppConstants} from '../../config/constants';
import {OptionService} from '../../services/option.service';

@Injectable()
export class ToolsService {

  constructor(public http: HttpProviderService,
              public nodeService: NodeService,
              public optionsService: OptionService) { }

  decodeToken(token, website) {
    var params = {
      'requestType': 'decodeToken',
      'website': website,
      'token': token
    };
    
    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
  };

  parseTransaction(transactionBytes) {
    var params = {
      'requestType': 'parseTransaction',
      'transactionBytes': transactionBytes

    };
    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
  };

  broadcastTransaction(transactionBytes) {
    var params = {
      'requestType': 'broadcastTransaction',
      'transactionBytes': transactionBytes
    };
    
    return this.http.post(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
  };

  calculateHash(hashAlgorithm, secret): any {
    var params = {
      'requestType': 'hash',
      'hashAlgorithm': hashAlgorithm,
      'secret': secret,
      'secretIsText': true
    };
    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
  };

  getChainStats(): any {
    var params = {
      'requestType': 'getStatistics',
    };
    return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.messagesConfig.messagesEndPoint, params);
  };

}
