import {Component, OnInit} from '@angular/core';
import {AppConstants} from '../../../../config/constants';
import {AccountService} from '../../../account/account.service';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CryptoService} from '../../../../services/crypto.service';
import {AliasesService} from '../../aliases.service';
import {DataStoreService} from '../../../../services/data-store.service';
import {Page} from '../../../../config/page';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();
    currentHeight: any;
    aliases = {};
    sort_order: any = 'desc';
    sort_orderColumn: any = 'height';

    offerType: any = 'PRIVATE';

    accountId = '';
    accountRs = '';
    secretPhraseHex = '';
    secretPhrase = '';

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private aliasesService: AliasesService,
                private router: Router,
                private sessionStorageService: SessionStorageService,
                private cryptoService: CryptoService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    removeFilter() {
        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({offset: 0});
    }

    filters = [
        {name: 'Toggle A-Z', icon: 'fa-sort', popoverText: 'filter-toggle-az-popover', isEnabled: false},
        {name: 'Sort Name', icon: 'fa-navicon', popoverText: 'filter-sort-name-popover', isEnabled: false},
        {name: 'Sort Price', icon: 'fa-usd', popoverText: 'filter-sort-price-popover', isEnabled: false},
        {name: 'Sort Date', icon: 'fa-clock-o', popoverText: 'filter-sort-date-popover', isEnabled: false},
    ];

    applyFilter(filter) {
        switch (filter.name) {
            case 'Sort Name':
                this.sort_orderColumn = 'name';
                break;
            case 'Sort Price':
                this.sort_orderColumn = 'price';
                break;
            case 'Sort Date':
                this.sort_orderColumn = 'height';
                break;
            case 'Toggle A-Z':
                if (this.sort_order === 'desc') {
                    this.sort_order = 'asc';
                } else if (this.sort_order === 'asc') {
                    this.sort_order = 'desc';
                }
        }

        this.filters.forEach(obj => {
            obj.isEnabled = (obj.name == filter.name) ? true : false;
        });

        this.setPage({offset: 0});
    }

    ngOnInit() {
        this.route.data.subscribe(data => {

            this.offerType = data.offerType;

            this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
            this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');
            this.secretPhraseHex = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
            this.secretPhrase = this.cryptoService.secretPhraseFromPrivateKey(this.secretPhraseHex);

            this.currentHeight = this.sessionStorageService.getFromSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK);

            this.setPage({offset: 0});
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        if (this.offerType === 'PRIVATE') {
            this.aliasesService.getAliasesPrivateOffers(
                this.accountRs,
                startIndex,
                endIndex
            ).subscribe(response => {
                this.rows = response['aliases'];
                if (this.page.pageNumber === 0 && this.rows.length < 10) {
                    this.page.totalElements = this.rows.length;
                } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
        } else {

            this.aliasesService.getAliasesPublicOffers(
                this.accountRs,
                startIndex,
                endIndex,
                this.sort_order,
                this.sort_orderColumn
            ).subscribe(response => {
                this.rows = response['aliases'];
                if (this.page.pageNumber === 0 && this.rows.length < 10) {
                    this.page.totalElements = this.rows.length;
                } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            });
        }
    }

    transactionDetail(rowData) {
        DataStoreService.set('transaction-details', {id: rowData.aliasId, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/aliases/buy-offers/transaction-details']);
    }

    accountDetail(accountID) {
        this.router.navigate(['/aliases/buy-offers/account-details'], {queryParams: {id: accountID}});
    }

    buy(aliasName, priceTQT) {
        this.router.navigate(['/aliases/buy-offers/buy-alias'], {queryParams: {aliasName, priceTQT}});
    }

    reload() {
        this.setPage({offset: 0});
    }

}
