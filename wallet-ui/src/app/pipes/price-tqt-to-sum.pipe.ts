import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceTqtToSum'
})
export class PriceTqtToSumPipe implements PipeTransform {

  transform(value: any, row?: any): any {
      var sum = 0
      var quantity = parseInt(row.quantityQNT) / Math.pow(10, row.decimals);
      var price = parseInt(value) * Math.pow(10, row.decimals);
      var sum = quantity * price / 100000000;
      return sum.toLocaleString('en-US', {maximumFractionDigits: row.decimals, minimumFractionDigits: row.decimals});
  }

}
