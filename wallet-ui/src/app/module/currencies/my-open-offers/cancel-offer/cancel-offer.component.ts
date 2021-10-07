import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../../currencies.service';
import { AccountService } from '../../../account/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../../../config/constants';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { SessionStorageService } from '../../../../services/session-storage.service';
import { CryptoService } from '../../../../services/crypto.service';
import { OptionService } from '../../../../services/option.service';
import { Location } from '@angular/common';
import { AliasesService } from '../../../aliases/aliases.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-cancel-offer',
    templateUrl: './cancel-offer.component.html',
    styleUrls: ['./cancel-offer.component.scss']
})
export class CancelOfferComponent implements OnInit {

    currencyId: any;
    cancelExchangeOfferForm: any = {};

    accountId = '';
    accountRs = '';

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

        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

        this.cancelExchangeOfferForm.buyRate = 0.00000001;
        this.cancelExchangeOfferForm.buyLimit = 1;
        this.cancelExchangeOfferForm.initialBuySupply = 1;
        this.cancelExchangeOfferForm.sellLimit = 1;
        this.cancelExchangeOfferForm.initialSellSupply = 1;

        this.route.queryParams.subscribe(params => {

            this.cancelExchangeOfferForm.currencyId = params.currency;
            this.cancelExchangeOfferForm.typeOnly = params.offerType;

            this.currenciesService.getCurrencyById(params.currency).subscribe((success) => {

                this.cancelExchangeOfferForm.code = success.code;
                this.cancelExchangeOfferForm.name = success.name;
                this.cancelExchangeOfferForm.decimals = success.decimals;

                this.cancelExchangeOffer();

            });
        })
    }

    getBlockChainStatus() {
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.cancelExchangeOfferForm.currentHeight = success.numberOfBlocks;
        });
    };

    cancelExchangeOffer() {

        var cancelExchangeOfferForm = this.cancelExchangeOfferForm;
        var currency = cancelExchangeOfferForm.currencyId;

        var limits: any = {};

        cancelExchangeOfferForm.sellRate = cancelExchangeOfferForm.buyRate;
        if (cancelExchangeOfferForm.typeOnly === 'BUY') {
            cancelExchangeOfferForm.sellLimit = 0;
            cancelExchangeOfferForm.initialSellSupply = 0;
        }
        if (cancelExchangeOfferForm.typeOnly === 'SELL') {
            cancelExchangeOfferForm.buyLimit = 0;
            cancelExchangeOfferForm.initialBuySupply = 0;
        }

        limits.buyRate = 1;
        limits.sellRate = 1;

        limits.totalBuy = parseFloat((cancelExchangeOfferForm.buyLimit * Math.pow(10, cancelExchangeOfferForm.decimals)) + '');
        limits.totalSell = parseFloat((cancelExchangeOfferForm.sellLimit * Math.pow(10, cancelExchangeOfferForm.decimals)) + '');

        var supply: any = {};

        supply.initialBuy = parseFloat((cancelExchangeOfferForm.initialBuySupply * Math.pow(10, cancelExchangeOfferForm.decimals)) + '');
        supply.initialSell = parseFloat((cancelExchangeOfferForm.initialSellSupply * Math.pow(10, cancelExchangeOfferForm.decimals)) + '');

        var fee = 1;

        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = cancelExchangeOfferForm.secretPhrase;
        var secretPhraseHex;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            var expirationHeight = success.numberOfBlocks + 2;
            this.currenciesService.publishExchangeOffer(publicKey, currency,
                limits, supply, expirationHeight, fee)
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
        });
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
                            this.router.navigate(['currencies/my-open-offers']);
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