import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ShufflingService } from '../../shuffling.service';
import { AccountService } from '../../../account/account.service';
import { AppConstants } from '../../../../config/constants';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { CryptoService } from '../../../../services/crypto.service';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-start-shuffling',
    templateUrl: './start-shuffling.component.html',
    styleUrls: ['./start-shuffling.component.scss']
})
export class StartShufflingComponent implements OnInit {

    startShuffleForm: any = {};
    showStart = true;
    publicKey: any;

    constructor(public activatedRoute: ActivatedRoute,
        private _location: Location,
        private shufflingService: ShufflingService,
        private accountService: AccountService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private router: Router,
        private commonService: CommonService) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            }
            this.startShuffleForm.shufflingFullHash = params.id;
        });
    }

    startShuffle() {
        var fee = 1;

        this.showStart = false;

        var shufflingFullHash = this.startShuffleForm.shufflingFullHash;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var recipientPublickey = this.startShuffleForm.recipientPublickey;

        var secret = this.startShuffleForm.secretPhrase;
        var secretPhraseHex;
        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex =
                this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.shufflingService.startShuffler(this.cryptoService.secretPhraseFromPrivateKey(secretPhraseHex),
            shufflingFullHash, undefined, recipientPublickey, fee)
            .subscribe((success_) => {

                success_.subscribe((success) => {
                    if (!success.errorCode) {

                        let title: string = this.commonService.translateAlertTitle('Success');
                        let msg: string = this.commonService.translateInfoMessageWithParams('shuffling-started-success', success);
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
                });
            })
    }

    goBack() {
        this._location.back();
    }
}
