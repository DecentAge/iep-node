import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { SubscriptionService } from '../subscription.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AppConstants } from '../../../config/constants';
import { CryptoService } from '../../../services/crypto.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { AccountService } from '../../account/account.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { AliasesService } from '../../aliases/aliases.service';

@Component({
    selector: 'app-create-subscription',
    templateUrl: './create-subscription.component.html',
    styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit {

    subscriptionForm: any = {
        recipientRS: '',
        amount: 0,
        interval: ''
    };
    accountDetails: any;
    data: any;

    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    openBookMarks: boolean = false;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private _location: Location,
        private subscriptionService: SubscriptionService,
        private sessionStorageService: SessionStorageService,
        public amountToQuant: AmountToQuantPipe,
        private cryptoService: CryptoService,
        public accountService: AccountService,
        public aliasesService: AliasesService,
        public activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.recipient) {
                this.subscriptionForm.recipientRS = params.recipient;
            }
        });
    }

    bookmarkSelected(e) {
        this.subscriptionForm.recipientRS = e.data.account;
        this.openBookMarks = false;
    }

    searchAliases() {
        this.aliasesService.searchAlias(this.subscriptionForm.recipientRS).subscribe((success) => {
            var aliases = success.aliases || [];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                if (alias.aliasName.toUpperCase() === this.subscriptionForm.recipientRS.toUpperCase()) {
                    var aliasURI = alias.aliasURI;
                    var aliasType = aliasURI.split(':');
                    if (aliasType[0] === 'acct') {
                        var accountRS = aliasType[1].split('@')[0];
                        this.subscriptionForm.recipientRS = accountRS;
                        break;
                    }
                }
            }
        });
    }

    createSubscription() {

        const recipientRS = this.subscriptionForm.recipientRS;
        const amountTQT = this.amountToQuant.transform(this.subscriptionForm.amount);
        const frequency = parseInt(this.subscriptionForm.interval) * 86400;

        const fee = 1;

        const senderPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.accountService.getAccountDetails(recipientRS).subscribe((success) => {
            const recipientPublicKey = success['publicKey'];
            if (!success['errorCode'] || success['errorCode'] === 5) {
                this.accountDetails = success;
                if (!recipientPublicKey) {
                    let title: string = this.commonService.translateAlertTitle('Success');
                    let msg: string = this.commonService.translateInfoMessage('create-subscription-outbound transaction-msg');
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'success').then((isConfirm: any) => {
                        });
                }

                this.subscriptionService.createSubscription(
                    senderPublicKey,
                    recipientRS,
                    amountTQT,
                    frequency,
                    fee
                ).subscribe((_success) => {
                    _success.subscribe(result => {
                        if (!result.errorCode) {
                            const unsignedBytes = result.unsignedTransactionBytes;
                            const signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            this.validBytes = true;

                            this.tx_fee = result.transactionJSON.feeTQT / 100000000;
                            this.tx_amount = result.transactionJSON.amountTQT / 100000000;
                            this.tx_total = this.tx_fee + this.tx_amount;

                        } else {
                            let title: string = this.commonService.translateAlertTitle('Error');
                            let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
                                result);
                            alertFunctions.InfoAlertBox(title,
                                errMsg,
                                'OK',
                                'error').then((isConfirm: any) => {
                                });
                        }
                    })


                }, (err) => {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
                        err);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                        });
                });

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
                            this.router.navigate(['/subscriptions/my-subscriptions']);
                        });
                } else {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessage('unable-broadcast-transaction', success);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                            this.router.navigate(['/subscriptions/create-subscription']);
                        });
                }


            });
    };

    loadBookmarkView() {
        // this.openBookMarks = true;
        this.router.navigate(['/account/send/bookmark-list-only'], { queryParams: { fromView: 'create-subscription' } });

    }

    goBack() {
        this.openBookMarks = false;
    }

}
