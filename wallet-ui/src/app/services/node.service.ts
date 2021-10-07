import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { NodeConfig } from '../config/node-config';
import { PeerService } from './peer.service';
import { OptionService } from './option.service';
import { LocalhostService } from './localhost.service';
import { AppConstants } from '../config/constants';
import { BroadcastService } from './broadcast.service';

@Injectable()
export class NodeService {

    constructor(
        public sessionService: SessionStorageService,
        public peerService: PeerService,
        public optionsService: OptionService,
        public localHostService: LocalhostService,
        public broadcastService: BroadcastService
    ) { }

    getLocalNode() {
        const node = this.sessionService.getFromSession(NodeConfig.SESSION_LOCAL_NODE);
        if (!node) {
            return this.optionsService.getOption('USER_NODE_URL', '');
        }
        return node;
    }

    hasLocal() {
        return this.sessionService.getFromSession(NodeConfig.SESSION_HAS_LOCAL);
    }

    getPeerNode(i) {
        const peerNodes = this.sessionService.getFromSession(NodeConfig.SESSION_PEER_NODES);
        if (!peerNodes) {
            return this.peerService.getPeers().subscribe((response) => {
                if (this.sessionService) {
                    this.sessionService.saveToSession(NodeConfig.SESSION_PEER_NODES, response);
                }
                // Used custom broadcast
                // TODO: change broadcast listner to custom broadcastService method
                if (this.broadcastService) {
                    this.broadcastService.broadcast('peers-updated');
                }
                return response[i];
            });
        } else {
            return peerNodes[i];
        }

    }

    clearNodeConfig() {
        this.sessionService.deleteFromSession(NodeConfig.SESSION_PEER_NODES);
        this.sessionService.deleteFromSession(NodeConfig.SESSION_HAS_LOCAL);
        this.sessionService.deleteFromSession(NodeConfig.SESSION_LOCAL_NODE);
    };

    getNodesCount() {
        const total = this.sessionService.getFromSession(NodeConfig.SESSION_PEER_NODES) || [];
        return total.length;
    };

    getNode(connectionMode, selectRandom) {

        if (connectionMode === 'AUTO' || connectionMode === 0) {
            let i = 0;

            if (selectRandom) {
                i = Math.floor(Math.random() * this.getNodesCount());
            }
            return this.getPeerNode(i);
        } else if (connectionMode === 'HTTPS') {

            return this.optionsService.getOption('HTTPS_URL', '');

        } else if (connectionMode === 'FOUNDATION') {

            return this.optionsService.getOption('FOUNDATION_URL', '');

        } else if (connectionMode === 'MANUAL') {

            return this.optionsService.getOption('USER_NODE_URL', '');

        } else if (connectionMode === 'DEVTESTNET') {

            return this.optionsService.getOption('DEVTESTNET_URL', '');

        } else if (connectionMode === 'TESTNET') {

            return this.optionsService.getOption('TESTNET_URL', '');

        } else if (connectionMode === 'LOCALTESTNET') {

            return this.optionsService.getOption('LOCALTESTNET_URL', '');

        }
        return this.getLocalNode();

    };

    getNodeUrl(connectionMode, selectRandom) {

        let node = this.getNode(connectionMode, selectRandom);

        if (typeof node === 'string') {
            return node;
        }

        if (!node._id) {
            return AppConstants.baseConfig.FALLBACK_HOST_URL;
        }

        let url = node._id + ':' + node.apiServerPort;

        if (connectionMode === 'HTTPS') {
            url = 'https://' + node._id;
        }

        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url;
        }

        return url;
    };

    appendPortIfNotPresent(url, port) {

        let parser = new URL(url);

        if (!parser.port) {
            return url + ':' + port;
        }

        return url;
    }

    // hasLocal() {
    //     return this.hasLocal();
    // };

    getLocalNodeUrl() {
        let node = this.getNode(true, '');

        if (node) {
            let port = node.apiServerPort;
            return 'http://localhost:' + port;
        }
        throw new Error('Local node not available');
    };

}
