import { Injectable } from '@angular/core';
import { HttpProviderService } from './http-provider.service';
import {AppConstants} from '../config/constants';
import {OptionService} from './option.service';

@Injectable()
export class PeerService {

  constructor(public http: HttpProviderService,
              public optionsService: OptionService) { }

    getPeers() {
        return this.http.get(this.getPeerEndPoints('')[0], '');
    };

    getStats() {
        return this.http.get(this.getPeerEndPoints('')[0], 'getStats');
    };

    searchIp(ip) {
        let params = {
            'ip': ip
        };
        return this.http.get(this.getPeerEndPoints('')[0], '', params );
    };

    getPeerEndPoints(option?) {
        option = option || this.optionsService.getOption('CONNECTION_MODE', '');
        return AppConstants.peerEndpointsMap[option] || AppConstants.peerEndpointsMap['DEFAULT'];
    };
}
