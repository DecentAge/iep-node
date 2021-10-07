import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../../services/common.service";
import { SessionStorageService } from "../../../services/session-storage.service";
import { AppConstants } from "../../../config/constants";
import { CryptoService } from "../../../services/crypto.service";
import { MessageService } from "../message.service";
import { ActivatedRoute } from "@angular/router";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { Location } from "@angular/common";
import { DataStoreService } from "../../../services/data-store.service";

@Component({
    selector: 'app-read-message',
    templateUrl: './read-message.component.html',
    styleUrls: ['./read-message.component.scss']
})
export class ReadMessageComponent implements OnInit {
    message: any = '';
    params: any = '';
    constructor(public commonsService: CommonService,
        public sessionStorageService: SessionStorageService,
        public cryptoService: CryptoService,
        public messageService: MessageService,
        public activatedRoute: ActivatedRoute,
        private _location: Location,
        public commonService: CommonService) { }

    ngOnInit() {

        this.params = DataStoreService.get('message-details');
        if (!this.params) {
            this._location.back();
        }
        this.readMessage();
    }

    readMessage() {
        try {

            var encrpytedMessageData = this.params.attachment.encryptedMessage.data;
            var encrpytedMessageNonce = this.params.attachment.encryptedMessage.nonce;

            var accountRS = this.commonsService.getAccountDetailsFromSession('accountRs');
            var secretHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

            var senderRS = this.params.senderRS;
            var recipientRS = this.params.recipientRS;

            var senderPublicKey = this.params.senderPublicKey;
            var recipientPublicKey = '';

        } catch (e) {
            this.message = 'Sorry, an error has occurred: ' + e.message;
            return;
        } finally {
        }

        this.messageService.getAccountDetails(recipientRS)
            .subscribe((success: any) => {
                if (!success.errorCode) {

                    let recipientPublicKey = success.publicKey;

                    let encrypted;

                    if (accountRS === senderRS) {

                        encrypted =
                            this.cryptoService.decryptMessage(encrpytedMessageData, encrpytedMessageNonce, secretHex,
                                recipientPublicKey);

                    } else {

                        encrypted =
                            this.cryptoService.decryptMessage(encrpytedMessageData, encrpytedMessageNonce, secretHex,
                                senderPublicKey);
                    }

                    if (typeof (encrypted) === 'string') {
                        this.message = encrypted;
                    } else {
                        this.message = 'Non readable message string.';
                    }
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
    };
    goBack() {
        this._location.back();
    }
}
