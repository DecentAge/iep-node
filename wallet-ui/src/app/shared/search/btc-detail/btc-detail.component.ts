import { Component, OnInit } from '@angular/core';
import {BlockrService} from "../blockr.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-btc-detail',
  templateUrl: './btc-detail.component.html',
  styleUrls: ['./btc-detail.component.scss']
})
export class BtcDetailComponent implements OnInit {

  address: any = '';

  addrStr:any;
  balance:any;
  totalReceived:any;
  totalSent:any;
  unconfirmedBalance:any;
  txApperances:any;

  constructor(public blockrService: BlockrService,
              public activatedRoute: ActivatedRoute,
              private _location: Location) { }

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe( (params: any) => {
          this.address = params.address;
          this.getBtcAdressBalance();
      });
  }

  getBtcAdressBalance() {
    this.blockrService.getAddressBalance(this.address).subscribe((success) => {

        this.addrStr = success.addrStr;
        this.balance = success.balance;
        this.totalReceived = success.totalReceived;
        this.totalSent = success.totalSent;
        this.unconfirmedBalance = success.unconfirmedBalance;
        this.txApperances = success.txApperances;
        this.balance = success.balance;

    });
};

  goBack(){
    this._location.back();
  }

}