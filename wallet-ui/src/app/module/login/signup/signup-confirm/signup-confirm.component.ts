import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../../../../services/login.service';
import { DataStoreService } from '../../../../services/data-store.service';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-signup-confirm',
    templateUrl: './signup-confirm.component.html',
    styleUrls: ['./signup-confirm.component.scss']
})
export class SignupConfirmComponent implements OnInit {
    secret: string;
    model: Login = new Login();

    constructor(public router: Router,
        public loginService: LoginService,
        public commonService: CommonService) {

    }

    ngOnInit() {
        this.secret = DataStoreService.get('signupSecret');
    }

    confirmAndLogin() {
        let rememberSecret = true;  // We are making it default now

        if (this.model.passPhrase === this.secret) {
            this.loginService.calculateAccountDetailsFromSecret(this.model.passPhrase, true);

            if (rememberSecret) {
                this.loginService.calculatePrivateKeyFromSecret(this.model.passPhrase, true);
            }
            this.router.navigateByUrl('/dashboard');
        } else {
            let title: string = this.commonService.translateAlertTitle('Success');
            let msg: string = this.commonService.translateInfoMessage('sign-up-confirm-error-msg');
            alertFunctions.InfoAlertBox(title,
                msg,
                'OK',
                'success').then((isConfirm: any) => {
                });
        }
    }

}

class Login {
    constructor(public passPhrase: string = '') {

    }
}