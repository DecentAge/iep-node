import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { Location } from '@angular/common';
import { AliasesService } from '../../../../aliases/aliases.service';
import { AssetsService } from '../../../../assets/assets.service';
import { CryptoService } from '../../../../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { AccountService } from '../../../account.service';
import { AppConstants } from '../../../../../config/constants';
import * as alertFunctions from '../../../../../shared/data/sweet-alerts';

@Component({
    selector: 'app-delete-property',
    templateUrl: './delete-property.component.html',
    styleUrls: ['./delete-property.component.scss']
})
export class DeletePropertyComponent implements OnInit {

    validBytes = false;
    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;

    deletePropertyForm: any = {};

    unsignedTx: boolean;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private router: Router,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private _location: Location) { }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            } else {
                this.deletePropertyForm.account = params.id;
                this.deletePropertyForm.property = params.property;
                this.deletePropertyForm.mode = params.mode;
                this.deleteProperty();
            }
        })
    }
    deleteProperty() {
        let form = this.deletePropertyForm;
        let local = this.accountService.getAccountDetailsFromSession('accountRs');
        let account = form.account;
        let property = form.property;
        let mode = parseInt(form.mode);
        let setter = '';

        if (mode === 1) {

            if (account === local) {
                setter = local;
                account = local;
            } else {
                setter = account;
                account = local;
            }

        } else if (mode === 2) {
            setter = local;
            account = account;
        }

        let fee = 1;
        let secret = form.secretPhrase;

        let accountPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex;
        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }
        this.accountService.deleteAccountProperty(account, property, setter, accountPublicKey, fee)
            .subscribe((success: any) => {

                if (!success.errorCode) {
                    let unsignedBytes = success.unsignedTransactionBytes;
                    let signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                    this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                    this.validBytes = true;

                    this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                    this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                    this.tx_total = this.tx_fee + this.tx_amount;

                } else {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessageParams( 'sorry-error-occurred',
                    success);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {

                        });
                }
            });
    }
    broadcastTransaction = function (transactionBytes) {
        this.accountService.broadcastTransaction(transactionBytes).subscribe((success) => {

            if (!success.errorCode) {
                let title: string = this.commonService.translateAlertTitle('Success');
                let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                msg += success.transaction;
                alertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'success').then((isConfirm: any) => {
                    });

            } else {
                let title: string = this.commonsService.translateAlertTitle('Error');
                let errMsg: string = this.commonsService.translateErrorMessage('unable-broadcast-transaction', success);
                alertFunctions.InfoAlertBox(title,
                    errMsg,
                    'OK',
                    'error').then((isConfirm: any) => {
                    });
            }

        });
    };
    goBack() {
        this._location.back();
    }

}
