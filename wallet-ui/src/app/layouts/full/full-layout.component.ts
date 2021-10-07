import { Component, OnInit, ElementRef } from '@angular/core';
import { DashboardService } from '../../module/dashboard/dashboard.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { PeerService } from '../../services/peer.service';
import { OptionsConfigurationService } from '../../services/options-configuration.service';
import { AppVariables } from '../../config/variables';
import { AppConstants } from '../../config/constants';
import { NodeConfig } from '../../config/node-config';
import { RootScope } from '../../config/root-scope';
import { AmountTqtPipe } from '../../pipes/amount-tqt.pipe';
import { CommonService } from '../../services/common.service';
import { OptionService } from '../../services/option.service';
import { LocalhostService } from '../../services/localhost.service';
import * as alertFunction from '../../shared/data/sweet-alerts';
import { BroadcastService } from 'app/services/broadcast.service';

const fireRefreshEventOnWindow = function () {
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
};

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {


    constructor(private elementRef: ElementRef,
        private sessionStorageService: SessionStorageService,
        private dashboardService: DashboardService,
        private peerService: PeerService,
        private optionsConfigurationService: OptionsConfigurationService,
        private amountTqtPipe: AmountTqtPipe,
        private commonService: CommonService,
        private optionService: OptionService,
        private localhostService: LocalhostService,
        private broadcastService: BroadcastService
    ) { }

    ngOnInit() {
        // sidebar toggle event listner
        // this.elementRef.nativeElement.querySelector('#sidebarToggle')
        //     .addEventListener('click', this.onClick.bind(this));
        // //customizer events
        // this.elementRef.nativeElement.querySelector('#cz-compact-menu')
        //     .addEventListener('click', this.onClick.bind(this));
        // this.elementRef.nativeElement.querySelector('#cz-sidebar-width')
        //     .addEventListener('click', this.onClick.bind(this));

        this.getAccountAssetsAndBalances();

        if (!this.sessionStorageService.getFromSession(NodeConfig.SESSION_PEER_NODES)) {
            this.peerService.getPeers().subscribe((response) => {
                this.sessionStorageService.saveToSession(NodeConfig.SESSION_PEER_NODES, response);
                this.optionsConfigurationService.loadOptions();
            }, function (error) {
                const title: string = this.commonService.translateAlertTitle('Error');
                const msg: string = this.commonService.translateInfoMessage('unable-get-node');
                alertFunction.InfoAlertBox(title,
                    msg,
                    'OK',
                    'error');
            });
        }
        this.optionsConfigurationService.loadOptions();

        this.optionService.optionsChanged$.subscribe(res => {
            this.onOptionsChanged();
        });
    }

    onOptionsChanged() {
        this.localhostService.getPeerState(this.optionService.getOption('USER_NODE_URL', ''))
            .subscribe((response) => {
                const uri = new URL(this.optionService.getOption('USER_NODE_URL', ''));
                response._id = uri.hostname;
                this.sessionStorageService.saveToSession(NodeConfig.SESSION_LOCAL_NODE, response);
                this.sessionStorageService.saveToSession(NodeConfig.SESSION_HAS_LOCAL, true);
                this.getAccountAssetsAndBalances();
            }, function (error) {
                this.sessionStorageService.saveToSession(NodeConfig.SESSION_HAS_LOCAL, false);
                this.getAccountAssetsAndBalances();
            });
        this.peerService.getPeers().subscribe((response) => {
            this.sessionStorageService.saveToSession(NodeConfig.SESSION_PEER_NODES, response);
            this.broadcastService.broadcast('peers-updated');
        });
    }

    getAccountAssetsAndBalances() {
        const accountRs = this.getAccountDetails('accountRs');
        this.dashboardService.getAccountAssetsAndBalances(accountRs)
            .subscribe((response) => {
                if (response.balanceTQT) {
                    RootScope.set({ balanceTQT: response.balanceTQT, accountRs })
                } else {
                    RootScope.set({ balanceTQT: 0, accountRs })
                }
            });
    };

    getAccountDetails(keyName) {
        const accountDetails = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
        if (keyName) {
            return accountDetails[keyName];
        }
        return accountDetails;
    }

    onClick(event) {
        // initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }

}
