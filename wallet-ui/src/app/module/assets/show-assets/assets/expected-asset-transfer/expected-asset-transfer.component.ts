import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../../../config/page';
import {SessionStorageService} from '../../../../../services/session-storage.service';
import {AssetsService} from '../../../assets.service';
import {AccountService} from '../../../../account/account.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-expected-asset-transfer',
  templateUrl: './expected-asset-transfer.component.html',
  styleUrls: ['./expected-asset-transfer.component.scss']
})
export class ExpectedAssetTransferComponent implements OnInit {
    transfers: any = [];
    accountId: any;
    accountRs: any;
    constructor(public router: Router,
                public sessionStorageService: SessionStorageService,
                public assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService,
                private _location: Location) {}

    ngOnInit() {
        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');
        this.assetsService.getExpectedAssetTransfers('', this.accountRs)
            .subscribe((success: any) => {
                this.transfers = success.transfers;
            });
    }
    goToAccountDetails(id) {
        this.router.navigate(['/assets/show-assets/expected-asset-transfer/account-details'], { queryParams: { id: id }});
    }
    goToAssetDetails(id) {
        this.router.navigate(['/assets/show-assets/expected-asset-transfer/asset-details'],{ queryParams: { id: id }});
    }
    goBack() {
        this._location.back();
    }

}
