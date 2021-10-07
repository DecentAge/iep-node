import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasMessageDirection'
})
export class HasMessageDirectionPipe implements PipeTransform {

  transform(row: any, account: any): any {
      if (account === row.senderRS) {
          return ' <i class="fa fa-upload" aria-hidden="true" style="color:black;"></i> ';
      } else {
          return '<i class="fa fa-download" aria-hidden="true" style="color:black;"></i>';
      }
  }

}
