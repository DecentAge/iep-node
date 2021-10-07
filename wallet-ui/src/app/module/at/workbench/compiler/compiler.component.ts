import { Component, OnInit } from '@angular/core';
import * as AlertFunctions from '../../../../shared/data/sweet-alerts';

import { HttpClient } from "@angular/common/http";
import { AppConstants } from "../../../../config/constants";
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-compiler',
    templateUrl: './compiler.component.html',
    styleUrls: ['./compiler.component.scss']
})
export class CompilerComponent implements OnInit {
    atTextCode: string = "";
    outputCode: string = "";

    constructor(public httpClient: HttpClient,
        public commonService: CommonService) {

    }

    ngOnInit() {

    }

    getCode(code) {
        let params = new FormData();

        params.append('code', code);
        params.append('data', "");

        this.httpClient.post(AppConstants.ATConfig.ATCompilerURL, params, { responseType: 'json' })
            .subscribe((success: any) => {
                if (success.data) {
                    this.outputCode = success.data;
                } else {
                    this.outputCode = "";
                    const title: string = this.commonService.translateAlertTitle('Error');
                    const msg: string = this.commonService.translateInfoMessage('at-compiler-output-code-error-msg');
                    AlertFunctions.InfoAlertBox(title,
                        msg,
                        'OK',
                        'error').then((isConfirm: any) => {
                        });
                }
            });
    }

}
