import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountToDecimal'
})
export class AmountToDecimalPipe implements PipeTransform {

  transform(value: any, numOfDecimals?: any): any {
      if (!value) {
          value = 0;
      }
      value = value * Math.pow(10, numOfDecimals);
      return value.toLocaleString('en-US', {minimumFractionDigits: numOfDecimals});
  }

}
