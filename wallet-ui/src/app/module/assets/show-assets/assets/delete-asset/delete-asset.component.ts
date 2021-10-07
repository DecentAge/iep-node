import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../../../assets.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { AliasesService } from '../../../../aliases/aliases.service';
import { CommonService } from '../../../../../services/common.service';
import { CryptoService } from '../../../../../services/crypto.service';
import { AppConstants } from '../../../../../config/constants';
import * as alertFunctions from '../../../../../shared/data/sweet-alerts';
import { Location } from '@angular/common';

@Component({
    selector: 'app-delete-asset',
    templateUrl: './delete-asset.component.html',
    styleUrls: ['./delete-asset.component.scss']
})
export class DeleteAssetComponent implements OnInit {

    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    deleteAssetFullForm = {
        'assetId': '',
        'name': ''
    };
    unsignedTx: boolean;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private assetsService: AssetsService,
        private aliasesService: AliasesService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private _location: Location) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            } else {
                const assetId = params.id;
                this.assetsService.getAsset(assetId, true).subscribe((success: any) => {
                    this.deleteAssetFullForm.assetId = success.asset;
                    this.deleteAssetFullForm.name = success.name;
                });
            }
        })
    }

    deleteAssetFull() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const asset = this.deleteAssetFullForm.assetId;
        const fee = 1;
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.assetsService.deleteAssetFull(asset, fee, publicKey)
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
                            this.router.navigate(['/assets/show-assets']);
                        });
                }
            });
    };

    goBack() {
        this._location.back();
    }

}
