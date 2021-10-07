import { Component, OnInit } from '@angular/core';
import {AccountService} from '../account.service';
import {CommonService} from '../../../services/common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lessors',
  templateUrl: './lessors.component.html',
  styleUrls: ['./lessors.component.scss']
})
export class LessorsComponent implements OnInit {
    accountLeases: any = [];
    accountId: any;
    currentHeight = 0;
  constructor(private accountService: AccountService,
              private commonService: CommonService,
              public router: Router) {
  }

  ngOnInit() {
      this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
      this.getAccountLessors();
  }
    getAccountLessors() {
        this.accountService.getAccountLessors(this.accountId)
            .subscribe((success: any) => {
                // if (!success.accountLeases) {
                //     success.accountLeases = [];
                // }
                this.currentHeight = success.height;
                this.accountLeases = this.commonService.sanitizeJson(success.accountLeases);
            });
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/account/lessors/account-details'], { queryParams: { id: accountID }});
    }
}