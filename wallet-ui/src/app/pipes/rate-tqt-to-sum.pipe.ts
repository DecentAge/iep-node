import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rateTqtToSum'
})
export class RateTqtToSumPipe implements PipeTransform {

  transform(value: any, row?: any): any {

    var sum = 0;

    if(row.supply){
      sum = ( value * row.supply) / 100000000;
    } else if(row.units){
      let quantity = parseInt(row.units) / Math.pow(10, row.decimals);
      let price = parseInt(value) * Math.pow(10, row.decimals) ;
      sum = quantity * price / 100000000;
    }
    return sum.toLocaleString('en-US', {minimumFractionDigits: row.decimals});
  }
}
