import { Component, OnInit } from '@angular/core';
import { FeeService } from '../../../services/fee.service';
import { AppConstants } from '../../../config/constants';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AccountService } from '../../account/account.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { MessageService } from '../message.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { AliasesService } from '../../aliases/aliases.service';
import { Location } from '@angular/common';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-send-message',
    templateUrl: './send-message.component.html',
    styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

    public hasReceiverPublicKey: boolean;
    validBytes = false;
    hasPublicKeyAdded = false;
    hasMessageAdded = false;
    sendMessageForm: any = {
        recipientRS: '',
        prunable: '',
        message: '',
        pubkey: ''
    };
    openBookMarks: boolean = false;
    isPrunable = [
        { label: 'On Chain (160 chars.)', value: 'false' },
        { label: 'Off Chain (24k chars.)', value: 'true' }
    ];
    accountDetails: any = '';
    encrypted: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    transactionBytes: any;
    prunableAttachmentJSON: any;
    prunableAttachmentString: any;
    unsignedTx: any;
    aMessage: any;
    aprunableAttachmentJSON: any;

    constructor(public feeService: FeeService,
        public sessionStorageService: SessionStorageService,
        public accountService: AccountService,
        public cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        public messageService: MessageService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public aliasesService: AliasesService,
        private _location: Location,
        public commonService: CommonService) {
        this.hasReceiverPublicKey = false;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.recipient) {
                this.sendMessageForm.recipientRS = params.recipient;
            }
        });
        this.sendMessageForm.prunable = this.isPrunable[0].value;
    }

    setPublicKye() {
        this.hasReceiverPublicKey = !this.hasReceiverPublicKey;
        if (!this.hasReceiverPublicKey) {
            this.sendMessageForm.pubkey = '';
        }
    }

    onChangeMessageInfo(e) {
        let totalFee = this.feeService.getSetAccountFee(this.sendMessageForm.message);

        if (!this.sendMessageForm.fee || this.sendMessageForm.fee < totalFee) {
            this.sendMessageForm.fee = totalFee;
        }
    }

    bookmarkSelected(e) {
        this.sendMessageForm.recipientRS = e.data.account;
        this.openBookMarks = false;
    }

    loadBookmarkView() {
        this.router.navigate(['/account/send/bookmark-list-only'], { queryParams: { fromView: 'sendmessage' } });

    }

    goBack() {
        this._location.back();
        this.openBookMarks = false;
    }

    searchAliases() {
        this.aliasesService.searchAlias(this.sendMessageForm.recipientRS).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.sendMessageForm.recipientRS.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.sendMessageForm.recipientRS = accountRS;
                        break;
                    }
                }
            }
        });
    };

    createAndSignTransaction(transactionOptions, secretPhraseHex) {
        this.messageService.sendMessage(
            transactionOptions.senderPublicKey,
            transactionOptions.recipientRS,
            1,
            transactionOptions.data,
            transactionOptions.nonce,
            transactionOptions.recipientPublicKey,
            transactionOptions.prunable
        ).subscribe((success_) => {
            success_.subscribe((success) => {
                if (!success.errorCode) {
                    let unsignedBytes = success.unsignedTransactionBytes;
                    let signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                    let transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);

                    this.transactionBytes = transactionBytes;

                    this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                    this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                    this.tx_total = this.tx_fee + this.tx_amount;

                    this.prunableAttachmentJSON = success.transactionJSON.attachment;
                    this.prunableAttachmentString = JSON.stringify(success.transactionJSON.attachment);

                    this.validBytes = true;

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
            });
        });
    };

    getAndVerifyAccount(sendTokenForm) {

        let recipientRS = this.sendMessageForm.recipientRS;
        let fee = 1; // sendForm.fee;
        let secret = this.sendMessageForm.secretPhrase;

        let message = this.sendMessageForm.message;
        let pubkey = this.sendMessageForm.pubkey;
        let prunable = this.sendMessageForm.prunable;

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

        let senderPublicKey = this.messageService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex;
        if (hasSecretAdded) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.messageService.getAccountDetails(recipientRS).subscribe((success: any) => {

            let recipientPublicKey = success.publicKey;

            if (!recipientPublicKey && hasPublicKeyAdded) {
                recipientPublicKey = pubkey;
            }

            if (!success.errorCode || success.errorCode === 5) {

                this.accountDetails = success;

                if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let msg: string = this.commonService.translateInfoMessage('send-simple-account-outbound-transaction-info-msg');
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'error').then((isConfirm: any) => {
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
                    'fee': fee,
                    'data': encrypted.data,
                    'nonce': encrypted.nonce,
                    'recipientPublicKey': recipientPublicKey,
                    'prunable': prunable,
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

    broadcastMessage(transactionBytes, prunableAttachmentJSON) {
        this.messageService.broadcastMessage(transactionBytes, prunableAttachmentJSON).subscribe((success: any) => {

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
