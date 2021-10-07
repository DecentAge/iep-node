import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../../../services/login.service';
import { SwappService } from '../../../services/swapp.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model: Login = new Login();
    constructor(public router: Router,
        public loginService: LoginService,
        public swappService: SwappService) { }

    ngOnInit() { }

    loginToAccount = function () {
        let rememberSecret = true;//We are making it default now

        this.loginService.calculateAccountDetailsFromSecret(this.model.passPhrase, true);

        if (rememberSecret) {
            this.loginService.calculatePrivateKeyFromSecret(this.model.passPhrase, true);
        }
        this.swappService.loadSWApps();
        this.router.navigateByUrl('/dashboard');
        this.loginService.initSessionTimeout();
    };

    signUp() {
        this.router.navigateByUrl('/sign-up/step-1');
    }
}

class Login {
    constructor(public passPhrase: string = '') {
    }
}
