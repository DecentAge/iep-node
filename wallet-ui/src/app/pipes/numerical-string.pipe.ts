import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numericalString'
})
export class NumericalStringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (!value) {
          value = 0;
      }
      return value.toLocaleString('en-US', {minimumFractionDigits: 2});
  }

}
