import { Pipe, PipeTransform } from '@angular/core';
import {AppConstants} from '../config/constants';

@Pipe({
  name: 'quantToAmount'
})
export class QuantToAmountPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (!value) {
          value = 0;
      }
      let amount = parseFloat(value) / AppConstants.baseConfig.TOKEN_QUANTS;
      return amount;
  }

}
