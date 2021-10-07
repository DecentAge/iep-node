import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable()
export class SwappService {

    swapps: Array<any>;
    watchList: Array<any>;
    keyForLocalStore: string;
    constructor(public commonsService: CommonService) {
        this.loadSWApps();
    }

    loadSWApps() {
        let publicKey = this.commonsService.getAccountDetailsFromSession('publicKey');
        this.keyForLocalStore = "swapps_array_" + publicKey;
        const localStored = (localStorage[this.keyForLocalStore] !== undefined) ? JSON.parse(localStorage[this.keyForLocalStore]) : undefined;
        this.swapps = localStored || [
            {
                name: 'Assets',
                icon: 'icon-assets',
                isEnabled: false
            },
            {
                name: 'Currencies',
                icon: 'icon-currencies',
                isEnabled: false
            },
            {
                name: 'Aliases',
                icon: 'icon-Aliases',
                isEnabled: false
            },
            {
                name: 'Voting',
                icon: 'icon-Voting',
                isEnabled: false
            },
            {
                name: 'AT',
                icon: 'icon-AT',
                isEnabled: false
            },
            {
                name: 'Crowdfunding',
                icon: 'icon-Crowdfunding',
                isEnabled: false
            },
            {
                name: 'Subscriptions',
                icon: 'icon-Subscription',
                isEnabled: false
            },
            {
                name: 'Escrow',
                icon: 'icon-Escrow',
                isEnabled: false
            },
            {
                name: 'Shuffling',
                icon: 'icon-Shuffling',
                isEnabled: false
            },
            {
                name: 'Tools',
                icon: 'icon-Extensions',
                isEnabled: false
            },
        ];
        this.watchList = [];
    }

    clearSwapps() {
        let publicKey = this.commonsService.getAccountDetailsFromSession('publicKey');
        localStorage.removeItem("swapps_array_" + publicKey);
    }

    getAllSwapps() {
        return this.swapps;
    }

    setSwappSetting(swapps) {
        localStorage[this.keyForLocalStore] = JSON.stringify(this.swapps);
        this.swapps = swapps;
    }

    pushToWatch(appName, _this) {
        this.watchList.push({ _this, appName })
    }

    applyChanges() {
        let _this = this;
        this.watchList.forEach(view => {
            view._this.viewContainer.clear();

            _this.swapps.forEach(function (app) {
                if (app.name == view.appName && app.isEnabled) {
                    view._this.viewContainer.createEmbeddedView(view._this.templateRef);
                }
            })
        });
    }
}
