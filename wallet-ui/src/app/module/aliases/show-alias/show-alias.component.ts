import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {Router} from '@angular/router';
import {AliasesService} from '../aliases.service';
import {DataStoreService} from '../../../services/data-store.service';
import {Page} from '../../../config/page';

@Component({
    selector: 'app-show-alias',
    templateUrl: './show-alias.component.html',
    styleUrls: ['./show-alias.component.scss']
})
export class ShowAliasComponent implements OnInit {
    searchText: any = '';
    page = new Page();
    rows = new Array<any>();

    constructor(public commonsService: CommonService,
                public aliasesService: AliasesService,
                public router: Router) {
    }

    ngOnInit() {
        this.setPage({offset: 0});
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        let account = this.commonsService.getAccountDetailsFromSession('accountId');
        this.aliasesService.getAccountAliases(account,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1).subscribe((response: any) => {
            if (!response.aliases) {
                response.aliases = {};
            }
            if (this.searchText) {
                this.onSearchChange(this.searchText);
            } else {
                this.rows = response.aliases;
                if (this.page.pageNumber === 0 && this.rows.length < 10) {
                    this.page.totalElements = this.rows.length;
                } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                    this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                    this.page.totalPages = this.page.pageNumber;
                }
            }

        });
    }

    onSearchChange(query) {
        if (query !== '') {
            this.aliasesService.searchAlias(query, this.page.pageNumber * 10, ((this.page.pageNumber + 1) * 10) - 1)
                .subscribe((success) => {
                    this.rows = success.aliases;
                    if (this.page.pageNumber === 0 && this.rows.length < 10) {
                        this.page.totalElements = this.rows.length;
                    } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        } else {
            this.reload();
        }
    }

    resetSearch() {
        this.searchText = '';
        this.rows = [];
    }

    reload() {
        this.setPage({offset: 0});
    }

    routeUri(uri) {
        var aliasType = uri.split(':')[0];
        if (aliasType === 'acct') {
            var accountId = uri.substring(uri.lastIndexOf(':') + 1, uri.lastIndexOf('@'));
            this.router.navigate(['/account/send'], {queryParams: {recipient: accountId}});
        } else if (aliasType === 'url') {
            var url = uri.substring(uri.lastIndexOf(':') + 1, uri.lastIndexOf('@'));
            if (!/^https?:\/\//i.test(url)) {
                url = 'http://' + url;
            }
            window.open(url, '_blank');
        } else if (aliasType === 'btc') {
            var address = uri.substring(uri.lastIndexOf(':') + 1, uri.lastIndexOf('@'));
            this.router.navigate(['/aliases/show-alias/btc-details'], {queryParams: {address: address}});
        }
    }

    transactionDetail(rowData) {
        DataStoreService.set('transaction-details', {id: rowData.alias, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/aliases/show-alias/transaction-details']); // + row.fullHash
    }

    transferAlias(alias, aliasName, aliasURI) {
        this.router.navigate(['/aliases/show-alias/transfer-alias'], {queryParams: {alias, aliasName, aliasURI}});
    }

    editAlias(alias, aliasName, aliasURI) {
        this.router.navigate(['/aliases/show-alias/edit-alias'], {queryParams: {alias, aliasName, aliasURI}});
    }

    deleteAlias(alias, aliasName, aliasURI) {
        this.router.navigate(['/aliases/show-alias/delete-alias'], {queryParams: {alias, aliasName, aliasURI}});
    }

    sellAlias(alias, aliasName, aliasURI) {
        this.router.navigate(['/aliases/show-alias/sell-alias'], {queryParams: {alias, aliasName, aliasURI}});
    }
}
