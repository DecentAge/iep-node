import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../tools.service';
import { AppConstants } from '../../../config/constants';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-broadcast-transaction',
    templateUrl: './broadcast-transaction.component.html',
    styleUrls: ['./broadcast-transaction.component.scss']
})
export class BroadcastTransactionComponent implements OnInit {
    fullHash: any;
    requestProcessingTime: any;
    transaction: any;
    buttonColor: any;
    showTransaction: boolean = false;
    broadcastTransactionForm: any = {
        'bytes': ''
    }

    constructor(public toolsService: ToolsService,
        public commonService: CommonService) {
    }


    broadcastTransaction() {

        this.toolsService.broadcastTransaction(this.broadcastTransactionForm.bytes).subscribe((success) => {
            if (!success['errorCode']) {

                this.fullHash = success['fullHash'];
                this.requestProcessingTime = success['requestProcessingTime'];
                this.transaction = success['transaction'];

                if (success['transaction']) {
                    this.buttonColor = 'success';
                    this.showTransaction = true;
                } else {
                    this.buttonColor = 'danger';
                }

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


    ngOnInit() {
    }

}
