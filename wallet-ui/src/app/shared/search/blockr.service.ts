import { Injectable } from '@angular/core';
import {AppConstants} from '../../config/constants';
import {HttpProviderService} from '../../services/http-provider.service';
import { AnyFn } from '@ngrx/store/src/selector';

@Injectable()
export class BlockrService {

  constructor(public http: HttpProviderService) { }

  getAddressBalance(address):any {
    return this.http.get(AppConstants.exchangesConfig.BLOCKR_URL_END_POINT, AppConstants.exchangesConfig.BLOCKR_ADDRESS_END_POINT + '/' + address);
  }
}
