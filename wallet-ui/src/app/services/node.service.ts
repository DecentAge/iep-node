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

    getNodeUrl() {
        return this.optionsService.getOption('NODE_API_URL', '');
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
        let node = this.optionsService.getOption('NODE_API_URL', '');

        if (node) {
            let port = node.apiServerPort;
            return 'http://localhost:' + port;
        }
        throw new Error('Local node not available');
    };

}
