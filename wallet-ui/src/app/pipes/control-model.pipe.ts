import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'controlModel'
})
export class ControlModelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      value = parseInt(value);

      switch (value) {
          case 0:
              return 'Account';
          case 1:
              return 'Balance';
          case 2:
              return 'Asset';
          case 3:
              return 'Currency';
          default:
              return value;
      }
  }

}
