import { Injectable } from '@angular/core';
import { HttpProviderService } from "../../services/http-provider.service";
import { AppConstants } from "../../config/constants";
import { Observable } from "rxjs";
import { NodeService } from "../../services/node.service";
import { OptionService } from "../../services/option.service";
import { PeerService } from "../../services/peer.service";

@Injectable()
export class ExtensionsService {
    constructor(public http: HttpProviderService, public nodeService: NodeService, public optionsService: OptionService, public peerService: PeerService) {

    }

    getMaCap(page, results) {
        let params = {
            'page': page,
            'results': results,
        };

        return this.http.get(AppConstants.macapViewerConfig.macapUrl, AppConstants.macapViewerConfig.macapEndPoint, params);
    }

    getNews(page?, results?) {
        let params = {
            'page': page,
            'results': results,
            'order': 'desc'
        };

        return this.http.get(AppConstants.newsViewerConfig.newsUrl, AppConstants.newsViewerConfig.newsEndPoint, params);
    }

    getPeerStatus(url, website) {
        if (!website) {
            return this.http.get(url, '');
        } else {
            return Observable.create((observer) => {
                let img = new Image();
                img.src = url;
                img.onload = function () {
                    observer.next(img);
                };
                img.onerror = function (err) {
                    throw observer.throw(err);
                }
            })
        }
    }

    getBlocks(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getBlocks',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.chainViewerConfig.endPoint, params);
    }

    getTransactions(firstIndex, lastIndex) {
        let params = {
            'requestType': 'getTransactions',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.chainViewerConfig.endPoint, params);
    }

    getUnconfirmedTransactions() {
        let params = {
            'requestType': 'getUnconfirmedTransactions'
        };

        return this.http.get(this.nodeService.getNodeUrl(this.optionsService.getOption('CONNECTION_MODE', ''),
            this.optionsService.getOption('RANDOMIZE_NODES', '')), AppConstants.chainViewerConfig.endPoint, params);
    }

    getPeers(page, results) {
        let params = {
            'page': page,
            'results': results,
            'filter': 'numberOfActivePeers',
            'order': 'desc'
        };

        return this.http.get(this.peerService.getPeerEndPoints()[0], '', params);
    }
}
