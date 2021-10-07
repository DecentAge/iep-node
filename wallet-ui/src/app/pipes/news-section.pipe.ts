import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'newsSection'
})
export class NewsSectionPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            value = 0;
        }
        value = parseInt(value);

        if (value === 0) {
            return '<span class="label label-info"> Info </span>';
        } else if (value === 1) {
            return '<span class="label label-success"> Feature </span>';
        } else if (value === 2) {
            return '<span class="label label-success"> Update </span>';
        } else if (value === 3) {
            return '<span class="label label-warning"> Security </span>';
        } else if (value === 4) {
            return '<span class="label label-warning"> Voting </span>';
        } else if (value === 5) {
            return '<span class="label label-info"> Improvement </span>';
        } else if (value === 6) {
            return '<span class="label label-danger"> Alert </span>';
        } else {
            return '<span class="label label-info"> Info </span>';
        }
    }

}
