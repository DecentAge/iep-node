import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { Location } from '@angular/common';
import { AliasesService } from '../../aliases.service';
import { CryptoService } from '../../../../services/crypto.service';
import * as alertFunctions from '../../../../shared/data/sweet-alerts';
import { AppConstants } from '../../../../config/constants';

@Component({
    selector: 'app-sell-alias',
    templateUrl: './sell-alias.component.html',
    styleUrls: ['./sell-alias.component.scss']
})
export class SellAliasComponent implements OnInit {
    openBookMarks: boolean = false;
    data: any;
    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    sellAliasForm = {
        name: '',
        uri: '',
        recipientRS: '',
        price: null
    }

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
            if (!params.alias) {
                this._location.back();
            } else {
                this.data = {
                    'aliasName': params.aliasName,
                    'aliasURI': params.aliasURI
                }
            }
        })
        this.sellAliasForm.uri = this.data.aliasURI;
        this.sellAliasForm.name = this.data.aliasName;
    }

    bookmarkSelected(e) {
        this.sellAliasForm.recipientRS = e.data.account;
        this.openBookMarks = false;
    }

    loadBookmarkView() {
        this.openBookMarks = true;
    }

    hideBookmark() {
        this.openBookMarks = false;
    }

    searchAliases() {
        this.aliasesService.searchAlias(this.sellAliasForm.recipientRS).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.sellAliasForm.recipientRS.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.sellAliasForm.recipientRS = accountRS;
                        break;
                    }
                }
            }
        });
    }

    sellAlias() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const aliasName = this.sellAliasForm.name;
        const recipientRS = this.sellAliasForm.recipientRS || '';
        const price = this.amountToQuant.transform(this.sellAliasForm.price);
        const fee = 1;
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.aliasesService.sellAlias(publicKey, aliasName, recipientRS, price, fee)
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
                            this.router.navigate(['/aliases/show-alias']);
                        });
                }
            });
    };

    goBack() {
        this._location.back();
    }

}
