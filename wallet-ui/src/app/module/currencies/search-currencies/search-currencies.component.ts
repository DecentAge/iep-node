
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CurrenciesService } from '../currencies.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../../config/constants';
import { DataStoreService } from '../../../services/data-store.service';
import * as alertFunctions from "../../../shared/data/sweet-alerts";

@Component({
    selector: 'app-search-currencies',
    templateUrl: './search-currencies.component.html',
    styleUrls: ['./search-currencies.component.scss']
})
export class SearchCurrenciesComponent {

    rows = new Array<any>();
    searchQuery: any;

    constructor(private currenciesService: CurrenciesService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    onSearchChange(query) {
        if (query != '') {

            var nameSearch = this.currenciesService.searchCurrencies(query);
            var idSearch = this.currenciesService.getCurrencyById(query);

            observableForkJoin(nameSearch, idSearch)
                .subscribe((successNext: any) => {
                    let [result1, result2] = successNext;

                    if (result2.currency) {
                        result1.currencies = result1.currencies || [];
                        result1.currencies.push(result2);
                    }
                    this.rows = result1.currencies;

                });
        }
    }

    openAccountDetails(accountID) {
        this.router.navigate(['/currencies/search-currencies/account-details'], { queryParams: { id: accountID } });
    }

    openCurrencyDetails(code) {
        this.router.navigate(['/currencies/search-currencies/currency-details'], { queryParams: { id: code } });
    }

    openTradeDesk(code) {
        this.router.navigate(['/currencies/trade', code]);
    }
}
