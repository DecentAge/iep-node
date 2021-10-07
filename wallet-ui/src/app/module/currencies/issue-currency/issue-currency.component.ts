import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../currencies.service';
import { AccountService } from '../../account/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../../config/constants';
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { SessionStorageService } from '../../../services/session-storage.service';
import { CryptoService } from '../../../services/crypto.service';
import { OptionService } from '../../../services/option.service';
import { Location } from '@angular/common';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-issue-currency',
    templateUrl: './issue-currency.component.html',
    styleUrls: ['./issue-currency.component.scss']
})
export class IssueCurrencyComponent implements OnInit {

    currencyId: any;
    issueCurrencyForm: any = {};
    issueCurrencyForm2: any = {
        decimals: 0,
        minAmount: 0,
        reserveSupply: 0,
        types: []
    };
    currencyTypes = [1, 2, 4, 8, 32];

    accountId = '';
    accountRs = '';

    reservable: boolean = false;
    currentHeight: any;

    transactionBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    validBytes: any;

    unsignedTx: boolean;

    constructor(public currenciesService: CurrenciesService,
        public route: ActivatedRoute,
        public router: Router,
        public accountService: AccountService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public _location: Location,
        public commonService: CommonService) {
    }

    ngOnInit() {
        this.currencyTypes.forEach((e) => {
            this.issueCurrencyForm2.types[e] = false;
        })
    }

    onInitialSupplyChange() {
        if (this.issueCurrencyForm2) {
            this.issueCurrencyForm2.maxSupply = this.issueCurrencyForm2.initialSupply;
        }
    }

    onTypesChange(currencyTypes) {

        if (currencyTypes) {
            if (currencyTypes[1]) {
                //Exchangeable
            }
            if (currencyTypes[2]) {
                //controllable
            }

            if (currencyTypes[4]) {
                //reservable
                this.reservable = true;
                currencyTypes[8] = true;

            } else {
                currencyTypes[8] = false;
                this.reservable = false;
            }
            if (currencyTypes[8]) {
                this.reservable = true;

                if (!currencyTypes[4]) {
                    currencyTypes[4] = true;
                }

                this.issueCurrencyForm2.initialSupply = 0;
            }
        }
    }

    getBlockChainStatus() {
        this.currenciesService.getBlockChainStatus().subscribe((success) => {
            this.currentHeight = success.numberOfBlocks;
            this.issueCurrencyForm2.activHeight = this.currentHeight;
        });
    };

    removeElementFromArray(array, elem) {
        if (array) {
            var length = array.length;
            for (var i = 0; i < length; i++) {
                array[i].selected = false;
            }
        }
    }

    hasElement(array, value) {
        if (array) {
            var length = array.length;
            for (var i = 0; i < length; i++) {
                return array[i].selected;
            }
        }
        return false;
    }

    sumArray(json) {
        var sum = 0;
        if (json) {
            for (var key in json) {
                if (json.hasOwnProperty(key) && json[key]) {
                    sum = sum + parseInt(key);
                }
            }

        }
        return sum;
    }

    validateAndMoveNextStep() {
        var issueCurrencyForm2 = this.issueCurrencyForm2;
        var typesArray = issueCurrencyForm2.types;
        var type = this.sumArray(issueCurrencyForm2.types);
        if (!(type > 0)) {
            let title: string = this.commonService.translateAlertTitle('Error');
            let msg: string = this.commonService.translateInfoMessage('issue-currency-select-currency-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'error').then((isConfirm: any) => {
                });
            return;
        }
        // $scope.$nextStep();
    }

    issueCurrency() {
        var issueCurrencyForm = this.issueCurrencyForm;
        var issueCurrencyForm2 = this.issueCurrencyForm2;
        var name = issueCurrencyForm.name;
        var code = issueCurrencyForm.code.toUpperCase();
        var description = issueCurrencyForm.description;
        var decimals = parseInt(issueCurrencyForm2.decimals);
        var initialSupply = parseInt(issueCurrencyForm2.initialSupply) * Math.pow(10, decimals);
        var maxSupply = parseInt(issueCurrencyForm2.maxSupply) * Math.pow(10, decimals);
        var type = this.sumArray(issueCurrencyForm2.types);

        var activHeight = 0;
        var minAmount: any = '';
        var reserveSupply: any = '';

        if (type & (1 << 2)) {
            activHeight = parseInt(issueCurrencyForm2.activHeight);
            minAmount = parseInt(issueCurrencyForm2.minAmount) * 100000000;
            reserveSupply = parseInt(issueCurrencyForm2.reserveSupply) * Math.pow(10, decimals);
        }

        var fee = 1;

        var publicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        var secret = this.issueCurrencyForm.secretPhrase;
        var secretPhraseHex;

        if (secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
        } else {
            secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.currenciesService.issueCurrency(publicKey, name, code, description, type,
            initialSupply, maxSupply,
            decimals, fee, minAmount, activHeight, reserveSupply)
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
            });

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
                        this.route.params.subscribe(params => {
                            this.router.navigate(['currencies/show-currencies/my']);
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
}
