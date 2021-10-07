import { Component, OnInit } from '@angular/core';
import { AtService } from '../at.service';
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { AccountService } from '../../account/account.service';
import { AppConstants } from '../../../config/constants';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CryptoService } from '../../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-create-at',
    templateUrl: './create-at.component.html',
    styleUrls: ['./create-at.component.scss']
})
export class CreateAtComponent implements OnInit {

    createAtForm: any = {
        minActivationAmount: 0,
        uspages: 0,
        cspages: 0,
        dpages: 0,
        code: ''
    };
    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;
    hasMachineData: boolean;
    hasCreationBytes: boolean;
    unsignedTx: boolean;

    constructor(private atService: AtService,
        private accountService: AccountService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private router: Router,
        private commonService: CommonService) { }

    ngOnInit() {
    }

    createAT() {

        var name = this.createAtForm.name;
        var description = this.createAtForm.description;
        var minActivationAmountTQT = parseInt((this.createAtForm.minActivationAmount * AppConstants.baseConfig.TOKEN_QUANTS) + '');
        var code = this.createAtForm.code;
        var data = this.createAtForm.data || '';
        var creationBytes = this.createAtForm.bytes || '';
        var dpages = this.createAtForm.dpages;
        var cspages = this.createAtForm.cspages;
        var uspages = this.createAtForm.uspages;

        var fee = 1;
        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.createAtForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.atService.createATProgram(
            publicKey,
            name,
            description,
            creationBytes,
            code,
            data,
            dpages,
            cspages,
            uspages,
            minActivationAmountTQT,
            fee).subscribe((success_) => {

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
                        this.router.navigate(['/at/show-ats/my']);
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
