import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service";
import { DataStoreService } from "../../../services/data-store.service";
import { SignupPassphraseComponent } from "./signup-passphrase/signup-passphrase.component";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
    @ViewChild(SignupPassphraseComponent) passPhrase;
    @Input() name;

    steps: Array<Object>;
    secret: string;

    constructor(public router: Router, private loginService: LoginService) {
        this.steps = [
            {
                name: 'disclaimer',
                title: 'signup.disclaimer.title'
            },
            {
                name: 'passphrase',
                title: 'signup.passphrase.title'
            },
            {
                name: 'confirm',
                title: 'signup.confirm.title'
            }
        ];
    }

    next() {
        switch(this.router.url) {
            case '/sign-up/step-1': {
                this.secret = this.loginService.generatePassPhrase();

                DataStoreService.set('signupSecret', this.secret);

                this.router.navigateByUrl('/sign-up/step-2');
                break;
            }
            case '/sign-up/step-2': {
                this.router.navigateByUrl('/sign-up/step-3');
                break;
            }
        }
    }

    generatePassPhrase() {
        this.secret = this.loginService.generatePassPhrase();

        DataStoreService.set('signupSecret', this.secret);

        this.passPhrase.createNewAccount();
    }
}
