import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../../account/account.service';
import {Page} from '../../../../config/page';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AssetsService} from '../../assets.service';
import {DataStoreService} from '../../../../services/data-store.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

    page = new Page();
    assets: any[] = [];
    assetType: any = 'ALL';
    accountId: any;
    accountRs: any;
    sort_order: any = 'desc';
    sort_orderColumn: any = 'height';

    constructor(public router: Router,
                public sessionStorageService: SessionStorageService,
                public assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    filters = [
        { name: 'Toggle A-Z', icon: 'fa fa-sort', popoverText: 'filter-toggle-az-popover', isEnabled: false },
        { name: 'Sort Name', icon: 'fa fa-navicon', popoverText: 'filter-sort-name-popover', isEnabled: false },
        { name: 'Sort Supply', icon: 'fa fa-plus-circle', popoverText: 'filter-sort-supply-popover', isEnabled: false },
        { name: 'Sort Height', icon: 'fa fa-clock-o', popoverText: 'filter-sort-height-popover', isEnabled: false },
        { name: 'Sort Decimals', icon: 'fa fa-adjust', popoverText: 'filter-sort-decimals-popover', isEnabled: false },
    ];
    removeFilter() {

        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({offset: 0});
    }
    applyFilter(filter) {
        switch (filter.name) {
            case 'Toggle A-Z':
                if (this.sort_order === 'desc') {
                    this.sort_order = 'asc';
                } else if (this.sort_order === 'asc') {
                    this.sort_order = 'desc';
                }
                break;
            case 'Sort Name':
                this.sort_orderColumn = 'name';
                break;
            case 'Sort Supply':
                this.sort_orderColumn = 'quantity';
                break;
            case 'Sort Height':
                this.sort_orderColumn = 'height';
                break;
            case 'Sort Decimals':
                this.sort_orderColumn = 'decimals';
        }
        this.filters.forEach(obj => {
            obj.isEnabled = (obj.name == filter.name) ? true : false;
        });

        this.setPage({offset: 0});
    }
    ngOnInit() {
      this.route.data.subscribe(data => {
          this.assetType = data.assetType;
          this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
          this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

          this.setPage({offset: 0});
      });
  }
    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        if (this.assetType === 'ALL') {
            this.assetsService.getAssets(startIndex, endIndex, this.sort_order, this.sort_orderColumn)
                .subscribe((success: any) => {
                    this.assets = success.assets;
                    if (this.page.pageNumber === 0 && this.assets.length < 10) {
                        this.page.totalElements = this.assets.length;
                    } else if (this.page.pageNumber > 0 && this.assets.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.assets.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        } else {
            this.assetsService.getAccountAssets(this.accountId)
                .subscribe((success: any) => {
                    this.assets = success.accountAssets;
                    if (this.page.pageNumber === 0 && this.assets.length < 10) {
                        this.page.totalElements = this.assets.length;
                    } else if (this.page.pageNumber > 0 && this.assets.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.assets.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        }

    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/assets/show-assets/account-details'], { queryParams: { id: accountID }});
    }
    goToAssetDetails(accountID) {
        this.router.navigate(['/assets/show-assets/asset-details'],{ queryParams: { id: accountID }});
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/assets/show-assets/transaction-details']);
    }
    goToTradeDesk(id){
        this.router.navigate(['/assets/trade', id]);
    }
    goToTransferAsset(id) {
        this.router.navigate(['assets/show-assets/transfer-asset'], { queryParams: {id: id}})
    }
    goToDividendPayment(id) {
        this.router.navigate(['assets/show-assets/dividend-payment'],{ queryParams: { id: id}})
    }
    goToDeleteShare(id){
        this.router.navigate(['assets/show-assets/delete-shares'], {queryParams: {id: id}})
    }
    goToDeleteAsset(id){
        this.router.navigate(['assets/show-assets/delete-asset'], {queryParams: {id: id}})
    }
    goToDividendHistory(id){
        this.router.navigate(['assets/show-assets/dividend-history'], {queryParams: {id: id}})
    }

    goToExpectedAssetTransfer(){
        this.router.navigate(['assets/show-assets/expected-asset-transfer'])
    }
    goToExpectedOrderCancellation(){
        this.router.navigate(['assets/show-assets/expected-order-cancellation'])
    }
    goToExpectedAssetDeletes(){
        this.router.navigate(['assets/show-assets/expected-asset-deletes'])
    }
    goToExpectedOrderDetails(){
        this.router.navigate(['assets/show-assets/expected-order-details'])
    }
    goToOrderTradesDetails(){
        this.router.navigate(['assets/show-assets/order-trade-details'])
    }
    onSearchChange(query) {
        if (query !== '') {
            this.assetsService.serachAssets(query)
                .subscribe((success: any) => {
                    this.assets = success.assets;
                });
        } else {
            this.reload();
        }
    }

    reload() {
        this.setPage({offset: 0});
    }

}
