import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from "../../../../config/page";
import { ExtensionsService } from "../../extensions.service";
import { SearchService } from "../../../../shared/search/search.service";
import { AppConstants } from "../../../../config/constants";
import { DataStoreService } from "../../../../services/data-store.service";

@Component({
  selector: 'app-unconfirmed',
  templateUrl: './unconfirmed.component.html',
  styleUrls: ['./unconfirmed.component.scss']
})
export class UnconfirmedComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public extensionsService: ExtensionsService, public router: Router, public searchService: SearchService) {

    }

    ngOnInit() {
        this.setPage({ offset: 0 });
    }

    setPage(pageInfo) {
        this.extensionsService.getUnconfirmedTransactions().subscribe((success: any) => {
            this.rows = success.unconfirmedTransactions;
        });
    }

    reload() {
        this.setPage({ offset: 0 });
    }

    searchValue(searchTerm) {
        if (searchTerm) {
            if (searchTerm.toString().startsWith(AppConstants.searchConfig.searchAccountString)) {
                this.router.navigate(['/tools/chain-viewer/account-details'], { queryParams: { id: searchTerm } });
            } else if (!isNaN(searchTerm)) {
                DataStoreService.set('transaction-details', { id: searchTerm, type: 'onlyID', view: 'transactionDetail' });
                this.router.navigate(['/tools/chain-viewer/transaction-details']);
            }
        }
    }

}
