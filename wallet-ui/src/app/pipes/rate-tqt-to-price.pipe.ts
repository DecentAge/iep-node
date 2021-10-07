import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rateTqtToPrice'
})
export class RateTqtToPricePipe implements PipeTransform {

  transform(value: any, decimals?: any): any {
    var price = parseInt(value) * Math.pow(10, decimals) / 100000000;
    return price.toLocaleString('en-US', {minimumFractionDigits: decimals});
  }

}
