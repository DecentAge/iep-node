import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Location } from '@angular/common';
import { AssetsService } from '../assets.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareToQuantityPipe } from '../../../pipes/share-to-quantity.pipe';
import { AppConstants } from '../../../config/constants';
import { CryptoService } from '../../../services/crypto.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-issue-asset',
    templateUrl: './issue-asset.component.html',
    styleUrls: ['./issue-asset.component.scss']
})
export class IssueAssetComponent implements OnInit {

    transactionBytes: any;
    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    issueAssetForm = {
        'name': '',
        'description': '',
        'shares': '',
        'decimals': '',
        'secretPhrase': ''
    };
    unsignedTx: boolean;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private assetsService: AssetsService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        public shareToQuantityPipe: ShareToQuantityPipe,
        private _location: Location,
        public translate: TranslateService) {
    }

    ngOnInit() {
    }
    issueAsset() {
        var issueAssetForm = this.issueAssetForm;
        var name = issueAssetForm.name;
        var description = issueAssetForm.description;
        var shares = issueAssetForm.shares;
        var decimals = issueAssetForm.decimals;
        var quantity = parseInt(shares) * (Math.pow(10, parseInt(decimals)));
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const fee = 1;

        var secret = this.issueAssetForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        if (parseInt(shares) === 1) {
            const title: string = this.commonService.translateAlertTitle('info');
            const msg: string = this.commonService.translateInfoMessage('issue-asset-info-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error').then((isConfirm: any) => {
                });
            return;
        }

        this.assetsService.issueAsset(name, description, quantity, decimals, publicKey, fee)
            .subscribe((success_) => {
                success_.subscribe((success) => {
                    if (!success.errorCode) {
                        const unsignedBytes = success.unsignedTransactionBytes;
                        const signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);

                        this.validBytes = true;
                        this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        this.tx_total = this.tx_fee + this.tx_amount;
                    } else {
                        console.log('success.errCode', success.errCode);
                        let title: string = this.commonService.translateAlertTitle('Error');
                        let errMsg: string = this.commonService.translateErrorMessageParams( 'sorry-error-occurred', success);
                        alertFunctions.InfoAlertBox(title,
                            errMsg,
                            'OK',
                            'error').then((isConfirm: any) => {
                            });
                    }
                });
            })
    }

    broadcastTransaction(transactionBytes) {
        this.commonService.broadcastTransaction(transactionBytes)
            .subscribe((success) => {
                if (!success.errorCode) {
                    let title: string = this.commonService.translateAlertTitle('Success');
                    let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                    msg += success.transaction;
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'success').then((isConfirm: any) => {
                            this.router.navigate(['/assets/show-assets']);
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
    };

    goBack() {
        this._location.back();
    }

}
