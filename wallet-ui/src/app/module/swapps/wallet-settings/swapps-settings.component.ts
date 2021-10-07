import { Component, OnInit } from '@angular/core';
import { SwappService } from '../../../services/swapp.service';

@Component({
  selector: 'app-wallet-settings',
  templateUrl: './swapps-settings.component.html',
  styleUrls: ['./swapps-settings.component.scss']
})
export class WalletSettingsComponent implements OnInit {

  swapps : Array<any>;

  constructor(public swappService: SwappService) {
    this.swapps = [];
  }

  ngOnInit() {
    this.swapps = this.swappService.getAllSwapps();
  }

  onChange(){
    this.swappService.setSwappSetting(this.swapps);
    this.swappService.applyChanges();
  }

}
