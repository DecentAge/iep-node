import { Injectable } from '@angular/core';
import { AppConstants } from '../config/constants';
import { HttpProviderService } from './http-provider.service';

@Injectable()
export class LocalhostService {

    constructor(public http: HttpProviderService) { }

    getPeerState(url):any {
        let params = {
            'requestType': 'getPeerState'
        };
        if (!url) {
            url = AppConstants.localhostConfig.apiUrl;
        }
        return this.http.get(url, AppConstants.localhostConfig.endPoint, params)
    };

    isValidUrl(url) {
        return this.getPeerState(url).subscribe(result => {
                return true;
            },
            error => {
                return false;
            });
    };
}
