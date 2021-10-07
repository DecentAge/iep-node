import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage.service';
import { AppConstants } from '../../config/constants';

@Injectable()
export class AuthService {
  token: string;

  constructor(private sessionStorage: SessionStorageService, private router: Router) {}

  logout() {   
    this.sessionStorage.deleteFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
    this.sessionStorage.deleteFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
  
    this.router.navigate(['/welcome']);
  }

  getAccountDetailsFromSession = function (keyName) {
    var accountDetails = this.sessionStorage.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
    if (keyName && accountDetails) {
        return accountDetails[keyName];
    }
    return accountDetails;
  }

  isAuthenticated() {
    return this.getAccountDetailsFromSession(false);
  }
}
