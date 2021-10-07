import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { AmountToQuantPipe } from '../../../../pipes/amount-to-quant.pipe';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { Location } from '@angular/common';
import { AliasesService } from '../../aliases.service';
import { CryptoService } from '../../../../services/crypto.service';
import * as alertFunctions from '../../../../shared/data/sweet-alerts';
import { AppConstants } from '../../../../config/constants';

@Component({
    selector: 'app-edit-alias',
    templateUrl: './edit-alias.component.html',
    styleUrls: ['./edit-alias.component.scss']
})
export class EditAliasComponent implements OnInit {

    data: any;
    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    aliase = {
        name: '',
        oldURL: '',
        prefix: '',
        uri: ''
    };
    uriPlaceholder: any;
    prefixOptions: any = [
        { label: 'Account', value: 'acct:', placeholder: 'XIN______-____-______' },
        { label: 'URL', value: 'url:', placeholder: 'http://' },
        { label: 'BTC', value: 'btc:', placeholder: '' },
        { label: 'Other', value: '' }
    ];

    unsignedTx: boolean;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private aliasesService: AliasesService,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        private _location: Location) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.alias) {
                this._location.back();
            } else {
                this.data = {
                    'aliasName': params.aliasName,
                    'aliasURI': params.aliasURI
                }
            }
        })
        this.aliase.prefix = this.prefixOptions[0].value;
        this.aliase.oldURL = this.data.aliasURI;
        this.aliase.name = this.data.aliasName;
        this.uriPlaceholder = this.prefixOptions[0].placeholder;
    }

    changePlaceholder(prefix) {
        for (let i = 0; i < this.prefixOptions.length; i++) {
            if (prefix === this.prefixOptions[i].value) {
                this.uriPlaceholder = this.prefixOptions[i].placeholder;
            }
        }
    }

    formFinalAlias = function () {
        const aliasUri = this.aliase.uri || '';
        const aliasPrefix = this.aliase.prefix;
        const aliasSuffix = '@xin';
        let aliasFinal = aliasPrefix + aliasUri;
        if (aliasPrefix !== '') {
            aliasFinal = aliasFinal + aliasSuffix;
        }

        if (!aliasUri) {
            aliasFinal = '';
        }

        return aliasFinal;
    };

    editAlias() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const aliasName = this.aliase.name;
        const alias = this.formFinalAlias();
        const fee = 1;
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.aliasesService.setAlias(publicKey, aliasName, alias, fee)
            .subscribe((success_) => {
                success_.subscribe((success) => {
                    if (!success.errorCode) {
                        const unsignedBytes = success.unsignedTransactionBytes;
                        const signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
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
                });
            })
    }

    broadcastTransaction(transactionBytes) {
        this.commonService.broadcastTransaction(transactionBytes)
            .subscribe((success) => {
                // TODO: reload logic
                if (!success.errorCode) {
                    let title: string = this.commonService.translateAlertTitle('Success');
                    let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                    msg += success.transaction;
                    alertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'success').then((isConfirm: any) => {
                            this.router.navigate(['/aliases/show-alias']);
                        });
                } else {
                    let title: string = this.commonService.translateAlertTitle('Error');
                    let errMsg: string = this.commonService.translateErrorMessage('unable-broadcast-transaction', success);
                    alertFunctions.InfoAlertBox(title,
                        errMsg,
                        'OK',
                        'error').then((isConfirm: any) => {
                            this.router.navigate(['/aliases/show-alias']);
                        });
                }


            });
    };

    goBack() {
        this._location.back();
    }

}
