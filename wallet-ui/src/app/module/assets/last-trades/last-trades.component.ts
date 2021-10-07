import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../assets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../config/page';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AccountService } from '../../account/account.service';
import { DataStoreService } from '../../../services/data-store.service';

@Component({
    selector: 'app-last-trade',
    templateUrl: './last-trades.component.html',
    styleUrls: ['./last-trades.component.scss']
})
export class LastTradesComponent implements OnInit {
    page = new Page();
    allTrades: any[] = [];
    accountId: any;
    accountRs: any;
    constructor(public router: Router,
        public sessionStorageService: SessionStorageService,
        public assetsService: AssetsService,
        public route: ActivatedRoute,
        public accountService: AccountService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');
        this.setPage({ offset: 0 });
    }
    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        this.assetsService.getAllTrades(startIndex, endIndex)
            .subscribe((success: any) => {
                this.allTrades = success.trades;
                if (this.page.pageNumber === 0 && this.allTrades.length < 10) {
                    this.page.totalElements = this.allTrades.length;
                } else if (this.page.pageNumber > 0 && this.allTrades.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.allTrades.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
    }
    reload() {
        this.setPage({ offset: 0 });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/assets/last-trades/transaction-details']);
    }
    goToAssetDetails(id) {
        this.router.navigate(['/assets/last-trades/asset-details'], { queryParams: { id: id } });
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/assets/last-trades/account-details'], { queryParams: { id: accountID } });
    }
    goToTradeDesk(id) {
        this.router.navigate(['/assets/trade', id]);
    }
}
