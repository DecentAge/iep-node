import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ShufflingService } from '../../shuffling.service';
import { Page } from '../../../../config/page';

@Component({
    selector: 'app-shuffling-participants',
    templateUrl: './shuffling-participants.component.html',
    styleUrls: ['./shuffling-participants.component.scss']
})
export class ShufflingParticipantsComponent implements OnInit {

    page = new Page();
    rows = new Array<any>();

    shufflingId: any;
    shuffle: any;

    constructor(public activatedRoute: ActivatedRoute,
        private _location: Location,
        private shufflingService: ShufflingService,
        private router: Router) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            }
            this.shufflingId = params.id;
            this.setPage({ offset: 0 });
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;

        let startIndex = this.page.pageNumber * 10;
        let endIndex = ((this.page.pageNumber + 1) * 10) - 1;

        this.shufflingService.getShufflingParticipants(
            this.shufflingId
        ).subscribe(response => {
            this.rows = response.participants;
        });
    }


    accountDetail(accountID) {
        this.router.navigate(['/shuffling/show-shufflings/shuffling-participants/account-details'], { queryParams: { id: accountID } });
    }

    goBack() {
        this._location.back();
    }

    reload() {
        this.setPage({ offset: 0 });
    }

}
