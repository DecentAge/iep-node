import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {Router} from '@angular/router';
import {AliasesService} from '../aliases.service';
import {DataStoreService} from '../../../services/data-store.service';

export class Page {
    //The number of elements in the page
    size: number = 10;
    //The total number of elements
    totalElements: number = 1000;
    //The total number of pages
    totalPages: number = 100;
    //The current page number
    pageNumber: number = 0;
}

@Component({
    selector: 'app-my-sell-offers',
    templateUrl: './my-sell-offers.component.html',
    styleUrls: ['./my-sell-offers.component.scss']
})
export class MySellOffersComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public commonService: CommonService,
                public router: Router,
                public aliasesService: AliasesService) {
    }

    ngOnInit() {
        this.setPage({offset: 0});
    }

    setPage(pageInfo) {
        console.error(pageInfo)
        this.page.pageNumber = pageInfo.offset;
        let account = this.commonService.getAccountDetailsFromSession('accountRs');
        this.aliasesService.getAliasesOpenOffers(account,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1).subscribe((response: any) => {
            if (!response.aliases) {
                response.aliases = {};
            }
            this.rows = response.aliases;
            if (this.page.pageNumber === 0 && this.rows.length < 10) {
                this.page.totalElements = this.rows.length;
            } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                this.page.totalPages = this.page.pageNumber;
            }
        });
    }

    transactionDetail(rowData) {
        DataStoreService.set('transaction-details', {id: rowData.aliasId, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/aliases/my-sell-offers/transaction-details']); // + row.fullHash
    }

    cancelAlias(aliasId, aliasName, priceTQT) {
        this.router.navigate(['/aliases/my-sell-offers/cancel-alias-sell'], {queryParams: {aliasId, aliasName, priceTQT}});
    }

    accountDetail(accountID) {
        this.router.navigate(['/aliases/my-sell-offers/account-details'], {queryParams: {id: accountID}});
    }

    reload() {
        this.setPage({offset: 0});
    }
}
