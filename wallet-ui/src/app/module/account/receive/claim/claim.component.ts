import { Component, OnInit } from '@angular/core';
import {AppConstants} from '../../../../config/constants';
import * as alertFunctions from '../../../../shared/data/sweet-alerts';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {CryptoService} from '../../../../services/crypto.service';
import {AccountService} from '../../account.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
    validBytes = false;
    claimSeceretForm = {
        fullHash: '',
        secretText: ''
    };
    transactionBytes: any;
    transactionJSON: any;
  constructor(public sessionStorageService: SessionStorageService,
              public accountService: AccountService,
              public cryptoService: CryptoService,
              public commonService: CommonService) { }

  ngOnInit() {
  }
    confirmControlledTransaction = function (fullHash, secretText) {

        let fee = 1;

        let accountPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
        let secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

        this.accountService.approveTransactions(accountPublicKey, fullHash, fee, secretText)
            .subscribe((success) => {

                if (!success.errorCode) {
                    let unsignedBytes = success.unsignedTransactionBytes;
                    let signatureHex = this.cryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                    this.transactionBytes = this.cryptoService.signTransactionHex(unsignedBytes, signatureHex);
                    this.transactionJSON = success.transactionJSON;
                    this.validBytes = true;

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

    broadcastTransaction = function(transactionBytes) {
        this.accountService.broadcastTransaction(transactionBytes).subscribe((success) => {
            if (!success.errorCode) {
                let title: string = this.commonService.translateAlertTitle('Success');
                let msg: string = this.commonService.translateInfoMessage('success-broadcast-message');
                msg += success.transaction;
                alertFunctions.InfoAlertBox(title,
                    msg,
                    'OK',
                    'success').then((isConfirm: any) => {
                        this.router.navigate(['/account/transactions/pending']);
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
    };

}
