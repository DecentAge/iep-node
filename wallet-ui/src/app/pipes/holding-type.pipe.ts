import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'holdingType'
})
export class HoldingTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = parseInt(value);

    switch (value) {
        case 0:
            return 'XIN';
        case 1:
            return 'Asset';
        case 2:
            return 'Currency';
        default:
            return value;
    }
  }

}
