import { Component, OnInit } from '@angular/core';
import { CrowdfundingService } from '../../../crowdfunding.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from '../../../../../services/data-store.service';
import { Location } from '@angular/common';
import { Page } from '../../../../../config/page';

@Component({
    selector: 'app-reserve-founders',
    templateUrl: './reserve-founders.component.html',
    styleUrls: ['./reserve-founders.component.scss']
})
export class ReserveFoundersComponent implements OnInit {

    page = new Page();
    rows = new Array<any>();
    code: any;

    constructor(private crowdfundingService: CrowdfundingService,
        private route: ActivatedRoute,
        private router: Router,
        private _location: Location) {

        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            } else {
                this.code = params.id;
                this.setPage({ offset: 0 });
            }
        });
    }

    goToDetails(value) {
        DataStoreService.set('transaction-details', { id: value, type: 'onlyID', view: 'transactionDetail' });
        this.router.navigate(['/crowdfunding/show-campaigns/transaction-details']);
    }

    accountDetail(accountID) {
        this.router.navigate(['/crowdfunding/show-campaigns/account-details'], { queryParams: { id: accountID } });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.crowdfundingService.getCampaignFounders(
            this.code,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1
        ).subscribe(response => {
            this.rows = response.founders;
        });
    }

    goBack() {
        this._location.back();
    }

    reload() {
        this.setPage({ offset: 0 });
    }

}
