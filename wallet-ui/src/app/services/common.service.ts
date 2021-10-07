import { Injectable, SecurityContext} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SessionStorageService } from './session-storage.service';
import { AppConstants } from '../config/constants';
import { HttpProviderService } from './http-provider.service';
import { NodeService } from './node.service';
import { OptionService } from './option.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class CommonService {

  constructor(public sessionStorageService: SessionStorageService, private http: HttpProviderService, private _sanitizer: DomSanitizer, private nodeService: NodeService, private optionService: OptionService, public translate: TranslateService) { }


  convertToArray(object) {
      if (!object) {
          return [];
      }
      if (!Array.isArray(object)) {
          object = [object];
      }
      return object;
  };

  getAccountDetailsFromSession(keyName) {
      var accountDetails = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
      if (keyName && accountDetails) {
          return accountDetails[keyName];
      }
      return accountDetails;
  };

  broadcastTransaction(transactionBytes):any {

    var params = {
        'requestType': 'broadcastTransaction',
        'transactionBytes': transactionBytes
    };

    return this.http.post(this.nodeService.getNodeUrl(this.optionService.getOption('CONNECTION_MODE', ''), this.optionService.getOption('RANDOMIZE_NODES', '')),  AppConstants.baseConfig.apiEndPoint, params )
  };

  iterateAndExecuteFunctionOnJson = function (object, callback, _this) {
      return this.iterate(object, callback, _this);
  };

  sanitizeJson = function (object) {
      return this.iterateAndExecuteFunctionOnJson(object, this.dontSanitizeNumber, this)
  };

  dontSanitizeNumber(object, _this) {
      if (isNaN(object)) {
          return _this._sanitizer.sanitize(SecurityContext.HTML, object);
      }
      return object;
  }

  iterate(obj, callback, _this) {
      for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
              if (typeof obj[property] == "object") {
                  obj[property] = this.iterate(obj[property], callback, _this);
              }
              else {
                  obj[property] = callback(obj[property], _this);
              }
          }
      }
      return obj
  }
  translateErrorMessage(messKey, success) {
    var message = ''
    this.translate.get('sweet-alert.' + messKey).subscribe((res: string) => {
        message = res;
    });
    if(!success.errCode){
        message += success.errorDescription.replace('&#34;', '"').replace('&#34;', '"');
    }else{
        this.translate.get('error-alert-msg.' + success.errCode).subscribe((res: string) => {
            message += res;
        });
    }
    return message;
  }
  translateErrorMessageParams(messKey, success) {
    var message = ''
    this.translate.get('sweet-alert.' + messKey).subscribe((res: string) => {
        message = res;
    });
    if(!success.errCode){
        message += success.errorDescription.replace('&#34;', '"').replace('&#34;', '"');
    }else{
        let params: object = success.params;
        this.translate.get('error-alert-msg.' + success.errCode, {params}).subscribe((res: string) => {
            message += res;
        });
    }
    return message;
  }
  translateAlertTitle(alertTitle) {
    var title = ''
    this.translate.get('sweet-alert.' + alertTitle).subscribe((res: string) => {
        title = res;
    });
    return title;
  }
  translateInfoMessage(alertMessageKey) {
    var message = ''
    this.translate.get('sweet-alert.' + alertMessageKey).subscribe((res: string) => {
        message = res;
    });
    return message;
  }
  translateInfoMessageWithParams(alertMessageKey, params) {
    var message = ''
    this.translate.get('sweet-alert.' + alertMessageKey, {params}).subscribe((res: string) => {
        message = res;
    });
    return message;
  }
}
