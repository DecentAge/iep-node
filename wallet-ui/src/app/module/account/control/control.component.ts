import { Component, OnInit } from "@angular/core";
import { AccountService } from "../account.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { DataStoreService } from "../../../services/data-store.service";
import { Page } from "../../../config/page";
import { AppConstants } from "../../../config/constants";
import { SessionStorageService } from "../../../services/session-storage.service";
import { CryptoService } from "../../../services/crypto.service";
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { TransactionService } from "../../../services/transaction.service";
import { CommonService } from "../../../services/common.service";
import { promise } from "protractor";
import { resolve } from "path";
import { reject } from "q";

@Component({
  selector: "app-control",
  templateUrl: "./control.component.html",
  styleUrls: ["./control.component.scss"]
})
export class ControlComponent implements OnInit {
  page = new Page();
  rows = new Array<any>();

  accountId = "";
  accountRs = "";
  hasControl = true;
  jsonControl = "";
  removeControlModalFlag = false;
  publicKey: any;

  openBookMarks = false;
  bookMarkIndex = 0;

  setAccountControlForm: any = {
    approveAccounts: []
  };
  removeAccountControlForm: any = {};

  tx_fee: any;
  tx_amount: any;
  tx_total: any;
  transactionBytes: any;
  validBytes = false;
  unsignedTx: boolean;

