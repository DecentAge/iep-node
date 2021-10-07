import { Pipe, PipeTransform } from '@angular/core';
import {AppConstants} from "../config/constants";

@Pipe({
  name: 'amountToQuant'
})
export class AmountToQuantPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (!value) {
          value = 0;
      }

      return parseInt((parseFloat(value) * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10);
  }

}
