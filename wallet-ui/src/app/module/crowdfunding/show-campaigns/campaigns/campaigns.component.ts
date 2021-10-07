import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../../account/account.service";
import { CrowdfundingService } from "../../crowdfunding.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from "../../../../services/data-store.service";
import { SessionStorageService } from "../../../../services/session-storage.service";
import { AppConstants } from "../../../../config/constants";
import { Page } from "../../../../config/page";

@Component({
  selector: "app-campaigns",
  templateUrl: "./campaigns.component.html",
  styleUrls: ["./campaigns.component.scss"]
})
export class CampaignsComponent implements OnInit {
  page = new Page();
  rows = new Array<any>();
  currentHeight: any;

  campaignType: any = "ALL";

  constructor(
    private accountService: AccountService,
    private crowdfundingService: CrowdfundingService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  accountId = "";
  accountRs = "";

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.campaignType = data.campaignType;

      if (this.campaignType === "MY") {
        this.accountId = this.accountService.getAccountDetailsFromSession(
          "accountId"
        );
        this.accountRs = this.accountService.getAccountDetailsFromSession(
          "accountRs"
        );
      }

      this.currentHeight = this.sessionStorageService.getFromSession(
        AppConstants.baseConfig.SESSION_CURRENT_BLOCK
      );

      this.setPage({ offset: 0 });
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.crowdfundingService
      .getAllCampaigns(
        this.page.pageNumber * 10,
        (this.page.pageNumber + 1) * 10 - 1,
        this.accountId
      )
      .subscribe(response => {
        this.rows = response.currencies;
        if (this.page.pageNumber === 0 && this.rows.length < 10) {
          this.page.totalElements = this.rows.length;
        } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
          this.page.totalElements =
            this.page.pageNumber * 10 + this.rows.length;
          this.page.totalPages = this.page.pageNumber;
        }
      });
  }

  goToDetails(value) {
    DataStoreService.set("transaction-details", {
      id: value,
      type: "onlyID",
      view: "transactionDetail"
    });
    this.router.navigate(["/crowdfunding/show-campaigns/transaction-details"]);
  }

  openCurrencyDetails(code) {
    this.router.navigate(["/crowdfunding/show-campaigns/currency-details"], {
      queryParams: { id: code }
    });
  }

  openFoundersCampaign(code) {
    this.router.navigate(["/crowdfunding/show-campaigns/reserve-founders"], {
      queryParams: { id: code }
    });
  }
  openTradeDesk(code) {
    this.router.navigate(["/currencies/trade", code]);
  }

  openReserveCampaign(
    value,
    decimals,
    minReservePerUnitTQT,
    code,
    reserveSupply
  ) {
    DataStoreService.set("reserve-units", {
      id: value,
      decimals,
      minReservePerUnitTQT,
      code,
      reserveSupply
    });
    this.router.navigate(["/crowdfunding/show-campaigns/reserve-units"]);
  }

  calculateHeightDiff(data, row) {
    var diffHeight = row.issuanceHeight - this.currentHeight;
    return diffHeight < 0 ? 0 : diffHeight;
  }

  calculateDays(data, row) {
    var diffHeight = row.issuanceHeight - this.currentHeight;
    var days = 0;

    if (this.currentHeight && this.currentHeight < data) {
      days = (parseInt(data) - this.currentHeight) / 1440;
    } else {
      days = 0;
    }

    if (days < 0) {
      days = 0;
    }

    return days.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  }

  isTradeEnabled(row) {
    return row.issuanceHeight - this.currentHeight > 0 ? true : false;
  }

  isReserveEnabled(row) {
    return row.issuanceHeight - this.currentHeight <= 0 ? true : false;
  }

  accountDetail(accountID) {
    this.router.navigate(["/account/transactions/user-details"], {
      queryParams: { id: accountID }
    });
  }

  reload() {
    this.setPage({ offset: 0 });
  }
}
