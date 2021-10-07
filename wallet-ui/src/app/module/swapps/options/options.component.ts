import { Component, OnInit } from '@angular/core';
import { OptionService } from '../../../services/option.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CommonService } from '../../../services/common.service';
import { NodeService } from '../../../services/node.service';
import { LocalhostService } from '../../../services/localhost.service';
import { AppConstants } from '../../../config/constants';
import * as AlertFunctions from '../../../shared/data/sweet-alerts';
import { isBoolean } from 'util';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
    CONNECTION_MODES: any[] = [];
    connectedURL = '';

    optionsForm: any;
    activeIds: string[] = [];

    constructor(
        public optionService: OptionService,
        public sessionStorageService: SessionStorageService,
        public commonService: CommonService,
        public localhostService: LocalhostService,
        public nodeService: NodeService
    ) {
        this.CONNECTION_MODES = ['AUTO', 'FOUNDATION', 'MANUAL', 'LOCAL_HOST', 'TESTNET', 'LOCALTESTNET', 'DEVTESTNET']; // 'HTTPS',
        this.activeIds = ['nodeAndConnections', 'blocksAndConfirmations', 'wallet', 'extensions'];
        this.optionsForm = {
            CONNECTION_MODE: '',
            USER_NODE_URL: '',
            RANDOMIZE_NODES: 0,
            REFRESH_INTERVAL_MILLI_SECONDS: 60,
            AUTO_UPDATE: false,
            EXTENSIONS: 1
        }
    }

    ngOnInit() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');

        this.optionService.loadOptions(publicKey, (optionsObject) => {
            this.optionsForm = this.copyJson(optionsObject, this.optionsForm);
            this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, optionsObject);
        }, (e) => {
            this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, AppConstants.DEFAULT_OPTIONS);
        });

        this.connectedURL = this.nodeService.getNodeUrl(
            this.optionService.getOption('CONNECTION_MODE', publicKey),
            this.optionService.getOption('RANDOMIZE_NODES', publicKey)
        );
    }

    copyJson(fromJson, toJson) {
        fromJson = fromJson || {};
        toJson = toJson || {};
        for (const key in fromJson) {
            if (fromJson.hasOwnProperty(key)) {
                if (!isNaN(fromJson[key]) && !isBoolean(fromJson[key])) {
                    fromJson[key] = parseInt(fromJson[key], 10);
                }
                toJson[key] = fromJson[key];
            }
        }
        return toJson;
    }

    getOptionsJsonObject(options) {
        const finalJson = {};
        for (const key in AppConstants.DEFAULT_OPTIONS) {
            if (AppConstants.DEFAULT_OPTIONS.hasOwnProperty(key)) {
                finalJson[key] = options[key];
            }
        }
        return finalJson;
    }

    nodeUrl() {
        const connectionMode = this.optionsForm.CONNECTION_MODE;
        if (connectionMode === 'AUTO') {
            return true;
        }
        return this.isValidUrl();
    }

    validateAndUpdate() {
        const url = this.optionsForm.USER_NODE_URL;
        const connectionMode = this.optionsForm.CONNECTION_MODE;

        this.updateConnectionMode(this.optionsForm);

        if (connectionMode === 'AUTO') {
            this.updateOptions();
        } else if (url) {
            this.localhostService.getPeerState(url).subscribe((success) => {
                this.updateOptions();
            });
        }
    }

    updateOptions() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey'),
            options = this.getOptionsJsonObject(this.optionsForm),
            finalOptions = [];
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const option = { 'publicKey': publicKey, 'optionName': key, 'value': options[key] };
                finalOptions.push(option);
            }
        }

        this.optionService.updateOptions(finalOptions, (success) => {
            this.optionService.loadOptions(publicKey, (optionsObject) => {
                this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, optionsObject);
                this.nodeService.clearNodeConfig();
                this.optionService.emitOptionsChanged();
            }, (error) => {
                this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, AppConstants.DEFAULT_OPTIONS);
                this.optionService.emitOptionsChanged();
            });

        }, (error) => {

        });
    }

    updateConnectionMode(form) {
        const connectionMode = this.optionsForm.CONNECTION_MODE;

        if (connectionMode === 'LOCAL_HOST') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.USER_NODE_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = false;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'MANUAL') {
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = false;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'HTTPS') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.HTTPS_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = false;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'AUTO') {
            this.optionsForm.RANDOMIZE_NODES = 1;
            this.optionsForm.TESTNET = false;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'FOUNDATION') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.FOUNDATION_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = false;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'TESTNET') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.TESTNET_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = true;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'LOCALTESTNET') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.LOCALTESTNET_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = true;
            this.optionsForm.EXTENSIONS = 1;
        } else if (connectionMode === 'DEVTESTNET') {
            this.optionsForm.USER_NODE_URL = AppConstants.DEFAULT_OPTIONS.DEVTESTNET_URL;
            this.optionsForm.RANDOMIZE_NODES = 0;
            this.optionsForm.TESTNET = true;
            this.optionsForm.DEVNET = true;
            this.optionsForm.EXTENSIONS = 1;
        }
    }

    isValidUrl() {
        const url = this.optionsForm.USER_NODE_URL;
        if (url) {
            return this.localhostService.isValidUrl(url);
        } else {
            return false;
        }
    }

}
