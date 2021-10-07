import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../../config/constants';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { CommonService } from '../../../services/common.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Location } from '@angular/common';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { AliasesService } from '../aliases.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';

@Component({
    selector: 'app-create-alias',
    templateUrl: './create-alias.component.html',
    styleUrls: ['./create-alias.component.scss']
})
export class CreateAliasComponent implements OnInit {
    hasPrivateMessage: Boolean = false;
    transactionBytes: any;
    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    alias = {
        aliasName: '',
        prefix: '',
        aliasURI: ''
    }
    uriPlaceholder: any;
    prefixes = [
        { name: 'Account', value: 'acct:', placeholder: 'XIN______-____-______' },
        { name: 'URL', value: 'url:', placeholder: 'http://' },
        { name: 'BTC', value: 'btc:', placeholder: '' },
        { name: 'Other', value: '', placeholder: '' }

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
        this.alias.prefix = this.prefixes[0].value;
        this.uriPlaceholder = this.prefixes[0].placeholder;
    }

    changePlaceholder(prefix) {
        for (let i = 0; i < this.prefixes.length; i++) {
            if (prefix === this.prefixes[i].value) {
                this.uriPlaceholder = this.prefixes[i].placeholder;
            }
        }
    }

    formFinalAlias = function () {
        const aliasUri = this.alias.aliasURI;
        const aliasPrefix = this.alias.prefix;
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

    setAlias() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const aliasName = this.alias.aliasName;
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
                            this.router.navigate(['/aliases/create-alias']);
                        });
                }


            });
    };
}
