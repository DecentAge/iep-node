import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../../../services/common.service';
import {SubscriptionService} from '../subscription.service';
import {DataStoreService} from '../../../services/data-store.service';
import {Page} from '../../../config/page';

@Component({
    selector: 'app-my-subscriptions',
    templateUrl: './my-subscriptions.component.html',
    styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public commonsService: CommonService,
                public subscriptionService: SubscriptionService,
                public router: Router) {
    }

    ngOnInit() {
        this.setPage({offset: 0});
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        let account = this.commonsService.getAccountDetailsFromSession('accountId');
        this.subscriptionService.getAccountSubscriptions(account,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1).subscribe((response: any) => {
            if (!response.subscriptions) {
                response.subscriptions = {};
            }
            this.rows = response.subscriptions;
        });
    }

    accountDetail(accountID) {
        this.router.navigate(['/subscriptions/my-subscriptions/account-details'], {queryParams: {id: accountID}});
    }

    transactionDetail(rowData) {
        DataStoreService.set('transaction-details', {id: rowData.id, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/subscriptions/my-subscriptions/transaction-details']);
    }

    cancelSubscription(id, accountID) {
        this.router.navigate(['/subscriptions/my-subscriptions/cancel-subscription'], {queryParams: {id, accountID}});
    }

    reload() {
        this.setPage({offset: 0});
    }

    navigateTo(route){
        this.router.navigate([route]);
    }
}
