import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supply'
})
export class SupplyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var actualPow = args;
    var divider = Math.pow(10, actualPow);
    value = value / divider;
    return value.toLocaleString('en-US', {minimumFractionDigits: 2});
  }

}
