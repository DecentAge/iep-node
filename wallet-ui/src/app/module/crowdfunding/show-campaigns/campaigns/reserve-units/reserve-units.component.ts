import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from '../../../../../services/data-store.service';
import { Location } from '@angular/common';
import { AccountService } from '../../../../account/account.service';
import { SessionStorageService } from "../../../../../services/session-storage.service";
import { AppConstants } from "../../../../../config/constants";
import { CryptoService } from "../../../../../services/crypto.service";
import { AmountToQuantPipe } from "../../../../../pipes/amount-to-quant.pipe";
import * as alertFunctions from "../../../../../shared/data/sweet-alerts";
import { CrowdfundingService } from '../../../crowdfunding.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
    selector: 'app-reserve-units',
    templateUrl: './reserve-units.component.html',
    styleUrls: ['./reserve-units.component.scss']
})
export class ReserveUnitsComponent implements OnInit {

    validBytes = false;
    reserveUnitsForm: any = {};
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    transactionBytes: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private _location: Location,
        private accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        public crowdfundingService: CrowdfundingService,
        public commonService: CommonService) { }

    ngOnInit() {
        this.reserveUnitsForm = DataStoreService.get('reserve-units');
        if (!this.reserveUnitsForm) {
            this._location.back();
        } else {
            this.reserveUnitsForm.amountTotal = 0;
            this.reserveUnitsForm.amountUnit = 0;
            this.reserveUnitsForm.fee = 1;
        }
    }

    onAmountChange(amountTotal) {
        this.reserveUnitsForm.amountUnit = amountTotal / this.reserveUnitsForm.reserveSupply;
    }

    getAndVerifyAccount() {

        let goal = this.amountToQuant.transform(this.reserveUnitsForm.reserveSupply * this.reserveUnitsForm.minReservePerUnitTQT);
        let raised = this.amountToQuant.transform(this.reserveUnitsForm.reserveSupply * this.reserveUnitsForm.minReservePerUnitTQT);
        let amountPerUnitTQT = parseInt((this.reserveUnitsForm.amountUnit * 100000000) + "");
        let senderPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.crowdfundingService.setCampaignReserve(
            this.reserveUnitsForm.id,
            amountPerUnitTQT,
            senderPublicKey
        ).subscribe((success_) => {

            success_.subscribe((success) => {

                if (!success.errorCode) {
                    var unsignedBytes = success.unsignedTransactionBytes;
                    var signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                    this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                    this.validBytes = true;

                    this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                    this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                    this.tx_total = this.tx_fee + this.tx_amount;

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

            })

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
                        this.goBack();
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
