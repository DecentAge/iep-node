import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VotingService } from '../../../voting.service';
import { CommonService } from '../../../../../services/common.service';
import { CryptoService } from '../../../../../services/crypto.service';
import { SessionStorageService } from '../../../../../services/session-storage.service';
import { AppConstants } from '../../../../../config/constants';
import * as AlertFunctions from '../../../../../shared/data/sweet-alerts';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-poll-vote',
    templateUrl: './poll-vote.component.html',
    styleUrls: ['./poll-vote.component.scss']
})
export class PollVoteComponent implements OnInit {
    poll: any;
    options: any[] = [];
    isStepOneFormValid: boolean = false;
    optionSelected: any[] = [];
    signatureHex: string;
    transactionBytes: string;
    transactionJSON: string;
    tx_fee: number;
    tx_amount: number;
    tx_total: number;
    validBytes: boolean;
    signedTx: boolean = true;

    constructor(private _location: Location,
        private route: ActivatedRoute,
        public votingService: VotingService,
        public commonService: CommonService,
        private cryptoService: CryptoService,
        public sessionStorageService: SessionStorageService,
        public translate: TranslateService) {
        this.poll = {
            options: []
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            this.getPollDetails(params.id);
        });
    }

    getPollDetails(pollId) {
        if (pollId != 'undefined') {
            this.votingService.getPoll(pollId).subscribe((pollDetails: any) => {
                this.poll = pollDetails;
                this.options = this.poll.options.map((option, index) => {
                    return {
                        index: index,
                        name: option,
                        value: false
                    }
                });
            });
        } else {
            this._location.back();
        }
    }

    handleOptions(option) {
        this.options[option].value = !this.options[option].value;

        this.optionSelected = this.options.filter((val, index) => {
            if (val.value) return val;
        }).map((value) => {
            return value.name;
        });

        if (this.poll.minNumberOfOptions <= this.optionSelected.length && this.poll.maxNumberOfOptions >= this.optionSelected.length) {
            this.isStepOneFormValid = true;
        } else {
            this.isStepOneFormValid = false;
        }
    }

    nextStep() {
        if (this.isStepOneFormValid) {
            this.castVote();
        } else {
            let title: string = this.commonService.translateAlertTitle('Error');
            let errMsg: string = this.commonService.translateInfoMessageWithParams('Poll option value error', this.poll);
            AlertFunctions.InfoAlertBox(title,
                errMsg,
                'OK',
                'error').then((isConfirm: any) => {
                });
        }
    }

    castVote() {
        let publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        let pollId = this.poll.poll;
        let options = this.optionSelected;
        let secret = this.poll.secretPhrase;
        let optionNames = this.votingService.getOptionNames(this.poll.options, options);
        let fee = 1;
        let secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.votingService.castVote(publicKey, pollId, optionNames, fee).subscribe((promise: any) => {
            promise.subscribe((success) => {
                if (!success.errorCode) {
                    this.signatureHex = this.cryptoService.signatureHex(success.unsignedTransactionBytes, secretPhraseHex);

                    this.transactionBytes = this.cryptoService.signTransactionHex(success.unsignedTransactionBytes, this.signatureHex);
                    this.transactionJSON = success.transactionJSON;

                    this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                    this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                    this.tx_total = this.tx_fee + this.tx_amount;

                    this.validBytes = true;
                } else {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
                    success);
                    AlertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                            this._location.back();
                        });
                }
            });

        });
    }

    broadcastTransaction(transactionBytes) {
        this.commonService.broadcastTransaction(this.transactionBytes).subscribe((success: any) => {
            if (!success.errorCode) {
                let title: string = this.commonService.translateAlertTitle('Success');
                let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                msg += success.transaction;
                AlertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'success').then((isConfirm: any) => {
                        this._location.back();
                    });
            } else {
                let title: string = this.commonService.translateAlertTitle('Error');
                let errMsg: string = this.commonService.translateErrorMessage('unable-broadcast-transaction', success);
                AlertFunctions.InfoAlertBox(title,
                    errMsg,
                    'OK',
                    'error').then((isConfirm: any) => {
                    });
            }
        })
    }

    signedTransaction() {
        this.signedTx = !this.signedTx;
    }

    goBack() {
        this._location.back();
    }
}
