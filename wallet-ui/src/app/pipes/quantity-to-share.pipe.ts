import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantityToShare'
})
export class QuantityToSharePipe implements PipeTransform {

  transform(value: any, numOfDecimals?: any): any {
      const actualPow = numOfDecimals;
      const divider = Math.pow(10, actualPow);
      value = parseFloat(value) / divider;
      return value;
  }

}
