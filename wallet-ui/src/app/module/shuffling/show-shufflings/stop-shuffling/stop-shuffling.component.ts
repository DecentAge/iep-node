import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ShufflingService } from '../../shuffling.service';
import { AccountService } from '../../../account/account.service';
import { AppConstants } from '../../../../config/constants';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { CryptoService } from '../../../../services/crypto.service';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-stop-shuffling',
    templateUrl: './stop-shuffling.component.html',
    styleUrls: ['./stop-shuffling.component.scss']
})
export class StopShufflingComponent implements OnInit {

    stopShuffleForm: any = {};
    showStop = true;

    constructor(public activatedRoute: ActivatedRoute,
        private _location: Location,
        private shufflingService: ShufflingService,
        private accountService: AccountService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private router: Router,
        private translate: TranslateService,
        private commonService: CommonService) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            }
            this.stopShuffleForm.shufflingFullHash = params.id;
        });
    }

    stopShuffle() {

        var fee = 1;

        this.showStop = false;

        var shufflingFullHash = this.stopShuffleForm.shufflingFullHash;
        var secret = this.stopShuffleForm.secretPhrase;
        var secretPhraseHex;
        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.shufflingService.stopShuffler(shufflingFullHash, this.cryptoService.secretPhraseFromPrivateKey(secretPhraseHex), fee)
            .subscribe((success_) => {
                success_.subscribe((success) => {

                    if (!success.errorCode) {

                        var result = '';
                        var resType = 'success';
                        this.translate.get('shuffling.stop-shuffling.shuffler-stop-success').subscribe((res: string) => {
                            result = res;
                        });

                        if (success.stoppedShuffler == false) {

                            this.translate.get('shuffling.stop-shuffling.no-running-shuffler').subscribe((res: string) => {
                                result = res;
                            });
                            var resType = 'info';
                        };
                        let title: string = this.commonService.translateAlertTitle('Success');
                        let msg: string = this.commonService.translateInfoMessageWithParams('stop-shuffle', result);
                        alertFunctions.InfoAlertBox(title,
                            msg,
                            'OK',
                            'success').then((isConfirm: any) => {
                                this.router.navigate(['/shuffling/show-shufflings/my']);
                            });

                    } else {
                        let title: string = this.commonService.translateAlertTitle('Error');
                        let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
                            success);
                        alertFunctions.InfoAlertBox(title,
                            errMsg,
                            'OK',
                            'error').then((isConfirm: any) => {
                                this.router.navigate(['/shuffling/show-shufflings/my']);
                            });
                    }
                })
            });
    }

    goBack() {
        this._location.back();
    }
}
