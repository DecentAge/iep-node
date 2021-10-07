import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../currencies.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.scss']
})
export class CurrencyDetailsComponent implements OnInit {

  currencyDetails: any;

  constructor(private currenciesService: CurrenciesService,
              private route: ActivatedRoute,
              private router: Router,
              private _location: Location) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if(!params.id){
        this._location.back();
      }
      this.getCurrencyDetails(params.id);
    });
  }

  getCurrencyDetails(currencyId) {
    this.currenciesService.getCurrency(currencyId).subscribe((success) => {
      this.currencyDetails = success;
    });
  }

  goBack(){
    this._location.back();
  }
}
