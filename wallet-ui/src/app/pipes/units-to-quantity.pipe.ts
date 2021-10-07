import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitsToQuantity'
})
export class UnitsToQuantityPipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
    var quantity = parseInt(value) / Math.pow(10, decimals);
    return quantity.toLocaleString('en-US', {minimumFractionDigits: decimals});
  }

}
