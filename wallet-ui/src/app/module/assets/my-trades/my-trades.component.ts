import { Component, OnInit } from '@angular/core';
import { Page } from '../../../config/page';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AccountService } from '../../account/account.service';
import { AssetsService } from '../assets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../../services/data-store.service';

@Component({
    selector: 'app-my-trades',
    templateUrl: './my-trades.component.html',
    styleUrls: ['./my-trades.component.scss']
})
export class MyTradesComponent implements OnInit {

    page = new Page();
    myTrades: any = [];
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

        this.assetsService.getMyTrades(this.accountRs, startIndex, endIndex)
            .subscribe((success: any) => {
                this.myTrades = success.trades;
                if (this.page.pageNumber === 0 && this.myTrades.length < 10) {
                    this.page.totalElements = this.myTrades.length;
                } else if (this.page.pageNumber > 0 && this.myTrades.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.myTrades.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
    }
    reload() {
        this.setPage({ offset: 0 });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/assets/my-trades/transaction-details']);
    }
    goToAssetDetails(id) {
        this.router.navigate(['/assets/my-trades/asset-details'], { queryParams: { id: id } });
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/assets/my-trades/account-details'], { queryParams: { id: accountID } });
    }
    goToTradeDesk(id) {
        this.router.navigate(['/assets/trade', id]);
    }
}
