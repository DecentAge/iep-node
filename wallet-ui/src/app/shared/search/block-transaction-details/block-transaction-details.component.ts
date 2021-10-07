
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from "../search.service";
import * as alertFunctions from "../../data/sweet-alerts";
import { AppConstants } from "../../../config/constants";
import { Page } from "../../../config/page";
import { DataStoreService } from "../../../services/data-store.service";

@Component({
    selector: 'app-block-transaction-details',
    templateUrl: './block-transaction-details.component.html',
    styleUrls: ['./block-transaction-details.component.scss']
})
export class BlockTransactionDetailsComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();
    transactions = new Array<any>();

    constructor(public _location: Location, public activatedRoute: ActivatedRoute, public searchService: SearchService, public router: Router) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe( (params: any) => {
            this.getBlockTransactionDetails(params.id);
        });
    }

    getBlockTransactionDetails(id) {
        observableForkJoin(
            this.searchService.searchBlocks(id),
            this.searchService.searchBlockById(id),
            this.searchService.searchTransactionById(id)
        ).subscribe((data: any) => {
            let [result1, result2, result3] = data;
            let row = [];

            if (!result1.errorCode) {
                row.push(result1);
                this.transactions = result1.transactions;
            } else if (!result2.errorCode) {
                row.push(result2);
                this.transactions = result2.transactions;
            } else {
                alertFunctions.InfoAlertBox(
                    "Error",
                    result1.errorDescription || result2.errorDescription,
                    "Ok",
                    "error").then((isConfirm: any) => {
                        this.goBack();
                });
            }

            if (!result3.errorCode) {
                if (result3.transaction) {
                    this.transactions = result3;
                }
            }
            this.rows = row;
        });
    }

    searchValue(searchTerm) {
        if (searchTerm) {
            if (searchTerm.toString().startsWith(AppConstants.searchConfig.searchAccountString)) {
                this.router.navigate(['/extensions/chain-viewer/account-details'], { queryParams: { id: searchTerm } });
            } else if (!isNaN(searchTerm)) {
                DataStoreService.set('transaction-details', { id: searchTerm, type: 'onlyID', view: 'blockDetail' });
                this.router.navigate(['/extensions/chain-viewer/block-details']);
            }
        }
    }

    searchTransaction(searchTerm) {
        DataStoreService.set('transaction-details', { id: searchTerm, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/extensions/chain-viewer/transaction-details']);
    }

    goBack(){
        this._location.back();
    }
}
