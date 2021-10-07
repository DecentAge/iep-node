import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'votingModelLabel'
})
export class VotingModelLabelPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 0:
                return '<i class="fa fa-user-o" aria-hidden="true"></i>'; // Account
            case 1:
                return '<i class="fa fa-credit-card" aria-hidden="true"></i>'; // 'Balance';
            case 2:
                return '<i class="fa fa-bar-chart" aria-hidden="true"></i>'; // 'Asset';
            case 3:
                return '<i class="fa fa-random" aria-hidden="true"></i>'; //'Currency';
            default:
            // return value;
        }
    }

}
