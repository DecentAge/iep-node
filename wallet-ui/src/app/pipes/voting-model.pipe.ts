import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'votingModel'
})
export class VotingModelPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if ( value == 0) {
            return 'Account';
        } else if ( value == 1) {
            return 'Balance';
        } else if ( value == 2) {
            return 'Asset';
        } else if ( value == 3) {
            return 'Currency';
        }
    }

}
