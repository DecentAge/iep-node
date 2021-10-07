import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessorsPercentage'
})
export class LessorsPercentagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      var currentHeightFrom = args[0];
      var currentHeight = args[1];
      var range = ( value - currentHeightFrom );
      var diff = ( value - currentHeight );
      value = 100 - ( diff * 100 / range);
      var days = diff / 1440;
      var col = value.toLocaleString('en-US', {minimumFractionDigits: 2}) + '%';

      return col;
  }

}
