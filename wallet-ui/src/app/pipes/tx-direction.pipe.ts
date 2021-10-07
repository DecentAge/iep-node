import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'txDirection'
})
export class TxDirectionPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (value === args) {
        return ' <i class="ft ft-log-in success" aria-hidden="true" style="color:red;"></i> ';
    } else {
        return '<i class="ft ft-log-out danger" aria-hidden="true" style="color:green;"></i>';
    }
  }

}
