import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  params: any = '';
  account: any = {};
  accountRs: any = {};
  accountId: any = '';
  constructor(public searchService: SearchService,
              public activatedRoute: ActivatedRoute,
              private _location: Location) { }

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe( (params: any) => {
          this.accountId = params.id;
          this.getAccountInfo();
      });
      // this.account = params.account;
      // this.accountRs = params.account.accountRS;

  }
  getAccountInfo() {
      this.searchService.searchAccounts(this.accountId).subscribe((response) => {
          if (!response.errorCode) {
              this.account = response;
          } else {
              //errorHandler(searchTerm + ' account doesn\'t exists ');
          }
      });
  }
  goBack(){
    this._location.back();
  }
}
