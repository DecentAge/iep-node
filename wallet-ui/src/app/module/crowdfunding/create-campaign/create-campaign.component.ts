import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { AccountService } from '../../account/account.service';
import { SessionStorageService } from "../../../services/session-storage.service";
import { AppConstants } from "../../../config/constants";
import { CryptoService } from "../../../services/crypto.service";
import { AmountToQuantPipe } from "../../../pipes/amount-to-quant.pipe";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { CrowdfundingService } from '../crowdfunding.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-create-campaign',
    templateUrl: './create-campaign.component.html',
    styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {

    validBytes = false;
    campaignForm: any = {
        issuanceHeight: 1440,
        day: 1440,
        hmax: 43200,
        days: 1,
        initialSupply: 0,
        reserveSupply: 0,
        minReservePerUnitTQT: 0,
        totalAmount: 0,
        decimals: 2
    };
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    transactionBytes: any;
    minReservePerUnitTotal: any;
    unsignedTx: boolean;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private _location: Location,
        private accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        public crowdfundingService: CrowdfundingService,
        public currenciesService: CurrenciesService,
        public commonService: CommonService) { }

    ngOnInit() {
    }

    changeMinAmount() {
        this.campaignForm.maxSupply = parseInt(this.campaignForm.reserveSupply);
        this.campaignForm.totalAmount = parseInt(this.campaignForm.reserveSupply) * this.campaignForm.minReservePerUnitTQT;
    }

    increment() {
        if (this.campaignForm.issuanceHeight >= this.campaignForm.hmax) {
            this.campaignForm.issuanceHeight = this.campaignForm.hmax;
            return;
        } else {
            this.campaignForm.issuanceHeight = this.campaignForm.issuanceHeight + this.campaignForm.day;
        }

        this.campaignForm.issuanceHeight = this.campaignForm.issuanceHeight;
        this.campaignForm.days = parseInt((this.campaignForm.issuanceHeight / this.campaignForm.day) + "");
    };

    decrement() {
        if (this.campaignForm.issuanceHeight <= this.campaignForm.day) {
            this.campaignForm.issuanceHeight = this.campaignForm.day;
            return;
        } else {
            this.campaignForm.issuanceHeight = this.campaignForm.issuanceHeight - this.campaignForm.day;
        }

        this.campaignForm.issuanceHeight = this.campaignForm.issuanceHeight;
        this.campaignForm.days = parseInt((this.campaignForm.issuanceHeight / this.campaignForm.day) + "");
    };

    max() {
        this.campaignForm.issuanceHeight = this.campaignForm.hmax;
        this.campaignForm.issuanceHeight = this.campaignForm.hmax;

        this.campaignForm.days = parseInt((this.campaignForm.issuanceHeight / this.campaignForm.day) + "");

    };

    min() {
        this.campaignForm.issuanceHeight = this.campaignForm.day;
        this.campaignForm.issuanceHeight = this.campaignForm.day;
        this.campaignForm.days = parseInt((this.campaignForm.issuanceHeight / this.campaignForm.day) + "");
    };

    getBlockChainStatus() {
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.campaignForm.currentHeight = success.numberOfBlocks;
        });
    };

    createCampaign() {

        var name = this.campaignForm.name;
        var code = this.campaignForm.code.toUpperCase();
        var desc = this.campaignForm.desc;

        var decimals = 0;
        var initialSupply = parseInt(this.campaignForm.initialSupply) * Math.pow(10, decimals);
        var issuanceHeight = parseInt(this.campaignForm.issuanceHeight) + parseInt(this.campaignForm.currentHeight);
        var minReservePerUnitTQT = (this.campaignForm.minReservePerUnitTQT) * 100000000;
        var reserveSupply = parseInt(this.campaignForm.reserveSupply) * Math.pow(10, decimals);
        var maxSupply = reserveSupply;
        var type = 5;

        this.minReservePerUnitTotal = (maxSupply * minReservePerUnitTQT) / 100000000;

        var fee = 1;

        var publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        var secret = this.campaignForm.secretPhrase;
        var secretPhraseHex;
        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex =
                this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.crowdfundingService.createCampaign(
            publicKey,
            name,
            code,
            desc,
            type,
            initialSupply,
            reserveSupply,
            maxSupply,
            decimals,
            fee,
            minReservePerUnitTQT,
            issuanceHeight
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
                        this.router.navigate(['/crowdfunding/show-campaigns']);
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
