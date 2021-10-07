import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'upDown'
})
export class UpDownPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value) {
            value = 0;
        }

        if (value === 0) {
            return '<span class="label label-default" >' + value + '</span>';
        } else if (value > 0) {
            return '<span class="label label-success" >' + value + '</span>';
        } else if (value < 0) {
            return '<span class="label label-danger"  >' + value + '</span>';
        } else {
            return '<span class="label label-primary" >' + value + '</span>';
        }
    }
}
