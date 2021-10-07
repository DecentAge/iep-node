import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AccountService } from '../account.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AppConstants } from '../../../config/constants';
import { AssetsService } from '../../assets/assets.service';
import { QuantToAmountPipe } from '../../../pipes/quant-to-amount.pipe';
import { CurrenciesService } from '../../currencies/currencies.service';
import { CryptoService } from "../../../services/crypto.service";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { FeeService } from "../../../services/fee.service";
import { TranslateService } from '@ngx-translate/core';
import {RootScope} from '../../../config/root-scope';


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})

export class DetailsComponent {
    accountCurrencyXmcValue = '';
    accountAssetXmcValue = '';
    publicKey = '';
    accountRs = '';
    controlDetected: boolean = false;
    multisigModel = '';
    controlVotingModel = '';
    controlQuorum = '';
    account: any = {
        accountRs: ''
    };
    multisig = 'standard';
    maxFees = '';
    minBalance = '';
    WhitelistAccountRS = '';
    whitelistedRS = '';
    setAccountParams = {
        name: '',
        description: '',
        secret: '',
        accountPublicKey: '',
        secretPhraseHex: '',
        fee: 1
    };
    leasesDetected: boolean = false;
    tx_fee = '';
    validBytes = false;
    signedTx = false;
    transactionBytes = '';

    openPublicKey: boolean = false;
    openBL: boolean = false;
    openCM: boolean = false;
    selectedLanguage: string;

    constructor(public commonsService: CommonService,
        public accountService: AccountService,
        public assetsService: AssetsService,
        public sessionStorageService: SessionStorageService,
        public quantToAmountPipe: QuantToAmountPipe,
        public currenciesService: CurrenciesService,
        public cryptoService: CryptoService,
        public translate: TranslateService,
        public feeService: FeeService) {
        this.getAccountDetails();
    }


    getAccountDetails = function () {

        this.getAssetsXmcValue();
        this.getCurrenciesXmcValue();

        let accountRS = this.accountService.getAccountDetailsFromSession('accountRs');
        this.accountService.getAccountDetails(accountRS).subscribe((success) => {

            // Account is unknown
            if (success.errorCode === 5) {
                success.publicKey = this.accountService.getAccountDetailsFromSession('publicKey');

                if (!success.balanceTQT) {
                    success.balanceTQT = 0;
                }
                if (!success.unconfirmedBalanceTQT) {
                    success.unconfirmedBalanceTQT = 0;
                }
                if (!success.forgedBalanceTQT) {
                    success.forgedBalanceTQT = 0;
                }
                if (!success.effectiveBalance) {
                    success.effectiveBalance = 0;
                }

                // show welcome and faucet modal only if unknown and balance 0

                if (success.balanceTQT === 0) {

                    this.publicKey = success.publicKey;
                    this.accountRs = accountRS;
                    // openWelcomeFaucetModal();
                }

            }

            this.accountService.getPhasingOnlyControl(accountRS).subscribe((success) => {
                if (success.account) {

                    this.multisig = 'controlled';
                    this.controlDetected = true;
                    this.multisigModel = JSON.stringify(success);
                    this.controlVotingModel = success.votingModel;
                    this.controlQuorum = success.quorum;
                    this.accountRS = success.accountRS;
                    this.maxFees = success.maxFees;
                    this.minBalance = success.minBalance;
                    this.WhitelistAccountRS = success.whitelist.length;

                    this.whitelistedRS = '';
                    for (let i = 0; i < this.WhitelistAccountRS; i++) {

                        this.whitelistedRS = this.whitelistedRS + '<br/>' + success.whitelist[i].whitelistedRS;
                    }

                    this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                        true);
                    this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                        success);

                } else {

                    this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                        false);
                    this.sessionStorageService.saveToSession(AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                        '');

                }
            });

            this.leasesDetected = false;

            if (success.currentLesseeRS) {
                this.leasesDetected = true;
            }

