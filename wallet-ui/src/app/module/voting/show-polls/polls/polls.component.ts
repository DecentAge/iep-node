
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VotingService } from '../../voting.service';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { AppConstants } from '../../../../config/constants';
import { Page } from '../../../../config/page';
import { AccountService } from '../../../account/account.service';

@Component({
    selector: 'app-polls',
    templateUrl: './polls.component.html',
    styleUrls: ['./polls.component.scss']
})
export class PollsComponent implements OnInit {

    page = new Page();
    polls: any[] = [];
    pollType: any = 'ALL';
    includeFinished = true;
    searchQuery: any = '';
    accountId: any;
    accountRs: any;

    constructor(public router: Router,
        public votingService: VotingService,
        public sessionStorageService: SessionStorageService,
        public route: ActivatedRoute,
        public accountService: AccountService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    removeFilter() {
        this.includeFinished = true;

        this.filters.forEach(obj => {
            obj.isEnabled = false;
        });

        this.setPage({ offset: 0 });
    }

    filters = [
        { name: 'Active Polls', icon: 'fa-hourglass-2', popoverText: 'filter-active-polls-popover', isEnabled: false },
    ];

    applyFilter(filter) {
        this.searchQuery = '';
        switch (filter.name) {
            case 'Active Polls':
                this.includeFinished = false;
                break;
            case 'All Polls':
                this.includeFinished = true;
        }

        this.filters.forEach(obj => {
            obj.isEnabled = (obj.name == filter.name) ? true : false;
        });

        this.setPage({ offset: 0 });
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.pollType = data.pollType;
            this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
            this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

            this.setPage({ offset: 0 });
        });
    }

    getDays(value) {
        let currentHeight = this.sessionStorageService.getFromSession(AppConstants.baseConfig.SESSION_CURRENT_BLOCK),
            days = 0;

        if (currentHeight && currentHeight < value) {
            days = (parseInt(value) - currentHeight) / 1440;
        } else {
            days = 0;
        }

        if (days < 0) {
            days = 0;
        }

        return days.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    }

    setPage(pageInfo) {

        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        if (this.pollType == 'ALL') {
            this.votingService.getPolls(startIndex, endIndex, this.includeFinished)
                .subscribe((success: any) => {
                    this.polls = success.polls;
                    if (this.page.pageNumber === 0 && this.polls.length < 10) {
                        this.page.totalElements = this.polls.length;
                    } else if (this.page.pageNumber > 0 && this.polls.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.polls.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        } else {
            this.votingService.getAccountPolls(this.accountId, startIndex, endIndex, this.includeFinished)
                .subscribe((success: any) => {
                    this.polls = success.polls;
                    if (this.page.pageNumber === 0 && this.polls.length < 10) {
                        this.page.totalElements = this.polls.length;
                    } else if (this.page.pageNumber > 0 && this.polls.length < 10) {
                        this.page.totalElements = this.page.pageNumber * 10 + this.polls.length;
                        this.page.totalPages = this.page.pageNumber;
                    }
                });
        }

    }

    reload() {
        this.setPage({ offset: 0 });
    }

    onCustom(event) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                id: event.poll
            }
        };
        switch (event.action) {
            case 'result':
                this.router.navigate(['/voting/show-polls/result'], navigationExtras);
                break;
            case 'details':
                this.router.navigate(['/voting/show-polls/details'], navigationExtras);
                break;
            case 'vote':
                this.router.navigate(['/voting/show-polls/vote'], navigationExtras);
                break;
            case 'voters':
                this.router.navigate(['/voting/show-polls/voters'], navigationExtras);
                break;
        }
    }

    onSearchChange(query) {
        if (query != '') {
            this.removeFilter();
            this.votingService.searchPolls(query, this.page.pageNumber * 10, ((this.page.pageNumber + 1) * 10) - 1)
                .subscribe((success) => {
                    observableForkJoin(success, this.votingService.getPoll(query))
                        .subscribe((successNext: any) => {
                            let [result1, result2] = successNext;

                            if (!result1.errorCode) {
                                this.polls = result1.polls;
                            }
                            if (!result2.errorCode) {
                                this.polls = result2.polls;
                                this.page.totalElements = this.polls.length;
                            }

                        });
                });
        } else {
            this.reload();
        }
    }
}
