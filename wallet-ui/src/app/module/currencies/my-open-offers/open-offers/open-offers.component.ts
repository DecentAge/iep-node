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
  selector: 'app-open-offers',
  templateUrl: './open-offers.component.html',
  styleUrls: ['./open-offers.component.scss']
})
export class OpenOffersComponent implements OnInit {

  page = new Page();
  rows = new Array<any>();

  offerType: any = 'BUY';

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

      this.offerType = data.offerType;

      this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
      this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

      this.setPage({ offset: 0 });
    });

  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;

    let startIndex = this.page.pageNumber * 10;
    let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

    if (this.offerType == 'BUY') {
      this.currenciesService.getBuyOffers(this.accountRs, '', startIndex, endIndex)
      .subscribe(response => {
        this.rows = response.offers;
          if (this.page.pageNumber === 0 && this.rows.length < 10) {
              this.page.totalElements = this.rows.length;
          } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
              this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
              this.page.totalPages = this.page.pageNumber;
          }
      });
    } else {
      this.currenciesService.getSellOffers(this.accountRs, '', startIndex, endIndex)
      .subscribe(response => {
        this.rows = response.offers;
          if (this.page.pageNumber === 0 && this.rows.length < 10) {
              this.page.totalElements = this.rows.length;
          } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
              this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
              this.page.totalPages = this.page.pageNumber;
          }
      });
    }
  }

  openCancelExchangeOffer(currency, offerType){
    this.router.navigate(['/currencies/my-open-offers/cancel-offer'], { queryParams: { currency, offerType }});
  }

  goToDetails(value) {
    DataStoreService.set('transaction-details', { id: value, type: 'onlyID', view: 'transactionDetail' });
    this.router.navigate(['/currencies/my-open-offers/transaction-details']);
  }

  openCurrencyDetails(code){
    this.router.navigate(['/currencies/my-open-offers/currency-details'], { queryParams: { id:code }});
  }

  reload() {
    this.setPage({ offset: 0 });
  }
}