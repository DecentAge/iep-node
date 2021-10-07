import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePerShareSellOrder'
})
export class PricePerShareSellOrderPipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
      var pow = Math.pow(10, decimals);
      return pow;
  }

}
