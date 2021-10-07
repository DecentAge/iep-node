import {Pipe, PipeTransform} from '@angular/core';
import {CommonService} from '../services/common.service';

@Pipe({
    name: 'escrowRole'
})
export class EscrowRolePipe implements PipeTransform {

    constructor(private commonService: CommonService) {
    }


    transform(value: any, account?: any): any {
        let role;
        if (account === value.senderRS) {
            role = 'SENDER';
        } else if (account === value.recipientRS) {
            role = 'RECIPIENT';
        } else {
            role = 'SIGNER';
        }
        return role;
    }

}
