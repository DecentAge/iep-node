
import {forkJoin as observableForkJoin, Observable} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../../../../services/session-storage.service';
import {AssetsService} from '../../../assets.service';
import {AccountService} from '../../../../account/account.service';
import {Page} from '../../../../../config/page';
import {Location} from '@angular/common';

@Component({
  selector: 'app-expected-order-details',
  templateUrl: './expected-order-details.component.html',
  styleUrls: ['./expected-order-details.component.scss']
})
export class ExpectedOrderDetailsComponent implements OnInit {
    asset: any = {};
    decimals: any;

    askOrdersPage = new Page();
    askOrdersRows = new Array<any>();
    enableSell: any;
    bidLength: any;

    bidOrdersPage = new Page();
    bidOrdersRows = new Array<any>();
    enableBuy: any;
    askLength: any;
    expectedOrderForm: any = {}
    constructor(private router: Router,
                private sessionStorageService: SessionStorageService,
                private assetsService: AssetsService,
                private route: ActivatedRoute,
                private accountService: AccountService,
                private _location: Location) {
    }

  ngOnInit() {
      this.bidOrdersPage.totalElements = 0;
      this.bidOrdersPage.totalPages = 0;
      this.askOrdersPage.totalElements = 0;
      this.askOrdersPage.totalPages = 0;
  }
    onSearchChange(assetId) {
        if (assetId !== '') {
            this.assetsService.getAsset(assetId)
                .subscribe((success: any) => {
                    this.asset = success.asset;
                    this.getAskOrders();
                    this.getBidOrders();
                });
        } else {
        }
    }
    goBack() {
        this._location.back();
    }
    getAskOrders(pageInfo?){
        if(!pageInfo){
            pageInfo = {offset: 0};
        }

        this.askOrdersPage.pageNumber = pageInfo.offset;

        var observablesArray = [];
        var asset = this.expectedOrderForm.asset;
        var assetDetailsPromise = this.assetsService.getAsset(asset, true);
        var expectedAskOrdersPromise = this.assetsService.getExpectedAskOrders(asset);
        observablesArray.push(assetDetailsPromise);
        if (!this.decimals) {
            observablesArray.push(expectedAskOrdersPromise);
        }

        observableForkJoin(observablesArray)
            .subscribe((successNext: any) => {
                let [offersResponse, assetDetailsResponse] = successNext;
                if (assetDetailsResponse) {
                    this.decimals = assetDetailsResponse.decimals;
                }
                this.bidLength = offersResponse.askOrders? offersResponse.askOrders.length:0;
                this.askOrdersRows = offersResponse.askOrders;
                if (this.askOrdersPage.pageNumber === 0 && this.askOrdersRows.length < 10) {
                    this.askOrdersPage.totalElements = this.askOrdersRows.length;
                } else if (this.askOrdersPage.pageNumber > 0 && this.askOrdersRows.length < 10) {
                    this.askOrdersPage.totalElements = this.askOrdersPage.pageNumber * 10 + this.askOrdersRows.length;
                    this.askOrdersPage.totalPages = this.askOrdersPage.pageNumber;
                }
            });
    }
    getBidOrders(pageInfo?){

        if(!pageInfo){
            pageInfo = {offset: 0};
        }

        this.bidOrdersPage.pageNumber = pageInfo.offset;

        var observablesArray = [];

        var asset = this.expectedOrderForm.asset;
        var assetDetailsPromise = this.assetsService.getAsset(asset, true);
        var expectedBidOrdersPromise = this.assetsService.getExpectedBidOrders(asset);
        observablesArray.push(expectedBidOrdersPromise);
        if (!this.decimals) {
            observablesArray.push(assetDetailsPromise);
        }

        observableForkJoin(observablesArray)
            .subscribe((successNext: any) => {
                let [offersResponse, assetDetailsResponse] = successNext;
                if (assetDetailsResponse) {
                    this.decimals = assetDetailsResponse.decimals;
                }
                this.askLength = offersResponse.bidOrders? offersResponse.bidOrders.length:0;
                this.bidOrdersRows = offersResponse.bidOrders;
                if (this.bidOrdersPage.pageNumber === 0 && this.bidOrdersRows.length < 10) {
                    this.bidOrdersPage.totalElements = this.bidOrdersRows.length;
                } else if (this.bidOrdersPage.pageNumber > 0 && this.bidOrdersRows.length < 10) {
                    this.bidOrdersPage.totalElements = this.bidOrdersPage.pageNumber * 10 + this.bidOrdersRows.length;
                    this.bidOrdersPage.totalPages = this.bidOrdersPage.pageNumber;
                }
            });
    }

}
