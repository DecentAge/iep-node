import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from '../message.service';
import {CommonService} from '../../../services/common.service';
import {Router} from '@angular/router';
import {DataStoreService} from '../../../services/data-store.service';
import {Page} from '../../../config/page';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();
    filter_type = '';
    filter_subtype = '';

    filters = [
        {name: 'Message', icon: 'fa-envelope-o', popoverText: 'Messages only', isEnabled: false},
        {name: 'Payment', icon: 'fa-usd', popoverText: 'With Payment', isEnabled: false},
    ];

    accountRS: any;

    constructor(public commonsService: CommonService,
                public messageService: MessageService,
                public router: Router) {
        this.setPage({offset: 0});
    }

    ngOnInit() {
    }

    applyFilter(filter) {
        switch (filter.name) {
            case 'Message':
                this.filter_type = '1';
                this.filter_subtype = '0';
                break;
            case 'Payment':
                this.filter_type = '0';
                this.filter_subtype = '';
                break;
        }
        this.filters.forEach(obj => {
            obj.isEnabled = (obj.name == filter.name) ? true : false;
        });

        this.setPage({offset: 0});
    }

    removeFilter() {
        this.filter_type = '';
        this.filter_subtype = '';

        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({offset: 0});
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        let account = this.commonsService.getAccountDetailsFromSession('accountId');
        this.accountRS = this.commonsService.getAccountDetailsFromSession('accountRs');
        ;
        this.messageService.getMessages(
            account,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1,
            this.filter_type,
            this.filter_subtype
        ).subscribe((response: any) => {
            this.rows = response.transactions;
            if (this.page.pageNumber === 0 && this.rows.length < 10) {
                this.page.totalElements = this.rows.length;
            } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                this.page.totalPages = this.page.pageNumber;
            }
        });
    }

    messageDetail(rowData) {
        DataStoreService.set('message-details', rowData);
        this.router.navigate(['/messages/show-messages/read-message-details']);
    }

    accountDetail(accountID) {
        this.router.navigate(['/messages/show-messages/account-details'], {queryParams: {id: accountID}});
    }

    transactionDetail(rowData) {
        DataStoreService.set('transaction-details', {id: rowData.transaction, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/messages/show-messages/transaction-details']);
    }

    messageReply(senderID) {
        this.router.navigate(['/messages/send-message'], {queryParams: {id: senderID}});
    }

    reload() {
        this.setPage({offset: 0});
    }
}
