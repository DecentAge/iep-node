import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { OptionService } from '../../services/option.service';
import { TransactionService } from '../../services/transaction.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { LocalhostService } from '../../services/localhost.service';
import { BroadcastService } from '../../services/broadcast.service';
import { AppConstants } from '../../config/constants';
import { RootScope } from '../../config/root-scope';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

    connectedURL: string;
    totalNodes: string;
    currentHeight: string;
    peerState: any = {};
    options: any = {};
    currentModeText: string = '';
    selectedLanguage: string;

    constructor(
        private nodeService: NodeService,
        private broadcastService: BroadcastService,
        private localhostService: LocalhostService,
        private sessionStorageService: SessionStorageService,
        private transactionService: TransactionService,
        private optionService: OptionService,
        private translate: TranslateService
    ) {
        this.optionService.optionsChanged$.subscribe(res => {
            this.ngOnInit();
        });
    }

    ngOnInit() {
        RootScope.onChange.subscribe(data => {
            this.options = data['options'];
        });
        this.init();

        this.broadcastService.on('reload-options').subscribe((success) => {
            this.init();
        });

        this.broadcastService.on('peers-updated').subscribe((success) => {
            this.init();
        });


    }

    init() {
        this.connectedURL = this.nodeService.getNodeUrl();
        this.totalNodes = this.nodeService.getNodesCount();
        this.transactionService.getBlockChainStatus().subscribe((success) => {
            this.currentHeight = success.numberOfBlocks;
            this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK, success.numberOfBlocks);
        });
        this.getState();

        this.currentModeText = AppConstants.DEFAULT_OPTIONS.NETWORK_ENVIRONMENT;
    };

    getState() {
        this.localhostService.getPeerState(this.nodeService.getNodeUrl())
            .subscribe((success) => {
                this.peerState = success;
            });
    };

}
