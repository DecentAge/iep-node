import { Injectable } from '@angular/core';
import { AppConstants } from '../config/constants';
import { HttpProviderService } from './http-provider.service';

@Injectable()
export class FiatService {

    constructor(public http: HttpProviderService) { }
    getBtcPrice() {
        return this.http.get(AppConstants.fiatConfig.btcEndpoint, 'bitcoinaverage.json');
    };

    getXinPrice() {
        return this.http.get(AppConstants.fiatConfig.xinEndpoint, 'xin.json');
    };
}
