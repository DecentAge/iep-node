import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {Router} from '@angular/router';
import {EscrowService} from '../escrow.service';
import {DataStoreService} from '../../../services/data-store.service';
import {Page} from '../../../config/page';

@Component({
    selector: 'app-my-escrow',
    templateUrl: './my-escrow.component.html',
    styleUrls: ['./my-escrow.component.scss'],

})
export class MyEscrowComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    accountRs: any;
    signers: any;
    signTag: any;

    constructor(public commonService: CommonService,
                public router: Router,
                public escrowService: EscrowService) {
    }

    ngOnInit() {
        this.accountRs = this.commonService.getAccountDetailsFromSession('accountRs');
        this.setPage({offset: 0});
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.escrowService.getAccountEscrowTransactions(this.accountRs,
            this.page.pageNumber * 10,
            ((this.page.pageNumber + 1) * 10) - 1).subscribe((response: any) => {
            if (!response.escrows) {
                response.escrows = [];
            }
            this.rows = response.escrows;
            if (this.page.pageNumber === 0 && this.rows.length < 10) {
                this.page.totalElements = this.rows.length;
            } else if (this.page.pageNumber > 0 && this.rows.length < 10) {
                this.page.totalElements = this.page.pageNumber * 10 + this.rows.length;
                this.page.totalPages = this.page.pageNumber;
            }
        });
    }

    accountDetail(accountID) {
        this.router.navigate(['/escrow/my-escrow/account-details'], {queryParams: {id: accountID}});
    }

    goToDetails(value) {
        DataStoreService.set('transaction-details', {id: value, type: 'onlyID', view: 'transactionDetail'});
        this.router.navigate(['/escrow/my-escrow/transaction-details']);
    }

    goToEscrowStatus(id) {
        this.router.navigate(['/escrow/my-escrow/escrow-status'], {queryParams: {id}});
    }

    isEditEnabled(row) {
        this.signers = row.signers;
        for (let i = 0; i < this.signers.length; i++) {
            if (this.accountRs === this.signers[i].idRS && this.signers[i].decision === 'undecided') {
                this.signTag = false;
            } else {
                this.signTag = true;
            }
        }
        return this.signTag;
    }

    goToSignEscrow(id) {
        this.router.navigate(['/escrow/my-escrow/sign-escrow'], {queryParams: {id}});
    }

    reload() {
        this.setPage({offset: 0});
    }


}
