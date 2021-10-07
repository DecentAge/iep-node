import {Component, Input, OnInit} from '@angular/core';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {AccountService} from '../../../account/account.service';
import {AssetsService} from '../../assets.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../../config/page';
import {DataStoreService} from '../../../../services/data-store.service';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {

    page = new Page();
    orders: any = [];
    offerType: any = 'Buy';
    accountId: any;
    accountRs: any;
    @Input()
    offerTypeInput: any;
    constructor(public router: Router,
                public sessionStorageService: SessionStorageService,
                public assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        //this.route.data.subscribe(data => {
            this.offerType = this.offerTypeInput;
            this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
            this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

            this.setPage({offset: 0});
       // });
    }
    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        if (this.offerType === 'Buy') {
            this.assetsService.getAccountCurrentBidOrders(this.accountRs, startIndex, endIndex)
                .subscribe((success: any) => {
                    this.orders = success.bidOrders;
                    if (this.page.pageNumber === 0 && this.orders.length < 10) {
                        this.page.totalElements = this.orders.length;
                    } else if (this.page.pageNumber > 0 && this.orders.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.orders.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        } else {
            this.assetsService.getAccountCurrentAskOrders(this.accountRs, startIndex, endIndex)
                .subscribe((success: any) => {
                    this.orders = success.askOrders;
                    if (this.page.pageNumber === 0 && this.orders.length < 10) {
                        this.page.totalElements = this.orders.length;
                    } else if (this.page.pageNumber > 0 && this.orders.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.orders.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        }

    }
    reload() {
        this.setPage({offset: 0});
    }
    goToAssetDetails(accountID) {
        this.router.navigate(['/assets/open-orders/asset-details'],{ queryParams: { id: accountID }});
    }
    goToTransactionDetails(id) {
        DataStoreService.set('transaction-details', { id, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/assets/open-orders/transaction-details']);
    }
    goToTradeDesk(id) {
        this.router.navigate(['/assets/trade', id]);
    }
    goToCancelOrder(rowData) {
        DataStoreService.set('offer-details', rowData);
        this.router.navigate(['assets/open-orders/cancel-order']);
    }
}
