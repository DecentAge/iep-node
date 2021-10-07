import { Component, OnInit } from '@angular/core';
import {Page} from '../../../../../config/page';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../account/account.service';
import {AssetsService} from '../../../assets.service';
import {SessionStorageService} from '../../../../../services/session-storage.service';
import {DataStoreService} from '../../../../../services/data-store.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-divident-history',
  templateUrl: './divident-history.component.html',
  styleUrls: ['./divident-history.component.scss']
})
export class DividentHistoryComponent implements OnInit {

    page = new Page();
    dividends: any[] = [];
    assetId: any = '';

    constructor(public router: Router,
                public sessionStorageService: SessionStorageService,
                public assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService,
                private _location: Location) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.assetId = params.id;
            this.setPage({offset: 0});
        });
    }
    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        this.assetsService.getDividendsHistory(this.assetId, startIndex, endIndex, '')
            .subscribe((success: any) => {
                this.dividends = success.dividends;
                if (this.page.pageNumber === 0 && this.dividends.length < 10) {
                    this.page.totalElements = this.dividends.length;
                } else if (this.page.pageNumber > 0 && this.dividends.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.dividends.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/assets/show-assets/dividend-history/transaction-details']);
    }
    goBack() {
        this._location.back();
    }

}
