import { Injectable } from '@angular/core';
import {NodeService} from "../../services/node.service";
import {OptionService} from "../../services/option.service";
import {HttpProviderService} from "../../services/http-provider.service";
import {AppConstants} from "../../config/constants";
import {PeerService} from "../../services/peer.service";

@Injectable()
export class SearchService {

    constructor(public http: HttpProviderService,
                public nodeService: NodeService,
                public optionsService: OptionService,
                public peerService: PeerService) { }
    searchBlocks = function (searchTerm) {
        let params = {
            'requestType': 'getBlock',
            'height': searchTerm,
            'includeTransactions': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.searchConfig.searchEndPoint, params);
    };

    searchIp = function (ip) {
        return this.peerService.searchIp(ip);
    };

    searchTransactionById = function (searchTerm) {
        let params = {
            'requestType': 'getTransaction',
            'transaction': searchTerm
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.searchConfig.searchEndPoint, params);

    };

    searchBlockById = function (searchTerm) {
        let params = {
            'requestType': 'getBlock',
            'block': searchTerm
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.searchConfig.searchEndPoint, params);

    };

    searchAccounts = function (searchTerm) {
        let params = {
            'requestType': 'getAccount',
            'account': searchTerm,
            'includeAssets': true,
            'includeCurrencies': true,
            'includeEffectiveBalance': true,
            'includeLessors': true
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.searchConfig.searchEndPoint, params);
    };

    searchTransactions = function (searchTerm) {
        let params = {
            'requestType': 'getTransaction',
            'fullHash': searchTerm,
            'includePhasingResult': true,
        };
        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.searchConfig.searchEndPoint, params);
    };

    validateIPaddress(ipAddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
            return true;
        }
        return false;
    }

}
