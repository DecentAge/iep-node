import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { AppConstants } from "../../../config/constants";
import { SessionStorageService } from "../../../services/session-storage.service";
import { LoginService } from "../../../services/login.service";
import { SwappService } from "../../../services/swapp.service";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  model: Login = new Login();
  languages: Array<Object>;
  selectedLanguage: string;

  timeout = false;

  constructor(
    public router: Router,
    public translate: TranslateService,
    public sessionStorageService: SessionStorageService,
    public loginService: LoginService,
    public swappService: SwappService,
  ) {
    this.languages = [
      { name: "English", code: "en" },
      { name: "German", code: "de" },
      { name: "Polish", code: "pl" }
    ];
    this.selectedLanguage = this.sessionStorageService.getFromSession(
      AppConstants.languageConfig.SESSION_SELECTED_LANGUAGE_KEY
    );
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit() {
    const to = JSON.parse(sessionStorage.getItem('session_timeout')) || false;

    if (to) {
      this.timeout = to;
      sessionStorage.removeItem('session_timeout');
    }
  }

  hasInsecurePassphrase = function() {
    return this.model.passPhrase !== '' && this.model.passPhrase.split(' ').length < 15;
  }

  loginToAccount = function() {
    let rememberSecret = true; //We are making it default now

    this.loginService.calculateAccountDetailsFromSecret(
        this.model.passPhrase,
        true
    );

    if (rememberSecret) {
      this.loginService.calculatePrivateKeyFromSecret(
          this.model.passPhrase,
          true
      );
    }
    this.swappService.loadSWApps();
    this.router.navigateByUrl("/dashboard");
    this.loginService.initSessionTimeout();
  };

  changeLanguage(event: any) {
    this.sessionStorageService.saveToSession(
      AppConstants.languageConfig.SESSION_SELECTED_LANGUAGE_KEY,
      this.selectedLanguage
    );
    this.translate.use(this.selectedLanguage);
  }

  signUp() {
    this.router.navigateByUrl("/sign-up/step-1");
  }
}

class Login {
  constructor(public passPhrase: string = "") {}
}
