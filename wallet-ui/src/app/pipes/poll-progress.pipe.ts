import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'pollProgress'
})
export class PollProgressPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){

  }

  transform(value: any, row?: any): any {

    var color = 'danger';
    var percentage = parseInt( (row.currentReservePerUnitTQT * 100 / ( row.minReservePerUnitTQT )) + '' );
  
    if (percentage > 25 && percentage <= 50) {
      color = 'danger';
    } else if (percentage > 50 && percentage <= 75) {
      color = 'warning';
    } else if (percentage > 75) {
      color = 'success';
    }

    return {color, percentage}
  }

}
