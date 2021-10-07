import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import { AtService } from '../../at.service';
@Component({
  selector: 'app-at-details',
  templateUrl: './at-details.component.html',
  styleUrls: ['./at-details.component.scss']
})
export class AtDetailsComponent implements OnInit {

  atId:any;
  atDetails:any;

  constructor(public activatedRoute: ActivatedRoute,
              private _location: Location,
              private atService: AtService,
              private router: Router) { }

    ngOnInit() {
      this.activatedRoute.queryParams.subscribe( (params: any) => {
        if (!params.id) {
            this._location.back();
        }
        this.atId = params.id;
        this.getAtDetails();
      });
    }
  
    getAtDetails() {
      this.atService.getAT(this.atId).subscribe((success) => {
          this.atDetails = success;
      });
    }
    goToAccountDetails(accountID) {
        this.router.navigate(['/at/show-ats/account-details'], { queryParams: { id: accountID }});
    }
  
    goBack() {
        this._location.back();
    }

}
