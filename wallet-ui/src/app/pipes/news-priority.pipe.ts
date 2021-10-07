import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'newsPriority'
})
export class NewsPriorityPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            value = 0;
        }
        value = parseInt(value);

        if (value === 0) {
            return '<span class="label label-default"> Low </span>';
        } else if (value === 5) {
            return '<span class="label label-warning"> medium </span>';
        } else if (value === 10) {
            return '<span class="label label-danger"> High </span>';
        } else {
            return '<span class="label label-default"> Low </span>';
        }
    }

}
