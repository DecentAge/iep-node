import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';
import { SessionStorageService } from '../services/session-storage.service';
import { OptionService } from '../services/option.service';
import { AccountService } from '../module/account/account.service';
import { AppVariables } from '../config/variables';
import { AppConstants } from '../config/constants';
import { RootScope } from '../config/root-scope';

@Injectable()
export class OptionsConfigurationService {

    constructor(
        private commonService: CommonService,
        private accountService: AccountService,
        private optionService: OptionService,
        private sessionStorageService: SessionStorageService
    ) { }

    loadOptions() {
        const _this = this;
        if (!RootScope.data.options) {
            const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
            _this.optionService.loadOptions(publicKey, function (optionsObject) {
                RootScope.set({ options: optionsObject });
                _this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, optionsObject);
                _this.getPhasingDetails(_this);
            }, function (e) {
                RootScope.set({ options: AppConstants.DEFAULT_OPTIONS });
                _this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, AppConstants.DEFAULT_OPTIONS);
                _this.getPhasingDetails(_this);
            });
        }
    }

    getPhasingDetails(_this) {
        var accountRS = _this.commonService.getAccountDetailsFromSession('accountRs');
        _this.accountService.getPhasingOnlyControl(accountRS).subscribe(function (success) {
            if (success.account) {
                _this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY, true);
                _this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                    success);
            } else {
                _this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                    false);
                _this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                    '');
            }
        });
    }
}
