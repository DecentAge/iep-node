import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyModel'
})
export class CurrencyModelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
        case 1:
            return 'Exchangeable';
        case 8:
            return 'Claimable';
        case 16:
            return 'Mintable';
        case 2:
            return 'Controllable';
        case 4:
            return 'Reservable';
        case 32:
            return 'Non Shuffleable';
        default:
            return value;
    }
  }

}
