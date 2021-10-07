
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { CurrenciesService } from "../currencies.service";
import { AccountService } from "../../account/account.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from "../../../config/constants";
import { DataStoreService } from "../../../services/data-store.service";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { Page } from "../../../config/page";
import "rxjs/add/observable/forkJoin";
import { QuantToAmountPipe } from "../../../pipes/quant-to-amount.pipe";
import { ShareToQuantityPipe } from "../../../pipes/share-to-quantity.pipe";
import { QuantityToSharePipe } from "../../../pipes/quantity-to-share.pipe";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { RootScope } from "../../../config/root-scope";
import { NumericalStringPipe } from "../../../pipes/numerical-string.pipe";

@Component({
  selector: "app-trade-desk",
  templateUrl: "./trade-desk.component.html",
  styleUrls: ["./trade-desk.component.scss"]
})
export class TradeDeskComponent implements OnInit {
  currencyId: any;
  currencyDetails: any = {};
  decimals: any = 0;

  accountDetails: any = {};
  units: any;
  unconfirmedUnits: any;

  accountId = "";
  accountRs = "";
  balanceTQT = 0;

  exchangesPage = new Page();
  exchangesRows = new Array<any>();
  tradeData: any = {};
  labels = new Array<any>();
  lastTrade: any = {};

  askOrderForm: any = {};
  sellOffersPage = new Page();
  sellOffersRows = new Array<any>();
  enableSell: any;
  bidLength: any;

  buyOrderForm: any = {};
  buyOffersPage = new Page();
  buyOffersRows = new Array<any>();
  enableBuy: any;
  askLength: any;

  chart: AmChart;

  constructor(
    private currenciesService: CurrenciesService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private quantToAmountPipe: QuantToAmountPipe,
    private shareToQuantityPipe: ShareToQuantityPipe,
    private quantityToSharePipe: QuantityToSharePipe,
    private amChartsService: AmChartsService,
    private numericalStringPipe: NumericalStringPipe
  ) {}

  ngOnInit() {
    this.getCurrency();
    this.getDeskExchanges();
    this.getSellOffers();
    this.getBuyOffers();
    RootScope.onChange.subscribe(data => {
      this.balanceTQT = data["balanceTQT"];
    });
    RootScope.set({});
  }

  getCurrency() {
    this.accountRs = this.accountService.getAccountDetailsFromSession(
      "accountRs"
    );

    this.route.params.subscribe(params => {
      this.currencyId = params["id"];
      this.currenciesService
        .getCurrencyById(this.currencyId)
        .subscribe(success => {
          this.currencyDetails = success;
          this.decimals = success.decimals;

          this.currenciesService
            .getSingleAccountCurrency(this.accountRs, this.currencyId)
            .subscribe(success => {
              this.accountDetails = success;
              this.units = success.units;
              this.unconfirmedUnits = success.unconfirmedUnits;
            });
        });
    });
  }

  hasBuyOffers() {
    if (this.bidLength > 0) {
      return true;
    } else {
      return false;
    }
  }

