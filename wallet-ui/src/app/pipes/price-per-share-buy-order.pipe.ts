import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePerShareBuyOrder'
})
export class PricePerShareBuyOrderPipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
      var pow = Math.pow(10, decimals);
      var mult = value * pow;
      var div = mult / 100000000;
      return div;
  }

}
