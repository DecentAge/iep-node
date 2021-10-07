import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shufflingStage'
})
export class ShufflingStagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = parseInt(value);

    switch (value) {
        case 0:
            return 'Registration';
        case 1:
            return 'Processing';
        case 2:
            return 'Verification';
        case 3:
            return 'Blame';
        case 4:
            return 'Cancelled';
        case 5:
            return 'Done';
        default:
            return value;
    }
  }

}
