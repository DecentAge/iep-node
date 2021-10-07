import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shareToQuantity'
})
export class ShareToQuantityPipe implements PipeTransform {

  transform(value: any, numOfDecimals?: any): any {
    var actualPow = numOfDecimals;
    var multiplier = Math.pow(10, actualPow);
    value = parseFloat(value) * multiplier;
    return value;
  }

}
