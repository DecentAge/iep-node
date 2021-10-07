import { NgModule } from '@angular/core';
import { MatchHeightModule } from '../../shared/directives/match-height.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignupDisclaimerComponent } from './signup/signup-disclaimer/signup-disclaimer.component';
import { SignupConfirmComponent } from './signup/signup-confirm/signup-confirm.component';
import { SignupPassphraseComponent } from './signup/signup-passphrase/signup-passphrase.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        NgbModule,
        MatchHeightModule,
        FormsModule,
        TranslateModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        WelcomeComponent,
        LoginComponent,
        SignupComponent,
        SignupDisclaimerComponent,
        SignupConfirmComponent,
        SignupPassphraseComponent
    ],
    providers: [],
    entryComponents: [SignupComponent]
})

export class LoginModule { }
