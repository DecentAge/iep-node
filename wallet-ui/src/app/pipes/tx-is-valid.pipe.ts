import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'txIsValid'
})
export class TxIsValidPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      switch (value) {
          case true:
              return '<small> <i class="fa fa-check text-success"></i></small>';
          case false:
              return '<small> <i class="fa fa-times text-danger"></i></small>';
          default:
              return '<small> <i class="fa fa-times text-danger"></i> </small>';
      }
  }
}
