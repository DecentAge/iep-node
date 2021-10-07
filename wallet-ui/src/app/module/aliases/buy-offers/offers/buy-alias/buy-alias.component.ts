import { Component, OnInit } from '@angular/core';
import { AmountToQuantPipe } from '../../../../../pipes/amount-to-quant.pipe';
import { AliasesService } from '../../../aliases.service';
import { Location } from '@angular/common';
import { CryptoService } from '../../../../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { AppConstants } from '../../../../../config/constants';
import * as alertFunctions from '../../../../../shared/data/sweet-alerts';

@Component({
    selector: 'app-buy-alias',
    templateUrl: './buy-alias.component.html',
    styleUrls: ['./buy-alias.component.scss']
})
export class BuyAliasComponent implements OnInit {

    data: any;
    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    alias = {
        name: '',
        priceTQT: 0
    };
    unsignedTx: boolean;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private aliasesService: AliasesService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        private _location: Location) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params) {
                this._location.back();
            } else {
                this.data = {
                    'aliasName': params.aliasName,
                    'priceTQT': params.priceTQT
                }
            }
        })
        this.alias.name = this.data.aliasName;
        this.alias.priceTQT = this.data.priceTQT;
    }

    buyAlias() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const name = this.alias.name;
        const price = this.alias.priceTQT;
        const fee = 1;
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.aliasesService.buyAlias(publicKey, name, price, fee)
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
                            this.router.navigate(['/aliases/show-alias']);
                        });
                } else {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessage('unable-broadcast-transaction', success);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                            this.router.navigate(['/aliases/buy-offers']);
                        });
                }
            });
    };

    goBack() {
        this._location.back();
    }

}
