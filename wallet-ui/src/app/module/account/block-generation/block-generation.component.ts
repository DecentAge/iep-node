import { Component, OnInit } from '@angular/core';
import { OptionService } from '../../../services/option.service';
import { AccountService } from '../account.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-block-generation',
    templateUrl: './block-generation.component.html',
    styleUrls: ['./block-generation.component.scss']
})
export class BlockGenerationComponent implements OnInit {
    status = 'Unknown';
    hasLocal = false;
    hasHttps = false;
    connectionMode: any;
    generationStatus: any;
    secretPhrase = '';

    constructor(public optionsService: OptionService,
                public accountService: AccountService,
                public sessionStorageService: SessionStorageService,
                public commonService: CommonService) {
        this.generationStatus = '<span class="label label-warning">Unkown Account</span>';
    }

    ngOnInit() {
        this.connectionMode = this.optionsService.getOption('CONNECTION_MODE', '');
        this.hasLocal = this.connectionMode === 'LOCAL_HOST';
        this.hasHttps = this.connectionMode === 'HTTPS';
        this.displayNotificationAlert();
    }

    displayNotificationAlert() {
        if (this.connectionMode !== 'LOCAL_HOST' &&
            this.connectionMode !== 'TESTNET' &&
            this.connectionMode !== 'DEVTESTNET' &&
            this.connectionMode !== 'HTTPS') {
            const title: string = this.commonService.translateAlertTitle('Error');
            const msg: string = this.commonService.translateInfoMessage('block-generation-localhost-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error');
        } else {
            this.hasLocal = true;
        }
    }

    runBlockGeneration(mode) {
        this.accountService.blockGeneration(mode, this.secretPhrase, this.connectionMode)
            .subscribe((success: any) => {
                if (success.errorDescription) {
                    this.generationStatus = success.errorDescription;
                }
                if (typeof success.deadline !== 'undefined') {
                    this.generationStatus = '<span class="label label-success">Running</span>';
                }
                if (success.errorCode === 4) {
                    this.generationStatus =
                        '<span class="label label-warning">Unkown Account</span>';
                }
                // TODO: Multiple condition for same code need to refine code.
                if (success.foundAndStopped === true) {
                    this.generationStatus = '<span class="label label-danger">Stopped</span>';
                }
                if (success.foundAndStopped === false) {
                    this.generationStatus = '<span class="label label-danger">Stopped</span>';
                }
            });
    };
}
