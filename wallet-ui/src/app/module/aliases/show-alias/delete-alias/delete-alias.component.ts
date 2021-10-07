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
    selector: 'app-delete-alias',
    templateUrl: './delete-alias.component.html',
    styleUrls: ['./delete-alias.component.scss']
})
export class DeleteAliasComponent implements OnInit {

    data: any;
    transactionBytes: any;

    validBytes: any;
    tx_fee: any;
    tx_amount: any;
    tx_total: any;
    aliase = {
        name: '',
        uri: ''
    };

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
        this.aliase.uri = this.data.aliasURI;
        this.aliase.name = this.data.aliasName;
    }

    deleteAlias() {
        const publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
        const name = this.aliase.name;
        const fee = 1;
        const secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.aliasesService.deleteAlias(publicKey, name, fee)
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
