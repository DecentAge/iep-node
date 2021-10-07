import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { AppConstants } from '../../../../config/constants';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { CurrenciesService } from '../../../currencies/currencies.service';
import { CryptoService } from '../../../../services/crypto.service';
import { AliasesService } from '../../../aliases/aliases.service';
import { OptionService } from '../../../../services/option.service';
import * as alertFunctions from '../../../../shared/data/sweet-alerts';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-send-simple',
    templateUrl: './send-simple.component.html',
    styleUrls: ['./send-simple.component.scss']
})
export class SendSimpleComponent implements OnInit {

    t: any;
    currentJustify = 'fill';
    currentOrientation = 'horizontal';

    public hasPrivateMessage: boolean;
    public hasReceiverPublicKey: boolean;
    sendForm = {
        recipientRS: '',
        amount: null,
        fee: 0,
        secret: '',
        message: '',
        pubkey: '',
    }
    accountDetails: any = '';
    validForm = false;
    validBytes = false;
    hasPublicKeyAdded = false;
    hasMessageAdded = false;
    encrypted: any = '';
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    openBookMarks: boolean = false;
    selectedLanguage: string;

    constructor(public sessionStorageService: SessionStorageService,
        public accountService: AccountService,
        public cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public aliasesService: AliasesService,
        public currenciesService: CurrenciesService,
        public optionService: OptionService,
        public translate: TranslateService,
        public commonService: CommonService) {
        this.hasPrivateMessage = false;
        this.hasReceiverPublicKey = false;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.recipient) {
                this.sendForm.recipientRS = params.recipient;
            }
        });
    }

    setMessage() {
        this.hasPrivateMessage = !this.hasPrivateMessage;
        if (!this.hasPrivateMessage) {
            this.sendForm.message = '';
        }
    }

    setPublicKey() {
        this.hasReceiverPublicKey = !this.hasReceiverPublicKey;
        if (!this.hasReceiverPublicKey) {
            this.sendForm.pubkey = '';
        }
    }

    bookmarkSelected(e) {
        //this.sendForm.recipientRS = e.data.account;
        this.openBookMarks = false;
    }

    loadBookmarkView() {
        this.router.navigate(['/account/send/bookmark-list-only'], { queryParams: { fromView: 'simple' } });
        //this.openBookMarks = true;
    }

    goBack() {
        this.openBookMarks = false;
    }

    searchAliases() {
        this.aliasesService.searchAlias(this.sendForm.recipientRS).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.sendForm.recipientRS.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.sendForm.recipientRS = accountRS;
                        break;
                    }
                }
            }
        });
    };

    createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
        this.accountService.createTransaction(
            transactionOptions.senderPublicKey,
            transactionOptions.recipientRS,
            transactionOptions.amount,
            1,
            transactionOptions.data,
            transactionOptions.nonce,
            transactionOptions.recipientPublicKey
        ).subscribe((success_) => {
            success_.subscribe((success) => {
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

        this.validBytes = false;

        let recipientRS = this.sendForm.recipientRS;
        let amount = this.amountToQuant.transform(this.sendForm.amount);

        let fee = this.sendForm.fee;
        let secret = this.sendForm.secret;

        let message = this.sendForm.message;
        let pubkey = this.sendForm.pubkey;

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

                if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateInfoMessage('send-simple-visible-key-error-msg');
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                        });
                    return;
                }

                if (!recipientPublicKey && !hasPublicKeyAdded) {
                    let title: string = this.commonService.translateAlertTitle('info');
                    let msg: string = this.commonService.translateInfoMessage('send-simple-account-outbound-transaction-info-msg');
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'info').then((isConfirm: any) => {
                        });
                }

                let encrypted: any = { data: '', nonce: '' };
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
                    'amount': amount,
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
                    'error').then((isConfirm: any) => {

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
                        this.router.navigate(['/account/transactions/pending']);
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
}
