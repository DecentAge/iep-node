import { Pipe, PipeTransform } from '@angular/core';
import {AppConstants} from '../config/constants';

@Pipe({
  name: 'amountTqt'
})
export class AmountTqtPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
        value = 0;
    }
    let amount = value / AppConstants.baseConfig.TOKEN_QUANTS;
    return amount.toLocaleString('en-US', {minimumFractionDigits: 2});
  }

}
