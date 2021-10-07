
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { AssetsService } from "../assets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { AmChart, AmChartsService } from "@amcharts/amcharts3-angular";
import { Page } from "../../../config/page";
import { CommonService } from "../../../services/common.service";
import "rxjs/add/observable/forkJoin";
import { QuantToAmountPipe } from "../../../pipes/quant-to-amount.pipe";
import { ShareToQuantityPipe } from "../../../pipes/share-to-quantity.pipe";
import { QuantityToSharePipe } from "../../../pipes/quantity-to-share.pipe";
import { RootScope } from "../../../config/root-scope";
import { DataStoreService } from "../../../services/data-store.service";
import { NumericalStringPipe } from "../../../pipes/numerical-string.pipe";
import { RateTqtToPricePipe } from "../../../pipes/rate-tqt-to-price.pipe";

@Component({
  selector: "app-trade-desk",
  templateUrl: "./trade-desk.component.html",
  styleUrls: ["./trade-desk.component.scss"]
})
export class TradeDeskComponent implements OnInit {
  assetId: any = "";
  assetDetails: any = {};
  decimals: any = 0;

  accountDetails: any = {};
  quantityQNT: any;
  unconfirmedQuantityQNT: any;
  units: any;
  unconfirmedUnits: any;

  accountId = "";
  accountRs = "";
  balanceTQT = 0;

  tradesPage = new Page();
  tradesRows = new Array<any>();
  tradeData: any = {};
  labels = new Array<any>();
  lastTrade: any = {};

  askOrderForm: any = {};
  sellOrdersPage = new Page();
  sellOrdersRows = new Array<any>();
  enableSell: any;
  bidLength: any;

  buyOrderForm: any = {};
  buyOrdersPage = new Page();
  buyOrdersRows = new Array<any>();
  enableBuy: any;
  askLength: any;

  chart: AmChart;

  constructor(
    private assetsService: AssetsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private quantToAmountPipe: QuantToAmountPipe,
    private shareToQuantityPipe: ShareToQuantityPipe,
    private quantityToSharePipe: QuantityToSharePipe,
    private numericalStringPipe: NumericalStringPipe,
    private rateTqtToPricePipe: RateTqtToPricePipe,
    private amChartsService: AmChartsService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.accountRs = this.commonService.getAccountDetailsFromSession(
      "accountRs"
    );
    this.route.params.subscribe((params: any) => {
      this.assetId = params.id;
      this.getAsset();
      this.getSellOrders();
      this.getBuyOrders();
      this.getAssetLastTrades();
    });
    RootScope.onChange.subscribe(data => {
      this.balanceTQT = data["balanceTQT"];
    });
    RootScope.set({});
  }
  getAsset() {
    this.assetsService
      .getAsset(this.assetId, true)
      .subscribe((success: any) => {
        this.assetDetails = success;
        this.decimals = success.decimals;

        this.assetsService
          .getAccountSingleAsset(this.accountRs, this.assetId)
          .subscribe((success: any) => {
            this.accountDetails = success;
            this.quantityQNT = success.quantityQNT;
            this.unconfirmedQuantityQNT = success.unconfirmedQuantityQNT;
          });
      });
  }
  buyFormOnChange() {
    this.buyOrderForm.totalPrice = this.numericalStringPipe.transform(
      parseFloat(this.buyOrderForm.quantity * this.buyOrderForm.price + "")
    );
    if (
      this.buyOrderForm.price &&
      this.buyOrderForm.quantity &&
      this.askLength
    ) {
      var askQuantityQnt = this.shareToQuantityPipe.transform(
        this.buyOrderForm.quantity,
        this.decimals
      );
      if (askQuantityQnt <= this.assetDetails.quantityQNT) {
        this.enableBuy = true;
      } else {
        this.enableBuy = false;
      }
      this.enableBuy = true;
    } else {
      this.enableBuy = false;
    }
  }

  sellFormOnChange() {
    this.askOrderForm.totalPrice = this.numericalStringPipe.transform(
      parseFloat(this.askOrderForm.quantity * this.askOrderForm.price + "")
    );
    if (
      this.askOrderForm.price &&
      this.askOrderForm.quantity &&
      this.bidLength
    ) {
      if (
        this.unconfirmedQuantityQNT &&
        this.askOrderForm.price &&
        this.askOrderForm.quantity
      ) {
        var sellQuantityQnt = this.shareToQuantityPipe.transform(
          this.askOrderForm.quantity,
          this.decimals
        );
        if (sellQuantityQnt <= this.unconfirmedQuantityQNT) {
          this.enableSell = true;
        } else {
          this.enableSell = false;
        }
      } else {
        this.enableSell = false;
      }
    }
  }

