import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../account.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.scss']
})
export class SearchAccountComponent implements OnInit {
    searchAccountForm: any = {};
    accounts: any = [];
  constructor(private accountService: AccountService,
              private _location: Location,
              private router: Router,
              private route: ActivatedRoute) {
  }
  ngOnInit() {
  }
    onSearchChange(query) {
        if (query !== '') {
            this.accountService.searchAccounts(query)
                .subscribe((success: any) => {
                    this.accounts = success.accounts;
                });
        } else {
        }
    }
    openAddressBook(accountRS, name){
        this.router.navigate(['/account/bookmark'], { queryParams: { accountRS: accountRS, name: name }});
    }
    goToAccountDetails(id){
        this.router.navigate(['/account/search-account/account-details'], { queryParams: { id: id }});
    }
    goBack() {
        this._location.back();
    }
}
