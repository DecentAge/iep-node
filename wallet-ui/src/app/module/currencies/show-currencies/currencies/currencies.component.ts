import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../../currencies.service';
import { AccountService } from '../../../account/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../../../config/constants';
import { DataStoreService } from '../../../../services/data-store.service';
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { Page } from '../../../../config/page';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  page = new Page();
  rows = new Array<any>();

  currencyType: any = 'ALL';

  accountId = '';
  accountRs = '';

  constructor(private currenciesService: CurrenciesService,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {

    this.route.data.subscribe(data => {

      this.currencyType = data.currencyType;

      this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
      this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

      this.setPage({ offset: 0 });
    });

  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;

    let startIndex = this.page.pageNumber * 10;
    let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

    if (this.currencyType == 'ALL') {
      this.currenciesService.getCurrencies(startIndex, endIndex)
      .subscribe(response => {
        this.rows = response.currencies;
          if (this.page.pageNumber === 0 && this.rows.length < 10) {
              this.page.totalElements = this.rows.length;
          } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
              this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
              this.page.totalPages = this.page.pageNumber;
          }
      });
    } else {

      this.currenciesService.getAccountCurrencies(this.accountId)
      .subscribe(response => {
        this.rows = response.accountCurrencies;
          if (this.page.pageNumber === 0 && this.rows.length < 10) {
              this.page.totalElements = this.rows.length;
          } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
              this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
              this.page.totalPages = this.page.pageNumber;
          }
      });
    }
  }

  goToDetails(value) {
    DataStoreService.set('transaction-details', { id: value, type: 'onlyID', view: 'transactionDetail' });
    this.router.navigate(['/currencies/show-currencies/transaction-details']);
  }

  openAccountDetails(accountID) {
    this.router.navigate(['/currencies/show-currencies/account-details'], { queryParams: { id: accountID } });
  }

  openCurrencyDetails(code){
    this.router.navigate(['/currencies/show-currencies/currency-details'], { queryParams: { id:code }});
  }

  openTradeDesk(code){
    this.router.navigate(['/currencies/trade', code]);
  }

  openPublishExchangeOffer(currencyId, decimals, ticker, name) {
    DataStoreService.set('publish-exchange-offer', { currencyId, decimals, ticker, name });
    this.router.navigate(['/currencies/trade/' + currencyId + '/publish-exchange-offer']);
  }
  
  openTransferCurrency(currencyId, decimals, ticker){
    this.router.navigate(['/currencies/show-currencies/transfer-currency', currencyId]);
  }

  openDeleteCurrency(currencyId, decimals, ticker){
    this.router.navigate(['/currencies/show-currencies/delete-currency', currencyId]);
  }

  openCurrencyReserveClaim(value, decimals, code){
    
  }

  openCurrencyReserveIncrease(value, decimals, code){
    
  }

  openCurrencyFounders(value, decimals, code){
    
  }
  
  isTradeDeskEnabled(row){
    return (parseInt(row.currentSupply) === 0) ? true : false; 
  }

  reload() {
    this.setPage({ offset: 0 });
  }
}