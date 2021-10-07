import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../../../currencies.service';
import { AccountService } from '../../../../account/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../../../../config/constants';
import * as alertFunctions from "../../../../../shared/data/sweet-alerts";
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { CryptoService } from '../../../../../services/crypto.service';
import { OptionService } from '../../../../../services/option.service';
import { Location } from '@angular/common';
import { AliasesService } from '../../../../aliases/aliases.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
    selector: 'app-transfer-currency',
    templateUrl: './transfer-currency.component.html',
    styleUrls: ['./transfer-currency.component.scss']
})
export class TransferCurrencyComponent implements OnInit {

    currencyId: any;
    transferCurrencyForm: any = {};

    accountId = '';
    accountRs = '';

    openBookMarks: boolean = false;

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;

    constructor(public currenciesService: CurrenciesService,
        public route: ActivatedRoute,
        public router: Router,
        public accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public aliasesService: AliasesService,
        public _location: Location,
        public commonService: CommonService) {
    }

    ngOnInit() {
        this.getCurrency();
    }

    getCurrency() {

        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

        this.route.params.subscribe(params => {

            this.currencyId = params['id'];
            this.currenciesService.getCurrencyById(this.currencyId).subscribe((success) => {

                this.transferCurrencyForm.currencyId = success.currency;
                this.transferCurrencyForm.decimals = success.decimals;
                this.transferCurrencyForm.ticker = success.code;

            });
        })
    }

    loadBookmarkView() {
        this.openBookMarks = true;
    }

    goBack() {
        this._location.back();
        this.openBookMarks = false;
    }

    bookmarkSelected(e) {
        this.transferCurrencyForm.recipient = e.data.account;
        this.openBookMarks = false;
    }

    searchAliases() {
        this.aliasesService.searchAlias(this.transferCurrencyForm.recipient).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.transferCurrencyForm.recipient.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.transferCurrencyForm.recipient = accountRS;
                        break;
                    }
                }
            }
        });
    }

    transferCurrency() {
        var transferCurrencyForm = this.transferCurrencyForm;
        var currency = transferCurrencyForm.currencyId;
        var units = parseInt((transferCurrencyForm.units * Math.pow(10, transferCurrencyForm.decimals)) + '');
        var fee = 1;
        var recipientRS = transferCurrencyForm.recipient;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.transferCurrencyForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.currenciesService.transferCurrency(publicKey, recipientRS, currency,
            units, fee)
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
    }

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
                            this.router.navigate(['currencies/show-currencies/my']);
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
}