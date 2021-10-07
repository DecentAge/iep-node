import { Component, OnInit } from '@angular/core';
import * as alertFunctions from '../../../../shared/data/sweet-alerts';
import { CryptoService } from '../../../../services/crypto.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../../../services/data-store.service';
import { ShareToQuantityPipe } from '../../../../pipes/share-to-quantity.pipe';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { AccountService } from '../../../account/account.service';
import { AppConstants } from '../../../../config/constants';
import { AssetsService } from '../../assets.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-trade-desk-buy-asset',
    templateUrl: './trade-desk-buy-asset.component.html',
    styleUrls: ['./trade-desk-buy-asset.component.scss']
})
export class TradeDeskBuyAssetComponent implements OnInit {

    constructor(public router: Router,
        public route: ActivatedRoute,
        public assetsService: AssetsService,
        public accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public shareToQuantityPipe: ShareToQuantityPipe,
        public amountToQuantPipe: AmountToQuantPipe,
        public _location: Location,
        public commonService: CommonService) {
    }

    buyAssetForm: any = {};

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;

    ngOnInit() {
        this.buyAssetForm = DataStoreService.get('buy-asset');

        if (!this.buyAssetForm) {
            this.route.params.subscribe(params => {
                this.router.navigate(['/assets/trade', params['id']]);
            });
        } else {
            this.buyAsset();
        }
    }

    buyAsset() {

        this.buyAssetForm.fee = 1;

        var buyAssetForm = this.buyAssetForm;
        var asset = buyAssetForm.assetId;
        var quantity = parseInt(this.shareToQuantityPipe.transform(buyAssetForm.quantity, buyAssetForm.decimals));
        var price = parseInt((this.amountToQuantPipe.transform(buyAssetForm.price) / Math.pow(10, buyAssetForm.decimals)) + '');
        var requestType = buyAssetForm.requestType;

        var fee = 1;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.buyAssetForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }
        this.assetsService.placeOrder(publicKey, price, asset, quantity, fee, requestType)
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
                        let errMsg: string = this.commonService.translateErrorMessageParams( 'sorry-error-occurred',
                         success);
                        alertFunctions.InfoAlertBox(title,
                            errMsg,
                            'OK',
                            'error').then((isConfirm: any) => {
                            });
                    }
                });
            })


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
                        this.route.params.subscribe(params => {
                            this.router.navigate(['/assets/trade', params['id']]);
                        });
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
