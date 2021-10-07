import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buySell'
})
export class BuySellPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      switch (value) {
          case 'buy':
              return '<span class="badge badge-success">B</span>';
          case 'sell':
              return '<span class="badge badge-danger">S</span>';
          default:
              return '<span class="badge badge-primary">U</span>';
      }
  }

}
