import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'blockTransactions'
})
export class BlockTransactionsPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value === 0) {
            return '<span class="label label-default">' + value + '</span>';
        } else if (value > 0 && value < 100) {
            return '<span class="label label-success">' + value + '</span>';
        } else if (value >= 100 && value < 200) {
            return '<span class="label label-warning">' + value + '</span>';
        } else if (value >= 200) {
            return '<span class="label label-danger">' + value + '</span>';
        }
    }

}
