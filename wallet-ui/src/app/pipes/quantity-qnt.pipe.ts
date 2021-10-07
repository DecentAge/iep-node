import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantityQnt'
})
export class QuantityQntPipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
      var divider = Math.pow(10, decimals);
      value = value / divider;
      return value.toLocaleString('en-US', {minimumFractionDigits: decimals});
  }

}
