import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbsArray;
    stateLabel = {
        'account': 'Account',
        'send': 'Send XIN',
        'simple': 'Simple',
        'deferred': 'Deferred',
        'reference': 'Reference',
        'secret': 'Secret',
        'detail': 'Details',
        'wallet-settings': 'Wallet Settings',
        'options': 'Options',
        'swapps': 'SWApps',
        'receive': 'Receive XIN',
        'transactions': 'Transactions',
        'completed': 'Completed',
        'pending': 'Pending',
        'receive-tab': 'Receive',
        'claim': 'Claim',
        'control': 'Control',
        'balance-lease': 'Balance Leasing',
        'search-account': 'Search Account',
        'bookmark': 'Bookmark',
        'lessors': 'Lessors',
        'properties': 'Properties',
        'set-property': 'Set Property',
        'my-properties': 'My Properties',
        'external-properties': 'External Properties',
        'block-generation': 'Block Generation',
        'ledger-view': 'Ledger View',
        'funding-monitor': 'Funding Monitor',
        'control-funding': 'Control Funding',
        'active-monitors': 'Active Monitors',
        'assets': 'Assets',
        'show-assets': 'Show Assets',
        'transaction-details': 'Transaction Details',
        'my': 'My',
        'all': 'All',
        'my-open-orders': 'My Open Orders',
        'buy': 'Buy',
        'sell': 'Sell',
        'my-trades': 'My Trades',
        'my-transfers': 'My Transfers',
        'last-trades': 'Last Trades',
        'issue-asset': 'Issue Asset',
        'search-assets': 'Search Assets',
        'dividend-payment': 'Dividend Payment',
        'transfer-asset': 'Transfer Asset',
        'delete-shares': 'Delete Shares',
        'dividend-history': 'Dividend History',
        'delete-asset': 'Delete Asset',
        'open-orders': 'Open Orders',
        'cancel-order': 'Cancel Order',
        'messages': 'Messages',
        'show-messages': 'Show Messages',
        'send-message': 'Send Message',
        'read-message-details': 'Read Message Details',
        'tools': 'Tools',
        'online': 'Tools Online',
        'development': 'Tools in Development',
        'concept': 'Tools in Concept',
        'poc': 'Tools in Proof Of Concept',
        'currencies': 'Currencies',
        'search-currencies': 'Search Currencies',
        'issue-currency': 'Issue Currency',
        'last-exchanges': 'Last Exchanges',
        'my-exchanges': 'My Exchanges',
        'show-currencies': 'Show Currencies',
        'transfer-currency': 'Transfer Currency',
        'delete-currency': 'Delete Currency',
        'my-open-offers': 'My open Offers',
        'cancel-offer': 'Cancel Offer',
        'trade': 'Trade Desk',
        'voting': 'Voting',
        'show-polls': 'Show Polls',
        'result': 'Results',
        'aliases': 'Aliases',
        'show-alias': 'Show Alias',
        'my-sell-offers': 'My Sell Offers',
        'buy-offers': 'Buy Offers',
        'private': 'Private',
        'public': 'Public',
        'create-alias': 'Create Alias',
        'edit-alias': 'Edit Alias',
        'transfer-alias': 'Transfer Alias',
        'sell-alias': 'Sell Alias',
        'delete-alias': 'Delete Alias',
        'cancel-alias-sell': 'Cancel Alias Sell',
        'at': 'AT',
        'workbench': 'Workbench',
        'compiler': 'AT Compiler',
        'dashboard': 'Dashboard',
        'create-poll': 'Create Poll',
        'details': 'Details',
        'vote': 'Vote',
        'voters': 'Voters',
        'expected-asset-transfer': 'Expected Asset Transfer',
        'expected-order-cancellation': 'Expected Order Cancellation',
        'expected-asset-deletes': 'Expected Asset Deletes',
        'expected-order-details': 'Expected Order Details',
        'order-trade-details': 'Order Trade Details',
        'asset-details': 'Asset Details',
        'show-ats': 'Show ATs',
        'create-at': 'Create AT',
        'at-details': 'AT Details',
        'crowdfunding': 'Crowdfunding',
        'show-campaigns': 'Show Campaigns',
        'create-campaign': 'Create Campaign',
        'currency-details': 'Currency Details',
        'reserve-founders': 'Reserve Founders',
        'reserve-units': 'Reserve Units',
        'account-details': 'Account Details',
        'subscriptions': 'Subscriptions',
        'my-subscriptions': 'My Subscriptions',
        'create-subscription': 'Create Subscription',
        'cancel-subscription': 'Cancel Subscription',
        'escrow': 'Escrow',
        'my-escrow': 'My Escrow',
        'create-escrow': 'Create Escrow',
        'sign-escrow': 'Sign Escrow',
        'escrow-status': 'Escrow Status',
        'shuffling': 'Shuffling',
        'show-shufflings': 'Show Shufflings',
        'create-shuffling': 'Create Shuffling',
        'shuffling-details': 'Shuffling Details',
        'start-shuffling': 'Start Shuffling',
        'stop-shuffling': 'Stop Shuffling',
        'publish-exchange-offer': 'Publish Exchange Offer',
        'publish-exchange-buy-offer': 'Publish Exchange Buy Offer',
        'publish-exchange-sell-offer': 'Publish Exchange Sell Offer'
    };
    @Input()
    routeChange: Subject<any>;

    constructor(public router: Router,
        public activatedRoute: ActivatedRoute,
        public translate: TranslateService) {

        this.translate.get('breadcrumbs').subscribe((data) => {
            this.stateLabel = data;
        });
    }

    ngOnInit() {
        if (this.routeChange) {
            this.routeChange.subscribe(() => {
                this.getBreadCrumbArray();
            });
        }
        this.getBreadCrumbArray();
    }

    getBreadCrumbArray() {
        let breadcrumbsArray = this.router.routerState.snapshot.url.split('/');
        breadcrumbsArray.splice(0, 1);
        this.breadcrumbsArray = breadcrumbsArray;
    }
}
