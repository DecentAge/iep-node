import { Component, OnInit } from '@angular/core';
import { ShufflingService } from '../shuffling.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { CurrenciesService } from '../../currencies/currencies.service';
import { AssetsService } from '../../assets/assets.service';
import { AccountService } from '../../account/account.service';
import { AppConstants } from '../../../config/constants';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CryptoService } from '../../../services/crypto.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { ShareToQuantityPipe } from '../../../pipes/share-to-quantity.pipe';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-create-shuffling',
    templateUrl: './create-shuffling.component.html',
    styleUrls: ['./create-shuffling.component.scss']
})
export class CreateShufflingComponent implements OnInit {

    createShuffleForm: any = {
        finishHeight: 1440,
        amount: 1000,
        minNumberOfOptions: 3
    };
    finishHeight = 1440;
    isLocalhostOrTestnet: boolean = false;
    holdingOptions = [
        { label: 'XIN', value: '0' },
        { label: 'Asset', value: '1' },
        { label: 'Currency', value: '2' }
    ];
    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;
    currencyError: string = '';
    assetError: string = '';
    unsignedTx: boolean;

    constructor(private shufflingService: ShufflingService,
        private currenciesService: CurrenciesService,
        private assetsService: AssetsService,
        private accountService: AccountService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private amountToQuantPipe: AmountToQuantPipe,
        private shareToQuantityPipe: ShareToQuantityPipe,
        private router: Router,
        private commonService: CommonService) {
        this.createShuffleForm.holdingType = this.holdingOptions[0].value;
    }

    ngOnInit() {
        this.isLocalhostOrTestnet = this.shufflingService.isLocalHostOrTestnet() || false;
        if (!this.isLocalhostOrTestnet) {

            const title: string = this.commonService.translateAlertTitle('Error');
            const msg: string = this.commonService.translateInfoMessage('create-shuffle-localhost-mandatory-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error').then((isConfirm: any) => {
                });
        }
    }

    increment() {
        if (this.finishHeight >= 20000) {
            this.finishHeight = 20000;
            return;
        } else {
            this.finishHeight = this.finishHeight + 1440;
        }

        this.createShuffleForm.finishHeight = this.finishHeight;
    }

    decrement() {
        if (this.finishHeight <= 1440) {
            this.finishHeight = 1440;
            return;
        } else {
            this.finishHeight = this.finishHeight - 1440;
        }

        this.createShuffleForm.finishHeight = this.finishHeight;
    }

    max() {
        this.finishHeight = 20000;
        this.createShuffleForm.finishHeight = 20000;
    }

    min() {
        this.finishHeight = 1440;
        this.createShuffleForm.finishHeight = 1440;
    }

    getAsset(assetId) {
        this.assetsService.getAsset(assetId).subscribe((success: any) => {
            if (!success.errorCode) {
                this.createShuffleForm.asset = success;
                this.createShuffleForm.assetId = success.asset;
                this.createShuffleForm.holding = success.currency;
                this.assetError = '';
            } else {
                this.assetError = success.errorDescription.replace('&#34;', '"').replace('&#34;', '"');
            }
        });
    }

    getCurrency(currencyCode) {
        this.currenciesService.getCurrency(currencyCode).subscribe((success: any) => {
            // this.createShuffleForm.currency = success;
            if (!success.errorCode) {
                this.createShuffleForm.currency = success;
                this.createShuffleForm.code = success.code;
                this.createShuffleForm.holding = success.currency;
                this.currencyError = '';
            } else {
                this.currencyError = success.errorDescription.replace('&#34;', '"').replace('&#34;', '"');
            }
        });
    };

    getBlockChainStatus() {
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.createShuffleForm.currentHeight = success.numberOfBlocks;
        });
    };

    createShuffle() {

        var shuffleJson: any = {};

        shuffleJson.amount = this.createShuffleForm.amount;
        shuffleJson.holdingType = this.createShuffleForm.holdingType;
        shuffleJson.holding = this.createShuffleForm.holding;
        shuffleJson.participantCount = this.createShuffleForm.participantCount;

        if (shuffleJson.holdingType === '2') {
            shuffleJson.holding = this.createShuffleForm.holding;
            shuffleJson.amount = this.shareToQuantityPipe.transform(shuffleJson.amount, this.createShuffleForm.currency.decimals);
        } else if (shuffleJson.holdingType === '1') {
            shuffleJson.holding = this.createShuffleForm.assetId;
            shuffleJson.amount = this.shareToQuantityPipe.transform(shuffleJson.amount, this.createShuffleForm.asset.decimals);
        } else if (shuffleJson.holdingType === '0') {
            shuffleJson.amount = this.amountToQuantPipe.transform(shuffleJson.amount);
        }

        shuffleJson.fee = 1;

        shuffleJson.publicKey = this.accountService.getAccountDetailsFromSession('publicKey');

        shuffleJson.finishHeight = this.createShuffleForm.finishHeight;

        var secret = this.createShuffleForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        if (this.isLocalhostOrTestnet) {
            this.shufflingService.createShuffling(
                shuffleJson.publicKey,
                shuffleJson.amount,
                shuffleJson.participantCount,
                shuffleJson.finishHeight,
                shuffleJson.holding,
                shuffleJson.holdingType,
                shuffleJson.fee)
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
        } else {
            const title: string = this.commonService.translateAlertTitle('Error');
            const msg: string = this.commonService.translateInfoMessage('shuffling-connection-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error').then((isConfirm: any) => {
                });
        }
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
                        this.router.navigate(['/shuffling/show-shufflings/my']);
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
