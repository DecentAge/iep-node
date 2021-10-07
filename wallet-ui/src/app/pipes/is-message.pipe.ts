import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isMessage'
})
export class IsMessagePipe implements PipeTransform {

  transform(type: any, subType: any): any {
      if (type === 1 && subType === 0) {
          return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
      } else {
          return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
      }
  }

}
