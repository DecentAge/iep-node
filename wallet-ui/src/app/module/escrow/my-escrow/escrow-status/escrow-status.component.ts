import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EscrowService} from '../../escrow.service';
import {Location} from '@angular/common';
import {Page} from '../../../../config/page';

@Component({
    selector: 'app-escrow-status',
    templateUrl: './escrow-status.component.html',
    styleUrls: ['./escrow-status.component.scss']
})
export class EscrowStatusComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();
    escrowId: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private escrowService: EscrowService,
                private _location: Location) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.id) {
                this._location.back();
            } else {
                this.escrowId = params.id;
                this.setPage({offset: 0});
            }
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.escrowService.getEscrowTransaction(
            this.escrowId,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1
        ).subscribe(response => {
            this.rows = response.signers;
        });
    }

    goBack() {
        this._location.back();
    }

    accountDetail(accountID) {
        this.router.navigate(['/escrow/my-escrow/escrow-status/account-details'], {queryParams: {id: accountID}});
    }

}
