import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { AliasesService } from '../../aliases/aliases.service';
import { AccountService } from '../account.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { AppConstants } from '../../../config/constants';
import { CurrenciesService } from '../../currencies/currencies.service';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-balance-lease',
    templateUrl: './balance-lease.component.html',
    styleUrls: ['./balance-lease.component.scss']
})
export class BalanceLeaseComponent implements OnInit {

    public hasPrivateMessage: boolean;
    public hasReceiverPublicKey: boolean;
    openBookMarks: boolean = false;
    minPeriod = 1440;
    blockheight = 1
    balanceLeaseForm: any = {
        'recipientRS': '',
        'period': 1440
    }
    accountDetails: any = {
    };

    validForm = false;
    validBytes = false;
    hasPublicKeyAdded = false;
    hasMessageAdded = false;
    encrypted: any = '';
    tx_fee: any;
    tx_amount: any;
    tx_total: any;

    constructor(public sessionStorageService: SessionStorageService,
        public accountService: AccountService,
        public cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        public router: Router,
        public currenciesService: CurrenciesService,
        public activatedRoute: ActivatedRoute,
        public aliasesService: AliasesService,
        public commonService: CommonService) {
        this.hasPrivateMessage = false;
        this.hasReceiverPublicKey = false;
    }
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.recipient) {
                this.balanceLeaseForm.recipientRS = params.recipient;
            }
        });
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.blockheight = parseInt(success.numberOfBlocks);
        });
    }
    min() {
        this.minPeriod = 1440;
        this.balanceLeaseForm.period = 1440;
    }
    max() {
        this.minPeriod = 65535;
        this.balanceLeaseForm.period = 65535;
    }
    decrement() {
        if (this.minPeriod <= 1440) {
            this.minPeriod = 1440;
            return;
        } else {
            this.minPeriod = this.minPeriod - 1440;
        }

        this.balanceLeaseForm.period = this.minPeriod;
    }
    increment() {
        if (this.minPeriod >= 20000) {
            this.minPeriod = 20000;
            return;
        } else {
            this.minPeriod = this.minPeriod + 1440;
        }

        this.balanceLeaseForm.period = this.minPeriod;
    }
    searchAliases() {
        this.aliasesService.searchAlias(this.balanceLeaseForm.recipientRS).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.balanceLeaseForm.recipientRS.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.balanceLeaseForm.recipientRS = accountRS;
                        break;
                    }
                }
            }
        });
    };

    createAndSignTransaction = function (transactionOptions, secretPhraseHex) {

        this.accountService.setBalanceLeasing(
            transactionOptions.senderPublicKey,
            transactionOptions.recipientRS,
            transactionOptions.period,
            transactionOptions.fee,
            transactionOptions.data,
            transactionOptions.nonce,
            transactionOptions.recipientPublicKey
        ).subscribe((success) => {
            success.subscribe((success) => {
                if (!success.errorCode) {
                    let unsignedBytes = success.unsignedTransactionBytes;
                    let signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                    let transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);

                    this.transactionBytes = transactionBytes;

                    this.validBytes = true;

                    this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                    this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                    this.tx_total = this.tx_fee + this.tx_amount;


                    return transactionBytes;
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
            })
        });
    };
    getAndVerifyAccount() {

        if (this.blockheight < AppConstants.baseConfig.LEASING_OFFSET_BLOCK) {
            let title: string = this.commonService.translateAlertTitle('Info');
            let errMsg: string = this.commonService.translateInfoMessage('balance-lease-start-block-error-msg');
            alertFunctions.InfoAlertBox(title,
                errMsg,
                'OK',
                'info').then(() => {
                });
            return;
        }

        let recipientRS = this.balanceLeaseForm.recipientRS;
        let period = this.balanceLeaseForm.period;
        let fee = this.balanceLeaseForm.fee;
        let secret = this.balanceLeaseForm.secretPhrase;

        let message = this.balanceLeaseForm.message;
        let pubkey = this.balanceLeaseForm.pubkey;

        let hasPublicKeyAdded = false;
        let hasMessageAdded = false;
        let hasSecretAdded = false;

        if (pubkey && pubkey.length > 0) {
            hasPublicKeyAdded = true;
        }
        if (message && message.length > 0) {
            hasMessageAdded = true;
        }
        if (secret && secret.length > 0) {
            hasSecretAdded = true;
        }

        if (!fee) {
            fee = 1;
        }

        this.hasPublicKeyAdded = hasPublicKeyAdded;
        this.hasMessageAdded = hasMessageAdded;

        let senderPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex;
        if (hasSecretAdded) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.accountService.getAccountDetails(recipientRS).subscribe((success: any) => {

            let recipientPublicKey = success.publicKey;

            if (!recipientPublicKey && hasPublicKeyAdded) {
                recipientPublicKey = pubkey;
            }

            if (!success.errorCode || success.errorCode === 5) {

                this.accountDetails = success;

                if (!recipientPublicKey && !hasPublicKeyAdded) {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let msg: string = this.commonService.translateInfoMessage('balance-lease-visible-key-error-msg');
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'error').then(() => {
                        });
                    return;
                }

                let encrypted = { data: '', nonce: '' };
                if (hasMessageAdded) {
                    if (!recipientPublicKey) {
                        recipientPublicKey = pubkey;
                    }
                    encrypted = this.cryptoService.encryptMessage(message, secretPhraseHex, recipientPublicKey);
                    this.encrypted = JSON.stringify(encrypted);
                } else {
                    this.encrypted = encrypted;
                }

                let transactionOptions = {
                    'senderPublicKey': senderPublicKey,
                    'recipientRS': recipientRS,
                    'period': period,
                    'fee': fee,
                    'data': encrypted.data,
                    'nonce': encrypted.nonce,
                    'recipientPublicKey': recipientPublicKey,
                };

                this.createAndSignTransaction(transactionOptions, secretPhraseHex);

                if (this.encrypted.data === '') {
                    this.encrypted = '';
                }

            } else {
                let title: string = this.commonService.translateAlertTitle('Error');
                let errMsg: string = this.commonService.translateErrorMessageParams( 'sorry-error-occurred',
                success);
                alertFunctions.InfoAlertBox(title,
                    errMsg,
                    'OK',
                    'error').then(() => {
                    });
            }
        });
    };

    broadcastTransaction = function (transactionBytes) {
        this.accountService.broadcastTransaction(transactionBytes).subscribe((success) => {

            if (!success.errorCode) {
                let title: string = this.commonService.translateAlertTitle('Success');
                let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                msg += success.transaction;
                alertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'success').then((isConfirm: any) => {
                       // this.router.navigate(['/account/transactions/pending']);
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

    loadBookmarkView() {
       // this.openBookMarks = true;
        this.router.navigate(['/account/send/bookmark-list-only'], { queryParams: { fromView: 'balance-lease' } });
    }
    bookmarkSelected(e) {
        this.balanceLeaseForm.recipientRS = e.data.account;
        this.openBookMarks = false;
    }

    goBack() {
        this.openBookMarks = false;
    }

}
