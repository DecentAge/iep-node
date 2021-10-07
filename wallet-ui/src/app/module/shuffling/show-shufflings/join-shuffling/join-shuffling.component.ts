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
    selector: 'app-join-shuffling',
    templateUrl: './join-shuffling.component.html',
    styleUrls: ['./join-shuffling.component.scss']
})
export class JoinShufflingComponent implements OnInit {

    joinShuffleForm: any = {};
    isLocalhostOrTestnet: any;

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;
    unsignedTx: boolean;

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
            this.joinShuffleForm.shufflingFullHash = params.id;
            this.joinShuffleForm.amount = params.amount;
            this.joinShuffleForm.shuffling = params.shuffling;
            this.joinShuffleForm.holding = params.holding;

            this.isLocalhostOrTestnet = this.shufflingService.isLocalHostOrTestnet() || false;

            if (!this.isLocalhostOrTestnet) {
                const title: string = this.commonService.translateAlertTitle('Error');
                const msg: string = this.commonService.translateInfoMessage('shuffling-connection-error-msg');
                alertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'error').then((isConfirm: any) => {
                        this.router.navigate(['/shuffling/show-shufflings/all']);
                    });
            }

        });
    }

    joinShuffle() {

        var fee = 1;

        var shufflingFullHash = this.joinShuffleForm.shufflingFullHash;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');

        var secret = this.joinShuffleForm.secretPhrase;
        var secretPhraseHex;
        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        if (this.isLocalhostOrTestnet) {
            this.shufflingService.registerShuffle(publicKey, fee, shufflingFullHash)
                .subscribe((success_) => {
                    success_.subscribe((success) => {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);

                            this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            this.tx_total = this.tx_fee + this.tx_amount;
                            this.validBytes = true;
                        } else {
                            let title: string = this.commonService.translateAlertTitle('Error');
                            let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
                                success);
                            alertFunctions.InfoAlertBox(title,
                                errMsg,
                                'OK',
                                'error').then((isConfirm: any) => {
                                });
                        }
                    });
                })
        } else {
            const title: string = this.commonService.translateAlertTitle('Error');
            const msg: string = this.commonService.translateInfoMessage('shuffling-connection-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error').then((isConfirm: any) => {
                });
        }
    };

    broadcastTransaction(transactionBytes) {
        this.accountService.broadcastTransaction(transactionBytes).subscribe((success) => {

            if (!success.errorCode) {
                let title: string = this.commonService.translateAlertTitle('Success');
                let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                msg += success.transaction;
                alertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'success').then((isConfirm: any) => {
                        this.router.navigate(['/shuffling/show-shufflings/all']);
                    });

            } else {
                let title: string = this.commonService.translateAlertTitle('Error');
                let errMsg: string = this.commonService.translateErrorMessage('unable-broadcast-transaction', success);
                alertFunctions.InfoAlertBox(title,
                    errMsg,
                    'OK',
                    'error').then((isConfirm: any) => {
                    });
            }

        });
    }

    goBack() {
        this._location.back();
    }

}
