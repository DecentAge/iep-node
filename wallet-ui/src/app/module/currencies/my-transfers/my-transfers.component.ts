import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../currencies.service';
import { AccountService } from '../../account/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from '../../../services/data-store.service';
import { Page } from '../../../config/page';

@Component({
    selector: 'app-my-transfers',
    templateUrl: './my-transfers.component.html',
    styleUrls: ['./my-transfers.component.scss']
  })
  export class MyTransfersComponent implements OnInit {

  accountId = '';
  accountRs = '';

  page = new Page();
  rows = new Array<any>();

  constructor(private currenciesService: CurrenciesService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.currenciesService.getCurrencyTransfers(
      '',
      this.accountRs,
      this.page.pageNumber * 10,
      ((this.page.pageNumber + 1) * 10) - 1
    ).subscribe((response: any) => {
      this.rows = response.transfers;
        if (this.page.pageNumber === 0 && this.rows.length < 10) {
            this.page.totalElements = this.rows.length;
        } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
            this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
            this.page.totalPages = this.page.pageNumber;
        }
    });
  }

  goToDetails(value) {
    DataStoreService.set('transaction-details', { id: value, type: 'onlyID', view: 'transactionDetail' });
    this.router.navigate(['/currencies/my-transfers/transaction-details']);
  }

  openAccountDetails(accountID) {
    this.router.navigate(['/currencies/my-transfers/account-details'], { queryParams: { id: accountID } });
  }

  openCurrencyDetails(code){
    this.router.navigate(['/currencies/my-transfers/currency-details'], { queryParams: { id:code }});
  }

  reload() {
    this.setPage({offset: 0});
  }
}