  constructor(
    public accountService: AccountService,
    public sessionStorageService: SessionStorageService,
    public route: ActivatedRoute,
    public _location: Location,
    public cryptoService: CryptoService,
    public commonService: CommonService,
    public transactionService: TransactionService,
    public router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  addNewAccount() {
    if (this.setAccountControlForm.approveAccounts.length >= 10) {
      let title: string = this.commonService.translateAlertTitle("Error");
      let errMsg: string = this.commonService.translateInfoMessage(
        "control-add-accounts-error-msg"
      );
      alertFunctions
        .InfoAlertBox(title, errMsg, "OK", "error")
        .then((isConfirm: any) => {});
    } else {
      this.setAccountControlForm.approveAccounts.push({});
    }
  }

  ngOnInit() {
    this.accountId = this.accountService.getAccountDetailsFromSession(
      "accountId"
    );
    this.accountRs = this.accountService.getAccountDetailsFromSession(
      "accountRs"
    );
    this.hasControl = this.sessionStorageService.getFromSession(
      AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY
    );
    this.jsonControl = this.sessionStorageService.getFromSession(
      AppConstants.controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY
    );
    this.removeAccountControlForm.jsonControl = this.jsonControl;
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.transactionService.getBlockChainStatus().subscribe(success => {
      // this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK, success.numberOfBlocks);
    });
    this.accountService
      .getVoterPhasedTransactions(
        this.accountId,
        this.page.pageNumber * 10,
        (this.page.pageNumber + 1) * 10 - 1
      )
      .subscribe(response => {
        this.rows = response.transactions;
        this.getAprrovedTransactionNumber();
      });
  }
  getAprrovedTransactionNumber() {
    this.rows.forEach((item, index) => {
      this.getApprovedNumber(item.transaction, index);
    });
  }
  getApprovedNumber(transactionId, index) {
    this.accountService.getApprovalAccountList(transactionId).subscribe(
      (success: any) => {
        this.rows[index].approvals =
          success.votes.length +
          "/" +
          this.rows[index].attachment["phasingQuorum"];

        this.rows = [...this.rows];
      },
      error => {
        console.log(error);
      }
    );
  }

  goToDetails(row) {
    DataStoreService.set("transaction-details", {
      id: row.transaction,
      type: "onlyID",
      view: "transactionDetail"
    });
    this.router.navigate(["/account/control/transaction-details"]);
  }
  goToApproveRequest(row) {
    DataStoreService.set("approve", {
      transaction: row.transaction,
      fullhash: row.fullHash,
      sender: row.senderRS,
      recipient: row.recipientRS,
      amount: row.amountTQT,
      timestamp: row.timestamp,
      type: row.type,
      subtype: row.subtype
    });
    this.router.navigate(["/account/control/control-approve"]);
  }

  accountDetail(accountID) {
    this.router.navigate(["/account/control/account-details"], {
      queryParams: { id: accountID }
    });
  }

  reload() {
    this.setPage({ offset: 0 });
  }

  bookmarkSelected(e) {
    this.setAccountControlForm.approveAccounts[this.bookMarkIndex].value =
      e.accountRS; // {value: e.data.account};
    this.openBookMarks = false;
  }

  indexTracker(index: number, value: any) {
    return index;
  }

  loadBookmarkView(index) {
    this.bookMarkIndex = index;
    this.openBookMarks = true;
  }

  goBack() {
    this.openBookMarks = false;
  }

  validateForm() {
    var form = this.setAccountControlForm;
    var quorum = this.setAccountControlForm.quorum || 2;
    var totalAccounts = this.setAccountControlForm.approveAccounts || [];

    if (totalAccounts.length > quorum) {
      this.setAccountControl();
    } else {
      let title: string = this.commonService.translateAlertTitle("Error");
      let errMsg: string = this.commonService.translateInfoMessage(
        "control-quorum-number-error-msg"
      );
      alertFunctions
        .InfoAlertBox(title, errMsg, "OK", "error")
        .then((isConfirm: any) => {});
    }
  }

  setAccountControl() {
    var setAccountControlForm = this.setAccountControlForm;
    var quorum = setAccountControlForm.quorum;
    var accounts = [];

    accounts = setAccountControlForm.approveAccounts.map(elem => {
      return elem.value;
    });

    var fee = 1;
    var publicKey = this.commonService.getAccountDetailsFromSession(
      "publicKey"
    );
    var secret = setAccountControlForm.secretPhrase;
    var secretPhraseHex;
    if (secret) {
      secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
    } else {
      secretPhraseHex = this.sessionStorageService.getFromSession(
        AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY
      );
    }
    this.accountService
      .setAccountControl(publicKey, quorum, accounts, fee)
      .subscribe(success => {
        if (!success.errorCode) {
          var unsignedBytes = success.unsignedTransactionBytes;
          var signatureHex = this.cryptoService.signatureHex(
            unsignedBytes,
            secretPhraseHex
          );
          this.transactionBytes = this.cryptoService.signTransactionHex(
            unsignedBytes,
            signatureHex
          );
          this.validBytes = true;

          this.tx_fee = success.transactionJSON.feeTQT / 100000000;
          this.tx_amount = success.transactionJSON.amountTQT / 100000000;
          this.tx_total = this.tx_fee + this.tx_amount;
        } else {
          let title: string = this.commonService.translateAlertTitle("Error");
          let errMsg: string = this.commonService.translateErrorMessageParams(
            "sorry-error-occurred",
            success
          );
          alertFunctions
            .InfoAlertBox(title, errMsg, "OK", "error")
            .then((isConfirm: any) => {});
        }
      });
  }
  removeControlModal() {
    this.removeControlModalFlag = true;
  }
  removeAccountControl() {
    var removeAccountControlForm = this.removeAccountControlForm;
    var fee = 1;
    var publicKey = this.commonService.getAccountDetailsFromSession(
      "publicKey"
    );
    var secret = removeAccountControlForm.secretPhrase;
    var secretPhraseHex;
    if (secret) {
      secretPhraseHex = this.cryptoService.secretPhraseToPrivateKey(secret);
    } else {
      secretPhraseHex = this.sessionStorageService.getFromSession(
        AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY
      );
    }
    this.accountService
      .removeAccountControl(publicKey, fee)
      .subscribe(success_ => {
        success_.subscribe(success => {
          if (!success.errorCode) {
            var unsignedBytes = success.unsignedTransactionBytes;
            var signatureHex = this.cryptoService.signatureHex(
              unsignedBytes,
              secretPhraseHex
            );
            this.transactionBytes = this.cryptoService.signTransactionHex(
              unsignedBytes,
              signatureHex
            );

            this.validBytes = true;
            this.tx_fee = success.transactionJSON.feeTQT / 100000000;
          } else {
            let title: string = this.commonService.translateAlertTitle("Error");
            let errMsg: string = this.commonService.translateErrorMessageParams(
              "sorry-error-occurred",
              success
            );
            alertFunctions
              .InfoAlertBox(title, errMsg, "OK", "error")
              .then((isConfirm: any) => {});
          }
        });
      });
  }

  broadcastTransaction(transactionBytes) {
    this.accountService
      .broadcastTransaction(transactionBytes)
      .subscribe(success => {
        if (!success.errorCode) {
          let title: string = this.commonService.translateAlertTitle("Success");
          let msg: string = this.commonService.translateInfoMessage(
            "success-broadcast-message"
          );
          msg += success.transaction;
          alertFunctions
            .InfoAlertBox(title, msg, "OK", "success")
            .then((isConfirm: any) => {
              this.router.navigate(["/account/transactions"]);
            });
        } else {
          let title: string = this.commonService.translateAlertTitle("Error");
          let errMsg: string = this.commonService.translateErrorMessage(
            "unable-broadcast-transaction",
            success
          );
          alertFunctions
            .InfoAlertBox(title, errMsg, "OK", "error")
            .then((isConfirm: any) => {});
        }
      });
  }
}
