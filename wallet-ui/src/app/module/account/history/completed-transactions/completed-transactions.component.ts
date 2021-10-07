import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../../../services/data-store.service';
import { Page } from '../../../../config/page';

@Component({
    selector: 'app-completed-transactions',
    templateUrl: './completed-transactions.component.html',
    styleUrls: ['./completed-transactions.component.scss']
})
export class CompletedTransactionsComponent implements OnInit {

    page = new Page();
    rows = new Array<any>();

    constructor(private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router) {
        this.page.pageNumber = 0;
        this.page.size = 10
    }

    filter_type: any = '';
    filter_subtype: any = '';
    filter_phasedOnly: any = '';
    filter_nonPhasedOnly: any = '';
    filter_withMessage: any = false;
    filter_includePhasingResult: any = false;
    filter_numberOfConfirmations: any = '';
    accountId = '';
    accountRs = '';

    filters = [
        { name: 'Payment', appName: '', icon: 'icon-payment', popoverText: 'Payment', isEnabled: false },
        { name: 'Assets', appName: 'Assets', icon: 'icon-asset', popoverText: 'Asset', isEnabled: false },
        { name: 'Currencies', appName: 'Currencies', icon: 'icon-currency', popoverText: 'Currency', isEnabled: false },
        { name: 'Messages', appName: '', icon: 'icon-messages1', popoverText: 'Messages', isEnabled: false },
        { name: 'Voting', appName: 'Voting', icon: 'icon-voting', popoverText: 'Voting', isEnabled: false },
        { name: 'MultiSig', appName: '', icon: 'icon-multisig', popoverText: 'MultiSig', isEnabled: false },
        { name: 'Aliases', appName: 'Aliases', icon: 'icon-alias', popoverText: 'Alias', isEnabled: false },
        { name: 'Account', appName: '', icon: 'icon-account', popoverText: 'Account', isEnabled: false },
        { name: 'Escrow', appName: 'Escrow', icon: 'icon-escrow', popoverText: 'Escrow', isEnabled: false },
        { name: 'Subscriptions', appName: 'Subscriptions', icon: 'icon-subscription', popoverText: 'Subscription', isEnabled: false },
        { name: 'Shuffling', appName: 'Shuffling', icon: 'icon-shuffles', popoverText: 'Shuffles', isEnabled: false },
        { name: 'AT', appName: 'AT', icon: 'icon-AT1', popoverText: 'AT', isEnabled: false }
    ];

    applyFilter(filter) {
        switch (filter.name) {
            case 'Payment':
                this.filter_type = 0;
                this.filter_subtype = '';
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Assets':
                this.filter_type = 2;
                this.filter_subtype = '';
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Currencies':
                this.filter_type = 5;
                this.filter_subtype = '';
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Messages':
                this.filter_type = 1;
                this.filter_subtype = 0;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Voting':
                this.filter_type = 1;
                this.filter_subtype = 3;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'MultiSig':
                this.filter_type = 1;
                this.filter_subtype = 9;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Aliases':
                this.filter_type = 1;
                this.filter_subtype = 1;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Account':
                this.filter_type = 4;
                this.filter_subtype = '';
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Escrow':
                this.filter_type = 21;
                this.filter_subtype = 0;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Subscriptions':
                this.filter_type = 21;
                this.filter_subtype = 3;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'Shuffling':
                this.filter_type = 7;
                this.filter_subtype = 0;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
                break;
            case 'AT':
                this.filter_type = 22;
                this.filter_subtype = 0;
                this.filter_phasedOnly = '';
                this.filter_nonPhasedOnly = '';
                this.filter_withMessage = false;
                this.filter_includePhasingResult = false;
                this.filter_numberOfConfirmations = '';
        }

        this.filters.forEach(obj => {
            obj.isEnabled = (obj.name == filter.name) ? true : false;
        });

        this.setPage({ offset: 0 });
    }

    ngOnInit() {

        this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

        this.setPage({ offset: 0 });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.accountService.getAccountTransaction(
            this.accountId,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1,
            this.filter_type,
            this.filter_subtype
        ).subscribe(response => {
            this.rows = response.transactions;
            if (this.page.pageNumber === 0 && this.rows.length < 10) {
                this.page.totalElements = this.rows.length;
            } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                this.page.totalPages = this.page.pageNumber;
            }
        });
    }

    goToDetails(row) {
        DataStoreService.set('transaction-details', { id: row.transaction, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/account/transactions/transaction-details']);
    }

    accountDetail(accountID) {
        this.router.navigate(['/account/transactions/account-details'], { queryParams: { id: accountID } });
    }

    removeFilter() {
        this.filter_type = '';
        this.filter_subtype = '';
        this.filter_phasedOnly = '';
        this.filter_nonPhasedOnly = '';
        this.filter_withMessage = false;
        this.filter_includePhasingResult = false;
        this.filter_numberOfConfirmations = '';

        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({ offset: 0 });
    }

    reload() {
        this.setPage({ offset: 0 });
    }

}
