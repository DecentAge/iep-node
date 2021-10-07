
import {forkJoin as observableForkJoin, Observable} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../../../services/session-storage.service';
import {AssetsService} from '../../../assets.service';
import {AccountService} from '../../../../account/account.service';
import {Page} from '../../../../../config/page';
import {DataStoreService} from '../../../../../services/data-store.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-order-trade-details',
  templateUrl: './order-trade-details.component.html',
  styleUrls: ['./order-trade-details.component.scss']
})
export class OrderTradeDetailsComponent implements OnInit {

    orderTradesForm: any = {};
    orderTradeRows = new Array<any>();
    orderTradesPage = new Page();
    constructor(private router: Router,
                private sessionStorageService: SessionStorageService,
                private assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService,
                private _location: Location) {
    }

  ngOnInit() {
      this.orderTradesPage.pageNumber = 0;
      this.orderTradesPage.totalElements = 0;
  }
    onSearchChange(orderId) {
        if (orderId !== '') {
            this.getOrderTrades();
        } else {
        }
    }
    getOrderTrades(pageInfo?){
        if(!pageInfo){
            pageInfo = {offset: 0};
        }

        this.orderTradesPage.pageNumber = pageInfo.offset;

        var observablesArray = [];
        var orderId = this.orderTradesForm.orderId;
        var bidOrderTrades = this.assetsService.getBidOrderTrades(orderId,
            this.orderTradesPage.pageNumber * 10,
            ((this.orderTradesPage.pageNumber + 1) * 10) - 1);
        var bidOrderTrades = this.assetsService.getAskOrderTrades(orderId, this.orderTradesPage.pageNumber * 10,
            ((this.orderTradesPage.pageNumber + 1) * 10) - 1);
        observablesArray.push(bidOrderTrades);
        observablesArray.push(bidOrderTrades);
        observableForkJoin(observablesArray)
            .subscribe((successNext: any) => {
                let [bidOrders, askOrders] = successNext;

                if (!bidOrders.errorCode && bidOrders.trades.length > 0) {
                    this.orderTradeRows = bidOrders.trades;
                }
                if (!askOrders.errorCode && askOrders.trades.length > 0) {
                    this.orderTradeRows = askOrders.trades;
                }
                if (this.orderTradesPage.pageNumber === 0 && this.orderTradeRows.length < 10) {
                    this.orderTradesPage.totalElements = this.orderTradeRows.length;
                } else if (this.orderTradesPage.pageNumber > 0 && this.orderTradeRows.length < 10) {
                    this.orderTradesPage.totalElements = this.orderTradesPage.pageNumber * 10 + this.orderTradeRows.length;
                    this.orderTradesPage.totalPages = this.orderTradesPage.pageNumber;
                }

            });
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/assets/show-assets/order-trade-details/transaction-details']);
    }
    goBack() {
        this._location.back();
    }

}
