import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberString'
})
export class NumberStringPipe implements PipeTransform {

  transform(value: any, numOfDecimals?: any): any {
      numOfDecimals = numOfDecimals || 2;
      return value.toLocaleString('en-US',
          {maximumFractionDigits: numOfDecimals, minimumFractionDigits: numOfDecimals});
  }

}
