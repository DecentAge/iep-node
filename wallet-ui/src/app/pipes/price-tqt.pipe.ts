import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceTqt'
})
export class PriceTqtPipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
    var pow = Math.pow(10, decimals);
    var mult = value * pow;
    value = mult / 100000000;
    return value.toLocaleString('en-US', {minimumFractionDigits: decimals});
  }

}