            this.account = success;
            RootScope.set({ balanceTQT: success.balanceTQT})

        });
    };

    getAssetsXmcValue = function () {
        let accountRs = this.commonsService.getAccountDetailsFromSession('accountRs');
        this.assetsService.getAccountAssets(accountRs).subscribe((success) => {

            let assets = success.accountAssets;
            let assetsInfos = {};
            let assetsIds = [];
            for (let i = 0; i < assets.length; i++) {
                let assetId = assets[i].asset;
                assetsInfos[assetId] = assets[i];
                assetsIds.push(assetId);
            }
            this.assetsService.getMultipleAssetLastTrades(assetsIds).subscribe((success) => {
                let sum = 0;
                let trades = success.trades || [];
                for (let i = 0; i < trades.length; i++) {
                    let trade = trades[i];
                    let currentAsset = assetsInfos[trade.asset];
                    let price = trade.priceTQT;
                    let units = currentAsset.quantityQNT;

                    let amount = (price * units) / 100000000;

                    sum = sum + amount;

                }
                this.accountAssetXmcValue = sum;
            });
        });
    };

    getCurrenciesXmcValue = function () {
        let accountRs = this.commonsService.getAccountDetailsFromSession('accountRs');
        this.currenciesService.getAccountCurrencies(accountRs).subscribe((success) => {

            let currencies = success.accountCurrencies;
            let currenciesInfos = {};
            let currencyIds = [];
            for (var i = 0; i < currencies.length; i++) {
                let currencyId = currencies[i].currency;
                currenciesInfos[currencyId] = currencies[i];
                currencyIds.push(currencyId);
            }

            this.currenciesService.getMultipleCurrenctLastExchanges(currencyIds).subscribe((success_) => {

                let sum = 0;
                let currencies = success_.exchanges || [];
                for (let i = 0; i < currencies.length; i++) {
                    let exchange = currencies[i];
                    let currentCurrency = currenciesInfos[exchange.currency];
                    let price = this.quantToAmountPipe.transform(exchange.rateTQT);
                    let units = currentCurrency.units;
                    sum = sum + (units * price);
                }
                this.accountCurrencyXmcValue = sum;
            });
        });
    };


    hasPrivateKeyInSession = function () {
        if (this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
            return true;
        }
        return false;
    };

    onChangeAccountInfo(e) {
        let totalFee = this.feeService.getSetAccountFee(this.setAccountParams.name,
            this.setAccountParams.description);

        if (this.setAccountParams.fee || this.setAccountParams.fee < totalFee) {
            this.setAccountParams.fee = totalFee;
        }
    }

    createSetAccountInfoTransaction = function () {

        this.setAccountParams.accountPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex;
        if (this.setAccountParams.secret) {
            secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(this.setAccountParams.secret);
        } else {
            secretPhraseHex =
                this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
        }

        this.accountService.setAccountInfo(this.setAccountParams.accountPublicKey, this.setAccountParams.name, this.setAccountParams.description, this.setAccountParams.fee)
            .subscribe((success_) => {
                success_.subscribe((success) => {
                    if (!success.errorCode) {
                        let unsignedBytes = success.unsignedTransactionBytes;
                        let signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                        //$scope.transactionJSON = success.transactionJSON;
                        this.validBytes = true;

                        this.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        this.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        this.tx_total = this.tx_fee + this.tx_amount;

                    } else {
                        let title: string = this.commonsService.translateAlertTitle('Error');
                        let errMsg: string = this.commonsService.translateErrorMessageParams( 'sorry-error-occurred',
                        success);
                        alertFunctions.InfoAlertBox(title,
                            errMsg,
                            'OK',
                            'error').then(() => {
                            });
                    }
                });

            });
    };

    broadcastTransaction(transactionBytes) {
        this.accountService.broadcastTransaction(transactionBytes)
            .subscribe((success: any) => {
                if (!success.errorCode) {
                    let title: string = this.commonsService.translateAlertTitle('Success');
                    let msg: string = this.commonsService.translateInfoMessage('success-broadcast-message');
                    msg += success.transaction;
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'success').then((isConfirm: any) => {
                        });
                    //$rootScope.$broadcast('reload-dashboard');
                } else {
                    let title: string = this.commonsService.translateAlertTitle('Error');
                    let errMsg: string = this.commonsService.translateErrorMessage('unable-broadcast-transaction', success);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                        });
                }

            });
    };


}
