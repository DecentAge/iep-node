import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AccountService } from '../../account/account.service';
import { AssetsService } from '../assets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../config/page';
import { DataStoreService } from '../../../services/data-store.service';

@Component({
    selector: 'app-my-transfers',
    templateUrl: './my-transfers.component.html',
    styleUrls: ['./my-transfers.component.scss']
})
export class MyTransfersComponent implements OnInit {

    page = new Page();
    myTransfers: any = [];
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

        this.assetsService.getAllLastTransfers(this.accountRs, startIndex, endIndex)
            .subscribe((success: any) => {
                this.myTransfers = success.transfers;
                if (this.page.pageNumber === 0 && this.myTransfers.length < 10) {
                    this.page.totalElements = this.myTransfers.length;
                } else if (this.page.pageNumber > 0 && this.myTransfers.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.myTransfers.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
    }
    reload() {
        this.setPage({ offset: 0 });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/assets/my-transfers/transaction-details']);
    }
    goToTradeDesk(id) {
        this.router.navigate(['/assets/trade', id]);
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/assets/my-transfers/account-details'], { queryParams: { id: accountID } });
    }
    goToAssetDetails(accountID) {
        this.router.navigate(['/assets/my-transfers/asset-details'], { queryParams: { id: accountID } });
    }
}
