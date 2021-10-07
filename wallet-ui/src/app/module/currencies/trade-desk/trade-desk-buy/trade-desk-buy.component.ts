import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../../../services/data-store.service';
import { Location } from '@angular/common';
import { CurrenciesService } from '../../currencies.service';
import { AccountService } from '../../../account/account.service';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { AppConstants } from '../../../../config/constants';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { CryptoService } from '../../../../services/crypto.service';
import { ShareToQuantityPipe } from '../../../../pipes/share-to-quantity.pipe';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-trade-desk-buy',
    templateUrl: './trade-desk-buy.component.html',
    styleUrls: ['./trade-desk-buy.component.scss']
})
export class TradeDeskBuyComponent implements OnInit {

    constructor(public router: Router,
        public route: ActivatedRoute,
        public currenciesService: CurrenciesService,
        public accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public shareToQuantityPipe: ShareToQuantityPipe,
        public amountToQuantPipe: AmountToQuantPipe,
        public _location: Location,
        public commonService: CommonService) {
    }

    buyCurrencyForm: any = {};
    buyCurrencyData: any = {};

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;

    ngOnInit() {
        this.buyCurrencyForm = DataStoreService.get('buy-currency');

        if (!this.buyCurrencyForm) {
            this.route.params.subscribe(params => {
                this.router.navigate(['/currencies/trade', params['id']]);
            });
        } else {
            this.buyCurrency();
        }
    }

    buyCurrency() {

        this.buyCurrencyForm.fee = 1;

        var buyCurrencyForm = this.buyCurrencyForm;
        var currency = buyCurrencyForm.currencyId;
        var fee = 1;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');

        var units = parseInt(this.shareToQuantityPipe.transform(buyCurrencyForm.shares, buyCurrencyForm.decimals));
        var rateTQT = parseInt((this.amountToQuantPipe.transform(buyCurrencyForm.rate) / Math.pow(10, buyCurrencyForm.decimals)) + '');


        var fee = 1;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.buyCurrencyForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.currenciesService.buyCurrency(publicKey, currency, rateTQT, units, fee)
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
                            this.router.navigate(['/currencies/trade', params['id']]);
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
