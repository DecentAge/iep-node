import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionConf'
})
export class TransactionConfPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (!value) {
          value = 0;
      }
      if (value === 0) {

          return '<span class="badge badge-secondary">' + value + '</span>';

      } else if (value > 0 && value < 10) {

          return '<span class="badge badge-danger">' + value + '</span>';

      } else if (value >= 10 && value < 100) {

          return '<span class="badge badge-warning">' + value + '</span>';

      } else if (value >= 100 && value < 720) {

          return '<span class="badge badge-success">' + value + '</span>';

      } else if (value >= 720) {

          return '<span class="badge badge-success"> +720</span>';

      } else {

          return '<span class="badge badge-primary">' + value + '</span>';

      }
  };

}