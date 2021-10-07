import { Component, OnInit } from '@angular/core';
import { ExtensionsService } from "../extensions.service";

@Component({
    selector: 'app-service-monitor',
    templateUrl: './service-monitor.component.html',
    styleUrls: ['./service-monitor.component.scss']
})
export class ServiceMonitorComponent implements OnInit {
    private rows = new Array<any>();
    activeIds: string[] = [];
    IP_STATUS = {};
    serviceMonitorConstants = new ServiceMonitorConstants();

    peerEndpoints: any;
    macapEndpoints: any;
    websiteEndpoints: any;
    testnetEndpoints: any;
    apiEndpoints: any;

    constructor(public extensionsService: ExtensionsService) {
        this.activeIds = ["peerServiceStatus", "websitesServiceStatus", "testnetStatus", "apiStatus"];
        this.peerEndpoints = this.serviceMonitorConstants.ServicePeerEndpoints;
        this.macapEndpoints = this.serviceMonitorConstants.ServiceMacapEndpoints;
        this.websiteEndpoints = this.serviceMonitorConstants.ServiceWebsiteEndpoints;
        this.testnetEndpoints = this.serviceMonitorConstants.ServiceTestnetEndpoints;
        this.apiEndpoints = this.serviceMonitorConstants.ServiceApiEndpoints;
    }

    ngOnInit() {
        this.getAllIpStatus(this.peerEndpoints, false);
        this.getAllIpStatus(this.websiteEndpoints, true);
        this.getAllIpStatus(this.testnetEndpoints, true);
        this.getAllIpStatus(this.apiEndpoints, true);
    }

    getAllIpStatus(ipArray, website) {
        ipArray.map((value, key) => {
            this.IP_STATUS[value.url] = this.IP_STATUS[value.url] || {};

            this.extensionsService.getPeerStatus(value.url, website).subscribe((success: any) => {
                this.IP_STATUS[value.url].status = '<span class="label label-success">ONLINE</span>';
                this.IP_STATUS[value.url].timestamp = new Date().toString();
            }, (error) => {
                this.IP_STATUS[value.url].status = '<span class="label label-warning">OFFLINE</span>';
                this.IP_STATUS[value.url].timestamp = new Date().toString();
            });
        });
    }

    getStatus(check, website) {
        let url = check.url;
        this.IP_STATUS[url] = {};

        this.extensionsService.getPeerStatus(url, website).subscribe((success: any) => {
            this.IP_STATUS[url].status = '<span class="label label-success">ONLINE</span>';
            this.IP_STATUS[url].timestamp = new Date().toString();
        }, (error) => {
            this.IP_STATUS[url].status = '<span class="label label-warning">OFFLINE</span>';
            this.IP_STATUS[url].timestamp = new Date().toString();
        });
    }

}

export class ServiceMonitorConstants {
    ServicePeerEndpoints = [
        // {'label': 'Peer #1',  'ip': '185.35.137.7'   , 'url': 'http://185.35.137.7:8888/api/nodes'},
        // {'label': 'Peer #2',  'ip': '185.103.75.217' , 'url': 'http://185.103.75.217:8888/api/nodes'},
        // {'label': 'Peer #3',  'ip': '185.35.139.101' , 'url': 'http://185.35.139.101:8888/api/nodes'},
        // {'label': 'Peer #4',  'ip': '185.35.139.102' , 'url': 'http://185.35.139.102:8888/api/nodes'},
        // {'label': 'Peer #5',  'ip': '185.35.139.103' , 'url': 'http://185.35.139.103:8888/api/nodes'},
        // {'label': 'Peer #6',  'ip': '185.35.139.104' , 'url': 'http://185.35.139.104:8888/api/nodes'},
        // {'label': 'Peer #7',  'ip': '185.35.139.105' , 'url': 'http://185.35.139.105:8888/api/nodes'},
        // {'label': 'Peer #8',  'ip': '46.244.20.41'   , 'url': 'http://46.244.20.41:8888/api/nodes'},
        // {'label': 'Peer #9',  'ip': '208.95.1.177'   , 'url': 'http://208.95.1.177:8888/api/nodes'},
        // {'label': 'Peer #10', 'ip': '199.127.137.169', 'url': 'http://199.127.137.169:8888/api/nodes'}
        /* ----- New End Points  ----- */
        { 'label': 'Peer #1', 'ip': '35.204.224.241', 'url': 'http://35.204.224.241:8888/api/nodes' },
    ];

    ServiceMacapEndpoints = [
        { 'label': 'MaCap', 'ip': '185.103.75.217', 'url': 'http://185.103.75.217:8892/api/v1/get' }
    ];

    ServiceWebsiteEndpoints = [
        // { 'label': 'Peerexplorer I', 'ip': '185.103.75.217', 'url': 'http://185.103.75.217/peer/images/logo_nav.png' },
        // { 'label': 'Blockexplorer I', 'ip': '185.103.75.217', 'url': 'http://185.103.75.217/block/images/logo_nav.png' },
        // { 'label': 'Peerexplorer II', 'ip': '185.35.139.101 ', 'url': 'http://185.35.139.101/peer/images/logo_nav.png' },
        // { 'label': 'Blockexplorer II', 'ip': '185.35.139.101 ', 'url': 'http://185.35.139.101/block/images/logo_nav.png' },
        // { 'label': 'Online Wallet #1', 'ip': '46.244.20.41', 'url': 'http://46.244.20.41/wallet/images/logo.png' },
        // { 'label': 'Online Wallet #1', 'ip': '185.35.137.7', 'url': 'http://185.35.137.7/wallet/images/logo.png' },
        // { 'label': 'Online Wallet #1', 'ip': '208.95.1.177', 'url': 'http://208.95.1.177/wallet/images/logo.png' },
        // tslint:disable-next-line:max-line-length
        // { 'label': 'Online Wallet SSL', 'ip': '185.35.139.105', 'url': 'https://securewallet.infinity-economics.org/wallet/images/logo.png' }
        /* ----- New End Points  ----- */
        { 'label': 'Peerexplorer', 'ip': '35.204.224.241', 'url': 'http://35.204.224.241/peerexplorer/images/logo_nav.png' },
        { 'label': 'Blockexplorer', 'ip': '35.204.224.241', 'url': 'http://35.204.224.241/peerexplorer/images/logo_nav.png' },
        { 'label': 'Online Wallet #1', 'ip': '35.242.201.209', 'url': 'http://35.242.201.209/assets/images/logo.png' },
        { 'label': 'Online Wallet #1', 'ip': '208.95.1.177', 'url': 'http://208.95.1.177/wallet/images/logo.png' }
    ];

    ServiceTestnetEndpoints = [
        { 'label': 'Online Wallet', 'ip': '185.35.138.140', 'url': 'http://185.35.138.140/wallet/images/logo.png' },
        { 'label': 'Peerexplorer', 'ip': '185.35.138.140', 'url': 'http://185.35.138.140/peer/images/logo_nav.png' },
        { 'label': 'Blockexplorer', 'ip': '185.35.138.140', 'url': 'http://185.35.138.140/block/images/logo_nav.png' }
    ];

    ServiceApiEndpoints = [
        { 'label': 'API Node', 'ip': '199.127.137.169', 'url': 'http://199.127.137.169:9005/docs/images/favicon-16x16.png' },
        { 'label': 'API Backends', 'ip': '199.127.137.169', 'url': 'http://199.127.137.169:9006/docs/images/favicon-16x16.png' }
    ];

    serviceMonConfig = {
        'apiUrl': 'api/nodes'
    };
}
