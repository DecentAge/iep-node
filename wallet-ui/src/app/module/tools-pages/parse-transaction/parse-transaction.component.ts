import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../tools.service';
import { AppConstants } from '../../../config/constants';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-parse-transaction',
    templateUrl: './parse-transaction.component.html',
    styleUrls: ['./parse-transaction.component.scss']
})
export class ParseTransactionComponent implements OnInit {
    buttonColor: any = 'primary';
    parseTransactionForm: any = {
        'bytes': '',
        'Json': ''
    }

    constructor(public toolsService: ToolsService,
        public commonService: CommonService) {
    }

    ngOnInit() {
    }

    parseTransaction() {

        this.toolsService.parseTransaction(this.parseTransactionForm.bytes).subscribe((success) => {
            if (!success['errorCode']) {

                delete success['restangularized'];
                delete success['fromServer'];
                delete success['parentResource'];
                delete success['restangularCollection'];
                delete success['route'];
                delete success['reqParams'];

                if (success['verify']) {
                    this.buttonColor = 'success';
                } else {
                    this.buttonColor = 'danger';
                }

                this.parseTransactionForm.json = JSON.stringify(success);

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
