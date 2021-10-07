
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../../account/account.service";
import { ShufflingService } from "../../shuffling.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from "../../../../services/data-store.service";
import { CryptoService } from "../../../../services/crypto.service";
import { SessionStorageService } from "../../../../services/session-storage.service";
import { AppConstants } from "../../../../config/constants";
import * as alertFunctions from "../../../../shared/data/sweet-alerts";
import { Page } from "../../../../config/page";
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: "app-shufflings",
    templateUrl: "./shufflings.component.html",
    styleUrls: ["./shufflings.component.scss"]
})
export class ShufflingsComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();
    currentHeight: any;

    shufflingType: any = "ALL";

    constructor(
        private accountService: AccountService,
        private shufflingService: ShufflingService,
        private route: ActivatedRoute,
        private router: Router,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        private commonService: CommonService
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    accountId = "";
    accountRs = "";
    secretPhraseHex = "";
    secretPhrase = "";
    shufflersState: any = {};
    includeFinished = false;

    removeFilter() {
        this.includeFinished = false;

        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({ offset: 0 });
    }

    filters = [
        {
            name: "Active Shuffles",
            icon: "fa-minus",
            popoverText: "Active Shuffles",
            isEnabled: false
        },
        {
            name: "All Shuffles",
            icon: "fa-plus",
            popoverText: "All Shuffles",
            isEnabled: false
        }
    ];

    applyFilter(filter) {
        switch (filter.name) {
            case "Active Shuffles":
                this.includeFinished = false;
                break;
            case "All Shuffles":
                this.includeFinished = true;
        }

        this.filters.forEach(obj => {
            obj.isEnabled = obj.name == filter.name ? true : false;
        });

        this.setPage({ offset: 0 });
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.shufflingType = data.shufflingType;

            this.accountId = this.accountService.getAccountDetailsFromSession(
                "accountId"
            );
            this.accountRs = this.accountService.getAccountDetailsFromSession(
                "accountRs"
            );
            this.secretPhraseHex = this.sessionStorageService.getFromSession(
                AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY
            );
            this.secretPhrase = this.cryptoService.secretPhraseFromPrivateKey(
                this.secretPhraseHex
            );

            this.currentHeight = this.sessionStorageService.getFromSession(
                AppConstants.baseConfig.SESSION_CURRENT_BLOCK
            );

            this.setPage({ offset: 0 });
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = (this.page.pageNumber + 1) * 10 - 1;

        if (this.shufflingType == "ALL") {
            this.shufflingService
                .getAllShufflings(startIndex, endIndex, this.includeFinished)
                .subscribe(response => {
                    this.rows = response.shufflings;
                    /*if (this.page.pageNumber === 0 && this.rows.length < 10) {
                      this.page.totalElements = this.rows.length;
                    } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                      this.page.totalElements =
                        this.page.pageNumber * 10 + this.rows.length;
                      this.page.totalPages = this.page.pageNumber;
                    }*/
                });
        } else {
            var shufflersPromise = this.shufflingService.getShufflers(
                undefined,
                this.accountId,
                undefined,
                this.secretPhrase
            );

            var accountShufflings = this.shufflingService.getAccountShufflings(
                this.accountId,
                startIndex,
                endIndex,
                this.includeFinished
            );

            const combined = observableForkJoin(accountShufflings, shufflersPromise);

            combined.subscribe((latestValues: any) => {
                var [
                    accountShufflingsResponse,
                    shufflersPromiseResponse
                ] = latestValues;
                shufflersPromiseResponse.shufflers.forEach(newValue => {
                    this.shufflersState[newValue.shuffling] = newValue;
                });

                this.rows = accountShufflingsResponse.shufflings || [];
                if (this.page.pageNumber === 0 && this.rows.length < 10) {
                    this.page.totalElements = this.rows.length;
                } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                    this.page.totalElements =
                        this.page.pageNumber * 10 + this.rows.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
        }
    }

    clearAllShufflers() {
        var clearShufflerPromise = this.shufflingService
            .getAccountShufflings(this.accountId, undefined, undefined, true)
            .subscribe(
                success => {
                    var existingShufflers = success.shufflings;
                    if (existingShufflers.length > 0) {
                        var observablesArray = [];
                        var maxLength = Math.min(existingShufflers.length, 10);
                        for (var i = 0; i < maxLength; i++) {
                            var current = existingShufflers[i];
                            if (current.stage === 4 || current.stage === 5) {
                                observablesArray.push(
                                    this.shufflingService.stopShuffler(
                                        current.shufflingFullHash,
                                        this.secretPhrase
                                    )
                                );
                            }
                        }
                        if (observablesArray.length > 0) {
                            observableForkJoin(observablesArray).subscribe(
                                (latestValues: any) => {
                                    const title: string = this.commonService.translateAlertTitle('Success');
                                    const msg: string = this.commonService.translateInfoMessage('shufflers-stop-success-msg');
                                    alertFunctions.InfoAlertBox(title,
                                        msg,
                                        'OK',
                                        'success').then((isConfirm: any) => {
                                        });
                                }
                            );
                        }
                    }
                },
                function (error) { }
            );
    }

    goToDetails(value) {
        DataStoreService.set("transaction-details", {
            id: value,
            type: "onlyID",
            view: "transactionDetail"
        });
        this.router.navigate(["/shuffling/show-shufflings/transaction-details"]);
    }

    openAccountDetails(accountID) {
        this.router.navigate(["/shuffling/show-shufflings/account-details"], {
            queryParams: { id: accountID }
        });
    }

    openShufflingDetails(shuffling) {
        this.router.navigate(["/shuffling/show-shufflings/shuffling-details"], {
            queryParams: { id: shuffling }
        });
    }

    openShufflingParticipants(shuffling) {
        this.router.navigate(
            ["/shuffling/show-shufflings/shuffling-participants"],
            { queryParams: { id: shuffling } }
        );
    }

    openAssetDetails(holding) {
        //TODO: redirect to assets-details in asset module
    }

    openCurrencyDetails(code) {
        //TODO: redirect to currency-details in currency module
    }

    startShuffle(shufflingFullHash, amount) {
        this.router.navigate(["/shuffling/show-shufflings/start-shuffling"], {
            queryParams: { id: shufflingFullHash }
        });
    }

    stopShuffle(shufflingFullHash) {
        this.router.navigate(["/shuffling/show-shufflings/stop-shuffling"], {
            queryParams: { id: shufflingFullHash }
        });
    }

    joinShuffle(shufflingFullHash, amount, shuffling, holding) {
        this.router.navigate(["/shuffling/show-shufflings/join-shuffling"], {
            queryParams: { id: shufflingFullHash, amount, shuffling, holding }
        });
    }

    canRegisterEnabled(row) {
        return row.stage > 0 || row.issuerRS === this.accountRs ? true : false;
    }

    canStartEnabled(row) {
        var canStartDisabled = row.stage !== 1;
        canStartDisabled = this.shufflersState[row.shuffling] ? true : false;

        return canStartDisabled;
    }

    canStopEnabled(row) {
        var canStopDisabled = row.stage !== 1;
        canStopDisabled = !this.shufflersState[row.shuffling] ? true : false;

        return canStopDisabled;
    }

    reload() {
        this.setPage({ offset: 0 });
    }
}
