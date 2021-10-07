import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../tools.service';
import * as alertFunctions from '../../../shared/data/sweet-alerts';
import { AppConstants } from '../../../config/constants';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-validate-signature',
    templateUrl: './validate-signature.component.html',
    styleUrls: ['./validate-signature.component.scss']
})
export class ValidateSignatureComponent implements OnInit {
    valid: any;
    color: any = 'black';
    buttonColor: any = 'primary';
    account: any = 'Account';
    validateSignatureForm: any = {
        'token': '',
        'message': ''
    }

    constructor(public toolsService: ToolsService,
        public commonService: CommonService) {
    }

    ngOnInit() {
    }

    validateToken() {

        this.toolsService.decodeToken(this.validateSignatureForm.token, this.validateSignatureForm.message).subscribe((success) => {
            if (!success['errorCode']) {
                this.valid = success['valid'];
                if (success['valid']) {
                    this.color = 'green;';
                    this.buttonColor = 'success';
                    this.account = success['accountRS'];
                } else {
                    this.color = 'red;';
                    this.buttonColor = 'danger';
                    this.account = 'Invalid Account';
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

}
