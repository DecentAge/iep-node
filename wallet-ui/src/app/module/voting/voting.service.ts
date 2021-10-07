import { Injectable } from '@angular/core';
import { HttpProviderService } from '../../services/http-provider.service';
import { NodeService } from '../../services/node.service';
import { AppConstants } from '../../config/constants';
import { OptionService } from '../../services/option.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { TransactionService } from '../../services/transaction.service';

@Injectable()
export class VotingService {

    constructor(public http: HttpProviderService, public nodeService: NodeService, public optionsService: OptionService, public sessionStorageService: SessionStorageService, public transactionService: TransactionService) {

    }

    getPolls(firstIndex, lastIndex, includeFinished) {
        let params = {
            'requestType': 'getAllPolls',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeFinished': includeFinished
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.pollConfig.pollEndPoint, params);
    }

    getAccountPolls(account, firstIndex, lastIndex, includeFinished) {
        let params = {
            'requestType': 'getPolls',
            'account': account,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeFinished': includeFinished
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.pollConfig.pollEndPoint, params);
    }

    getPoll(pollId) {
        let params = {
            'requestType': 'getPoll',
            'poll': pollId
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.pollConfig.pollEndPoint, params);
    }

    getPollData(pollId) {
        let params = {
            'requestType': 'getPollResult',
            'poll': pollId
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.pollConfig.pollEndPoint, params);
    }

    searchPolls(query, firstIndex, lastIndex) {
        let params = {
            'requestType': 'searchPolls',
            'query': query,
            'includeFinished': true,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.transactionService.createTransaction(params, {}, {});
    }

    castVote(publicKey, pollId, optionNames, fee) {
        let params = {
            'publicKey': publicKey,
            'requestType': 'castVote',
            'poll': pollId,
            'feeTQT': parseInt('' + fee * AppConstants.baseConfig.TOKEN_QUANTS, 10),
            'broadcast': 'false',
            'deadline': this.optionsService.getOption('DEADLINE', publicKey)
        };
        optionNames.map((option, index) => {
            params[optionNames[index]] = '1';
        });

        return this.transactionService.createTransaction(params, {}, {});
    }

    getOptionNames(pollOptions, votedOptions) {
        return votedOptions.map((votedOption) =>  {
            let index = pollOptions.indexOf(votedOption);
            return this.getOptionNameFormat(index);
        });
    }

    getOptionName(number) {
        return number > 9 ? 'option' + number : 'option0' + number;
    }

    createPoll(pollJson) {
        let params  = {
            'requestType': 'createPoll',
            'publicKey': pollJson.publicKey,
            'name': pollJson.name,
            'description': pollJson.description,
            'feeTQT': parseInt(''+ pollJson.fee * AppConstants.baseConfig.TOKEN_QUANTS, 10),
            'deadline': this.optionsService.getOption('DEADLINE', pollJson.publicKey),
            'broadcast': 'false',
            'minNumberOfOptions': pollJson.minNumberOfOptions,
            'maxNumberOfOptions': pollJson.maxNumberOfOptions,
            'minRangeValue': pollJson.minRangeValue,
            'maxRangeValue': pollJson.maxRangeValue,
            'minBalanceModel': pollJson.minBalanceModel,
            'minBalance': pollJson.minBalance,
            'finishHeight': pollJson.finishHeight,
            'votingModel': pollJson.votingModel
        };

        if (pollJson.holding) {
            params['holding']= pollJson.holding;
        }

        params = this.fillOptionsToJson(params, pollJson.options);

        let hasPhasing = this.sessionStorageService.getFromSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);

        if (hasPhasing) {
            let currentPhasingFinishHeight = AppConstants.DEFAULT_OPTIONS.TX_HEIGHT + pollJson.currentHeight;
            if (currentPhasingFinishHeight > parseInt(pollJson.finishHeight)) {
                params['phasingFinishHeight'] = parseInt(pollJson.finishHeight) - 1000;
            }
        }

        return this.transactionService.createTransaction(params, {}, {});
    }

    getPollVotes(pollId, firstIndex, lastIndex) {
        let params = {
            'requestType': 'getPollVotes',
            'poll': pollId,
            'includeWeights': 'true',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeFinished': true
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.pollConfig.pollEndPoint, params);
    }

    fillOptionsToJson(pollJson, pollOptions) {
        if (pollOptions) {
            let length = pollOptions.length;
            for (let i = 0; i < length; i++) {
                pollJson[this.getOptionName(i)] = pollOptions[i];
            }
        }
        return pollJson;
    }

    getOptionNameFormat(i) {
        if (i !== -1) {
            return i > 9 ? 'vote' + i : 'vote0' + i;
        }
    }
}