  hasSellOffers() {
    if (this.askLength > 0) {
      return true;
    } else {
      return false;
    }
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
      this.enableBuy = true;
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
      this.enableSell = true;
    }
  }

  placeOrderClick(buyOrderForm, type) {
    var data = {
      currencyId: this.currencyId,
      rate: buyOrderForm.price,
      shares: buyOrderForm.quantity,
      requestType: type,
      decimals: this.decimals,
      currency: this.currencyDetails.name
    };
    if (type === "ask") {
      DataStoreService.set("sell-currency", data);
      this.router.navigate(["sell"], { relativeTo: this.route });
    } else {
      DataStoreService.set("buy-currency", data);
      this.router.navigate(["buy"], { relativeTo: this.route });
    }
  }

  getDeskExchanges(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.exchangesPage.pageNumber = pageInfo.offset;

    this.currenciesService
      .getDeskExchanges(
        this.currencyId,
        this.exchangesPage.pageNumber * 10,
        (this.exchangesPage.pageNumber + 1) * 10 - 1
      )
      .subscribe(response => {
        this.tradeData = this.getTradeData(response.exchanges);
        this.labels = Array.apply(null, {
          length: response.exchanges.length
        }).map(Number.call, Number);
        this.lastTrade = response.exchanges[0] || {};

        this.exchangesRows = response.exchanges;

        if (this.lastTrade) {
          this.renderChart();
        }
      });
  }

  getBuyOffers(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.buyOffersPage.pageNumber = pageInfo.offset;

    var observablesArray = [];
    var currencyOrders = this.currenciesService.getBuyOffers(
      undefined,
      this.currencyId,
      this.buyOffersPage.pageNumber * 10,
      (this.buyOffersPage.pageNumber + 1) * 10 - 1
    );
    var currencyDetails = this.currenciesService.getCurrencyById(
      this.currencyId
    );
    observablesArray.push(currencyOrders);
    if (!this.decimals) {
      observablesArray.push(currencyDetails);
    }

    observableForkJoin(observablesArray).subscribe((successNext: any) => {
      let [offersResponse, currencyDetailsResponse] = successNext;
      if (currencyDetailsResponse) {
        this.decimals = currencyDetailsResponse.decimals;
      }
      if (pageInfo.offset == 0) {
        this.bidLength = offersResponse.offers
          ? offersResponse.offers.length
          : 0;
      }
      this.buyOffersRows = offersResponse.offers;
    });
  }

  getSellOffers(pageInfo?) {
    if (!pageInfo) {
      pageInfo = { offset: 0 };
    }

    this.sellOffersPage.pageNumber = pageInfo.offset;

    var observablesArray = [];
    var currencyOrders = this.currenciesService.getSellOffers(
      undefined,
      this.currencyId,
      this.sellOffersPage.pageNumber * 10,
      (this.sellOffersPage.pageNumber + 1) * 10 - 1
    );
    var currencyDetails = this.currenciesService.getCurrencyById(
      this.currencyId
    );
    observablesArray.push(currencyOrders);
    if (!this.decimals) {
      observablesArray.push(currencyDetails);
    }

    observableForkJoin(observablesArray).subscribe((successNext: any) => {
      let [offersResponse, currencyDetailsResponse] = successNext;
      if (currencyDetailsResponse) {
        this.decimals = currencyDetailsResponse.decimals;
      }
      if (pageInfo.offset == 0) {
        this.askLength = offersResponse.offers
          ? offersResponse.offers.length
          : 0;
      }
      this.sellOffersRows = offersResponse.offers;
    });
  }

  openPublishExchangeOffer(currencyId, decimals, ticker, name) {
    DataStoreService.set("publish-exchange-offer", {
      currencyId,
      decimals,
      ticker,
      name
    });
    this.router.navigate(["publish-exchange-offer"], {
      relativeTo: this.route
    });
  }

  openPublishExchangeBuyOffer(currencyId, decimals, ticker, name) {
    DataStoreService.set("publish-exchange-buy-offer", {
      currencyId,
      decimals,
      ticker,
      name
    });
    this.router.navigate(["publish-exchange-buy-offer"], {
      relativeTo: this.route
    });
  }

  openPublishExchangeSellOffer(currencyId, decimals, ticker, name) {
    DataStoreService.set("publish-exchange-sell-offer", {
      currencyId,
      decimals,
      ticker,
      name
    });
    this.router.navigate(["publish-exchange-sell-offer"], {
      relativeTo: this.route
    });
  }

  getTradeData(trades) {
    var optionSize = trades.length;
    var resultArray = [];
    for (var i = 0; i < optionSize; i++) {
      var x = optionSize - i;
      var price = this.quantToAmountPipe.transform(
        this.shareToQuantityPipe.transform(trades[i].rateTQT, this.decimals)
      );
      var quantity = this.quantityToSharePipe.transform(
        trades[i].units,
        this.decimals
      );

      resultArray.unshift({ x, price, quantity });
    }
    return resultArray;
  }

  renderChart() {
    this.chart = this.amChartsService.makeChart("currencyChartDiv", {
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

  openCurrencyDetails(code) {
    this.router.navigate(["currency-details"], {
      queryParams: { id: code },
      relativeTo: this.route
    });
  }
}
