import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../services/data-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AccountService } from '../account.service';
import { Page } from '../../../config/page';

@Component({
    selector: 'app-ledger-view',
    templateUrl: './ledger-view.component.html',
    styleUrls: ['./ledger-view.component.scss']
})
export class LedgerViewComponent implements OnInit {
    page = new Page();
    entries: any = [];
    accountId: any;
    constructor(public router: Router,
        public sessionStorageService: SessionStorageService,
        public route: ActivatedRoute,
        public accountService: AccountService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
        this.setPage({ offset: 0 });
    }
    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        this.accountService.getAccountLedger(this.accountId, startIndex, endIndex)
            .subscribe((success: any) => {
                this.entries = success.entries;
                if (this.page.pageNumber === 0 && this.entries.length < 10) {
                    this.page.totalElements = this.entries.length;
                } else if (this.page.pageNumber > 0 && this.entries.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.entries.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
    }
    reload() {
        this.setPage({ offset: 0 });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/account/ledger-view/transaction-details']);
    }

}