  placeOrderClick(buyOrderForm, type) {
    var data = {
      assetId: this.assetId,
      price: buyOrderForm.price,
      quantity: buyOrderForm.quantity,
      requestType: type,
      decimals: this.decimals,
      asset: this.assetDetails.name
    };
    if (type === "ask") {
      DataStoreService.set("sell-asset", data);
      this.router.navigate(["sell"], { relativeTo: this.route });
    } else {
      DataStoreService.set("buy-asset", data);
      this.router.navigate(["buy"], { relativeTo: this.route });
    }
  }

  getSellOrders(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.sellOrdersPage.pageNumber = pageInfo.offset;

    var observablesArray = [];
    var assetOrders = this.assetsService.getAssetOrders(
      this.assetId,
      this.assetsService.GET_ASSET_ORDERS.ASK_ORDER,
      this.sellOrdersPage.pageNumber * 10,
      (this.sellOrdersPage.pageNumber + 1) * 10 - 1
    );
    var assetDetails = this.assetsService.getAsset(this.assetId, true);
    observablesArray.push(assetOrders);
    if (!this.decimals) {
      observablesArray.push(assetDetails);
    }

    observableForkJoin(observablesArray).subscribe((successNext: any) => {
      let [offersResponse, assetDetailsResponse] = successNext;
      if (assetDetailsResponse) {
        this.decimals = assetDetailsResponse.decimals;
      }
      this.bidLength = offersResponse.askOrders
        ? offersResponse.askOrders.length
        : 0;
      this.sellOrdersRows = offersResponse.askOrders;
      if (
        this.sellOrdersPage.pageNumber === 0 &&
        this.sellOrdersRows.length < 10
      ) {
        this.sellOrdersPage.totalElements = this.sellOrdersRows.length;
      } else if (
        this.sellOrdersPage.pageNumber > 0 &&
        this.sellOrdersRows.length < 10
      ) {
        this.sellOrdersPage.totalElements =
          this.sellOrdersPage.pageNumber * 10 + this.sellOrdersRows.length;
        this.sellOrdersPage.totalPages = this.sellOrdersPage.pageNumber;
      }
    });
  }
  getBuyOrders(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.buyOrdersPage.pageNumber = pageInfo.offset;

    var observablesArray = [];
    var assetOrders = this.assetsService.getAssetOrders(
      this.assetId,
      this.assetsService.GET_ASSET_ORDERS.BID_ORDER,
      this.buyOrdersPage.pageNumber * 10,
      (this.buyOrdersPage.pageNumber + 1) * 10 - 1
    );
    var assetDetails = this.assetsService.getAsset(this.assetId);
    observablesArray.push(assetOrders);
    if (!this.decimals) {
      observablesArray.push(assetDetails);
    }

    observableForkJoin(observablesArray).subscribe((successNext: any) => {
      let [offersResponse, currencyDetailsResponse] = successNext;
      if (currencyDetailsResponse) {
        this.decimals = currencyDetailsResponse.decimals;
      }
      this.askLength = offersResponse.bidOrders
        ? offersResponse.bidOrders.length
        : 0;

      this.buyOrdersRows = offersResponse.bidOrders;
      if (
        this.buyOrdersPage.pageNumber === 0 &&
        this.buyOrdersRows.length < 10
      ) {
        this.buyOrdersPage.totalElements = this.buyOrdersRows.length;
      } else if (
        this.buyOrdersPage.pageNumber > 0 &&
        this.buyOrdersRows.length < 10
      ) {
        this.buyOrdersPage.totalElements =
          this.buyOrdersPage.pageNumber * 10 + this.buyOrdersRows.length;
        this.buyOrdersPage.totalPages = this.buyOrdersPage.pageNumber;
      }
    });
  }
  getAssetLastTrades(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.tradesPage.pageNumber = pageInfo.offset;

    this.assetsService
      .getAssetLastTrades(
        this.assetId,
        this.tradesPage.pageNumber * 10,
        (this.tradesPage.pageNumber + 1) * 10 - 1
      )
      .subscribe((response: any) => {
        this.tradeData = this.getTradeData(response.trades);
        this.labels = Array.apply(null, { length: response.trades.length }).map(
          Number.call,
          Number
        );
        this.lastTrade = response.trades[0] || {};

        this.tradesRows = response.trades;
        if (this.tradesPage.pageNumber === 0 && this.tradesRows.length < 10) {
          this.tradesPage.totalElements = this.tradesRows.length;
        } else if (
          this.tradesPage.pageNumber > 0 &&
          this.tradesRows.length < 10
        ) {
          this.tradesPage.totalElements =
            this.tradesPage.pageNumber * 10 + this.tradesRows.length;
          this.tradesPage.totalPages = this.tradesPage.pageNumber;
        }
        if (this.lastTrade) {
          this.renderChart();
        }
      });
  }
  getTradeData(trades) {
    var maxSize = 50;
    var optionSize = trades.length;
    if (optionSize > maxSize) {
      optionSize = maxSize;
    }
    var resultArray = [];
    for (var i = 0; i < optionSize; i++) {
      var x = optionSize - i;
      var price = this.quantToAmountPipe.transform(
        this.shareToQuantityPipe.transform(trades[i].priceTQT, this.decimals)
      );
      var quantity = this.quantityToSharePipe.transform(
        trades[i].quantityQNT,
        this.decimals
      );

      resultArray.unshift({ x, price, quantity });
    }
    return resultArray;
  }
  fillSellOrderForm(row) {
    this.askOrderForm.price =
      (row.priceTQT * Math.pow(10, row.decimals)) / 100000000; // this.rateTqtToPricePipe.transform(row.priceTQT, row.decimals) ;
    this.askOrderForm.quantity = this.quantityToSharePipe.transform(
      row.quantityQNT,
      row.decimals
    );
    this.askOrderForm.totalPrice = this.numericalStringPipe.transform(
      this.quantToAmountPipe.transform(row.priceTQT) * row.quantityQNT
    );
  }
  fillBuyOrderForm(row) {
    this.buyOrderForm.price =
      (row.priceTQT * Math.pow(10, row.decimals)) / 100000000;
    this.buyOrderForm.quantity = this.quantityToSharePipe.transform(
      row.quantityQNT,
      row.decimals
    );
    this.buyOrderForm.totalPrice = this.numericalStringPipe.transform(
      this.quantToAmountPipe.transform(row.priceTQT) * row.quantityQNT
    );
  }
  renderChart() {
    this.chart = this.amChartsService.makeChart("assetChartDiv", {
      type: "serial",
      theme: "light",
      fontFamily: "Montserrat",
      pathToImages: "/assets/images/",
      panEventsEnabled: false,
      dataProvider: this.tradeData,
      color: "#2B2929",
      maxZoomFactor: 20,
      synchronizeGrid: true,
      valueAxes: [
        {
          id: "v1",
          axisColor: "#02C850",
          axisThickness: 2,
          axisAlpha: 1,
          position: "right"
        },
        {
          id: "v2",
          axisColor: "#9E9E9E",
          axisThickness: 2,
          axisAlpha: 1,
          position: "left"
        }
      ],
      plotAreaBorderColor: "#F00",
      graphs: [
        {
          valueAxis: "v1",
          fillAlphas: 0.4,
          valueField: "price",
          fillColors: ["#02C850", "#ffffff"],
          lineAlpha: 1,
          lineColor: "#02C850",
          lineThickness: 2,
          balloonText: "<div> Price (right axis): <b>[[value]]</b></div>"
        },
        {
          valueAxis: "v2",
          fillAlphas: 0.4,
          valueField: "quantity",
          type: "column",
          clustered: false,
          columnWidth: 0.5,
          lineColor: "#9E9E9E",
          fillColors: "#9E9E9E",
          balloonText: "<div><b>[[value]]</b></div>"
        }
      ],
      chartCursor: {
        cursorPosition: "mouse"
      },
      categoryField: "x",
      categoryAxis: {
        parseDates: false,
        axisColor: "#DADADA",
        minorGridEnabled: true
      },
      export: {
        enabled: true,
        position: "bottom-right"
      }
    });
  }
  goToDetails(value) {
    DataStoreService.set("transaction-details", {
      id: value,
      type: "onlyID",
      view: "transactionDetail"
    });
    this.router.navigate(["transaction-details"], { relativeTo: this.route });
  }

  openAccountDetails(accountID) {
    this.router.navigate(["account-details"], {
      queryParams: { id: accountID },
      relativeTo: this.route
    });
  }

  openAssetDetails(code) {
    this.router.navigate(["asset-details"], {
      queryParams: { id: code },
      relativeTo: this.route
    });
  }
}
