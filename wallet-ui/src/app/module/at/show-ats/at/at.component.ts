import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../account/account.service';
import { AtService } from '../../at.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DataStoreService } from '../../../../services/data-store.service';
import { AppConstants } from '../../../../config/constants';

@Component({
  selector: 'app-at',
  templateUrl: './at.component.html',
  styleUrls: ['./at.component.scss']
})
export class AtComponent implements OnInit {

  constructor(private accountService: AccountService,
    private atService: AtService,
    private route: ActivatedRoute,
    private router: Router) { }

  accountId = '';
  accountRs = '';
  atType: any = 'ALL';
  rows = new Array<any>();

  ngOnInit() {
    this.route.data.subscribe(data => {

      this.atType = data.atType;

      this.accountId = this.accountService.getAccountDetailsFromSession('accountId');
      this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');

      this.getATs();
    });
  }

  getATs() {
    
    if(this.atType == 'MY'){
      this.atService.getAccountATs(this.accountId).subscribe(response => {
        this.rows = response.ats;
      });
    }else{
      this.atService.getAllATs().subscribe(response => {
        this.rows = response.ats;
      });
    }
    
  }

  goToTransactionDetails(id){
    DataStoreService.set('transaction-details',{id, type: 'onlyID', view: 'transactionDetail'});
    this.router.navigate(['/at/show-ats/transaction-details']);
  }

  goToAtDetails(id){
    this.router.navigate(['/at/show-ats/at-details'], { queryParams: { id }});
  }

  goToAccountDetails(accountID) {
    this.router.navigate(['/at/show-ats/account-details'], { queryParams: { id: accountID }});
  }

  runAt(id) {
    this.router.navigate(['/account/send'], { queryParams: { recipient:id }});
  }

  reload() {
    this.getATs();
  }

}
