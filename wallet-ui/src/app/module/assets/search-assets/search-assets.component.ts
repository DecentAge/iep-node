import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AssetsService } from '../assets.service';
import { Page } from '../../../config/page';
import { DataStoreService } from '../../../services/data-store.service';

@Component({
    selector: 'app-search-assets',
    templateUrl: './search-assets.component.html',
    styleUrls: ['./search-assets.component.scss']
})
export class SearchAssetsComponent implements OnInit {
    assets: any[] = [];
    accountId: any;
    accountRs: any;
    searchQuery: any;

    constructor(public router: Router,
        public sessionStorageService: SessionStorageService,
        public assetsService: AssetsService,
        public route: ActivatedRoute,
        public accountService: AccountService) {
    }

    ngOnInit() {
    }
    onSearchChange(query) {
        if (query !== '') {
            this.assetsService.serachAssets(query)
                .subscribe((success: any) => {
                    this.assets = success.assets;
                });
        } else {
        }
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/assets/search-assets/account-details'], { queryParams: { id: accountID } });
    }
    goToAssetDetails(accountID) {
        this.router.navigate(['/assets/search-assets/asset-details'], { queryParams: { id: accountID } });
    }
    goToTradeDesk(id) {
        this.router.navigate(['/assets/trade', id]);
    }

}
