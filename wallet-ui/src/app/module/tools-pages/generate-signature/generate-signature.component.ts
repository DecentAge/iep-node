import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CryptoService } from '../../../services/crypto.service';
import { AccountService } from '../../account/account.service';
import { AppConstants } from '../../../config/constants';

@Component({
  selector: 'app-generate-signature',
  templateUrl: './generate-signature.component.html',
  styleUrls: ['./generate-signature.component.scss']
})
export class GenerateSignatureComponent implements OnInit {

  generateSignatureForm:any = {
    input:'',
    output:''
  }
  constructor(public sessionStorageService: SessionStorageService,
              public cryptoService: CryptoService,
              public accountService: AccountService) { }

  ngOnInit() {
  }

  generateToken() {

    var accountPublicKey = this.accountService.getAccountDetailsFromSession('publicKey');
    var secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
    var epoch =  AppConstants.baseConfig.EPOCH;

    this.generateSignatureForm.output = this.cryptoService.generateToken(this.generateSignatureForm.input, secretPhraseHex, accountPublicKey, epoch );

  };

}
