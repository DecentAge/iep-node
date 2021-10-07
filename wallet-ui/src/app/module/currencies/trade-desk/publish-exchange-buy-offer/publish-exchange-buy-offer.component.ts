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
import { OptionService } from '../../../../services/option.service';
import { ShareToQuantityPipe } from '../../../../pipes/share-to-quantity.pipe';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-publish-exchange-buy-offer',
    templateUrl: './publish-exchange-buy-offer.component.html',
    styleUrls: ['./publish-exchange-buy-offer.component.scss']
})
export class PublishExchangeBuyOfferComponent implements OnInit {

    constructor(public router: Router,
        public route: ActivatedRoute,
        public currenciesService: CurrenciesService,
        public accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public shareToQuantityPipe: ShareToQuantityPipe,
        public amountToQuantPipe: AmountToQuantPipe,
        public optionService: OptionService,
        public _location: Location,
        public commonService: CommonService) {
    }

    publishExchangeOfferForm: any = {};
    accountControl: any = {};
    expirationHeight = 1440;
    days = 1;

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;

    ngOnInit() {
        this.publishExchangeOfferForm = DataStoreService.get('publish-exchange-buy-offer');

        if (!this.publishExchangeOfferForm) {
            this.route.params.subscribe(params => {
                this.router.navigate(['/currencies/trade', params['id']]);
            });
        } else {
            this.checkControlEnabled();
            this.getBlockChainStatus();
        }
    }

    checkControlEnabled() {
        this.accountControl.hasControl = this.sessionStorageService.getFromSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);
        this.accountControl.controlDetails = this.sessionStorageService.getFromSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY);
        this.accountControl.phasingFinishHeight = this.optionService.getOption('TX_HEIGHT', '');
        this.publishExchangeOfferForm.expirationHeight = this.accountControl.phasingFinishHeight || 1440;
    };

    getBlockChainStatus() {
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.publishExchangeOfferForm.currentHeight = success.numberOfBlocks;
        });
    };

    increment() {
        if (this.expirationHeight >= 14400) {
            this.expirationHeight = 14400;
            return;
        } else {
            this.expirationHeight = this.expirationHeight + 1440;
        }

        this.publishExchangeOfferForm.expirationHeight = this.expirationHeight;
        this.days = parseInt((this.expirationHeight / 1440) + '');
    };

    decrement() {
        if (this.expirationHeight <= 1440) {
            this.expirationHeight = 1440;
            return;
        } else {
            this.expirationHeight = this.expirationHeight - 1440;
        }

        this.publishExchangeOfferForm.expirationHeight = this.expirationHeight;
        this.days = parseInt((this.expirationHeight / 1440) + '');
    };

    max() {
        this.expirationHeight = 14400;
        this.publishExchangeOfferForm.expirationHeight = 14400;

        this.days = parseInt((this.expirationHeight / 1440) + '');

    };

    min() {
        this.expirationHeight = 1440;
        this.publishExchangeOfferForm.expirationHeight = 1440;
        this.days = parseInt((this.expirationHeight / 1440) + '');
    };


    publishExchangeOffer() {

        var publishExchangeOfferForm = this.publishExchangeOfferForm;
        var currency = publishExchangeOfferForm.currencyId;
        var limits: any = {};

        publishExchangeOfferForm.sellRate = publishExchangeOfferForm.buyRate;
        publishExchangeOfferForm.sellLimit = 0;
        publishExchangeOfferForm.initialSellSupply = 0;
        publishExchangeOfferForm.buyLimit = publishExchangeOfferForm.initialBuySupply;

        limits.buyRate = parseInt((this.amountToQuantPipe.transform(publishExchangeOfferForm.buyRate) / Math.pow(10, publishExchangeOfferForm.decimals)) + '');
        limits.sellRate = parseInt((this.amountToQuantPipe.transform(publishExchangeOfferForm.sellRate) / Math.pow(10, publishExchangeOfferForm.decimals)) + '');

        limits.totalBuy = parseInt((publishExchangeOfferForm.buyLimit * Math.pow(10, publishExchangeOfferForm.decimals)) + '');
        limits.totalSell = parseInt((publishExchangeOfferForm.sellLimit * Math.pow(10, publishExchangeOfferForm.decimals)) + '');

        var supply: any = {};

        supply.initialBuy = parseInt((publishExchangeOfferForm.initialBuySupply * Math.pow(10, publishExchangeOfferForm.decimals)) + '');
        supply.initialSell = parseInt((publishExchangeOfferForm.initialSellSupply * Math.pow(10, publishExchangeOfferForm.decimals)) + '');

        var expirationHeight = parseInt(publishExchangeOfferForm.expirationHeight) + parseInt(publishExchangeOfferForm.currentHeight);

        this.publishExchangeOfferForm.expirationHeight = expirationHeight;

        var fee = 1;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.publishExchangeOfferForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.currenciesService.publishExchangeOffer(publicKey, currency, limits,
            supply, expirationHeight, fee)
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
