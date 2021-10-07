import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

    transform(type: any, subtype: any, args?: any): any {
        switch (type) {
            case 0:
                return '<i class="fa fa-usd" aria-hidden="true"></i>';
            case 1:
                return '<i class="fa fa-envelope" aria-hidden="true"></i>';
            case 2:
                return '<span class="glyphicon glyphicon-signal" aria-hidden="true"></span>';
            case 4:
                return '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
            case 5:
                return ' <i class="fa fa-random" aria-hidden="true"></i>';
            case 7:
                return '<i class="fa fa-users" aria-hidden="true"></i>';
        }
    }
}
