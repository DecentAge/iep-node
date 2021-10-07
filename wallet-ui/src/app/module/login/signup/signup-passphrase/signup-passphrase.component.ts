import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { DataStoreService } from '../../../../services/data-store.service';

@Component({
    selector: 'app-signup-passphrase',
    templateUrl: './signup-passphrase.component.html',
    styleUrls: ['./signup-passphrase.component.scss']
})
export class SignupPassphraseComponent implements OnInit {
    secret: string;
    accountRs: string;
    publicKey: string;

    constructor(public loginService:LoginService) {
    }

    ngOnInit() {
        this.createNewAccount();
    }

    createNewAccount() {
        this.secret = DataStoreService.get('signupSecret');
        
        let accountDetails = this.loginService.calculateAccountDetailsFromSecret(this.secret, false);

        this.accountRs = accountDetails.accountRs;
        this.publicKey = accountDetails.publicKey;
    }

    copyText = (value: string, tooltip: any) => {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = value;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        tooltip.open();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        setTimeout(() => {
            tooltip.close();
        }, 5000)
    };
}
