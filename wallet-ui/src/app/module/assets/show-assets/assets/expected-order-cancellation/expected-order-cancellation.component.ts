import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../../../config/page';
import {SessionStorageService} from '../../../../../services/session-storage.service';
import {AssetsService} from '../../../assets.service';
import {AccountService} from '../../../../account/account.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-expected-order-cancellation',
  templateUrl: './expected-order-cancellation.component.html',
  styleUrls: ['./expected-order-cancellation.component.scss']
})
export class ExpectedOrderCancellationComponent implements OnInit {
    orderCancellations: any = [];
    constructor(public router: Router,
                public sessionStorageService: SessionStorageService,
                public assetsService: AssetsService,
                public route: ActivatedRoute,
                public accountService: AccountService,
                private _location: Location) {
    }

    ngOnInit() {
        this.assetsService.getExpectedOrderCancellations()
            .subscribe((success: any) => {
                this.orderCancellations = success.orderCancellations;
            });
    }
    goToAccountDetails(id) {
        this.router.navigate(['/assets/show-assets/expected-order-cancellation/account-details'], { queryParams: { id: id }});
    }
    goBack() {
        this._location.back();
    }
}
