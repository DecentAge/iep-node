import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notSet'
})
export class NotSetPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value === undefined || value === '') {
          return 'Not set';
      } else {
          return value;
      }
  }

}
