import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessorsDaysLeft'
})
export class LessorsDaysLeftPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      var currentHeightFrom = args[0];
      var currentHeight = args[1];
      var range = ( value - currentHeightFrom );
      var diff = ( value - currentHeight);
      value = diff * 100 / range;
      var days = diff / 1440;

      var col = days.toLocaleString('en-US', {minimumFractionDigits: 2});

      return days.toLocaleString('en-US', {minimumFractionDigits: 2})
  }

}
