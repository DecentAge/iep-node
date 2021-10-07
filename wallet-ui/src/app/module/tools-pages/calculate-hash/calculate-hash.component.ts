import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../tools.service';
import * as alertFunctions from "../../../shared/data/sweet-alerts";
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-calculate-hash',
  templateUrl: './calculate-hash.component.html',
  styleUrls: ['./calculate-hash.component.scss']
})
export class CalculateHashComponent implements OnInit {

  calculateHashForm: any = {
    input: '',
    output: '',
    algo: 2
  }
  constructor(public toolsService: ToolsService,
    public commonService: CommonService) { }

  ngOnInit() {
  }

  calculateHash() {
    this.calculateHashForm.output = "";
    this.toolsService.calculateHash(this.calculateHashForm.algo, this.calculateHashForm.input).subscribe((success) => {
      if (!success.errorCode) {

        this.calculateHashForm.output = success.hash;

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
