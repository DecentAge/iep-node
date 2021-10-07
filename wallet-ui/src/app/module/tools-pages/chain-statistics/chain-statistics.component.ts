import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../tools.service';
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-chain-statistics',
  templateUrl: './chain-statistics.component.html',
  styleUrls: ['./chain-statistics.component.scss']
})
export class ChainStatisticsComponent implements OnInit {

  constructor(public toolsService: ToolsService,
    public commonService: CommonService) { }

  chainStatistics: any = {};
  ngOnInit() {
    this.getChainStats();
  }

  getChainStats() {

    this.toolsService.getChainStats().subscribe((success) => {
      if (!success.errorCode) {

        this.chainStatistics = success;

      } else {
        let title: string = this.commonService.translateAlertTitle('Error');
        let errMsg: string = this.commonService.translateErrorMessageParams('sorry-error-occurred',
        success);
        alertFunctions.InfoAlertBox(title,
            errMsg,
            'OK',
            'error').then((isConfirm: any) => {
            });
      }
    });

  };

}
