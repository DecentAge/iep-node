import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'storage'
})
export class StoragePipe implements PipeTransform {

    transform(value: any, args?: any): any {

        switch (value) {
            case 'PostgreSQL': {
                if (args) {
                    return '<span class="label label-warning" >PS</span>';
                } else {
                    return '<span class="label label-default" >PS</span>';
                }
            }
            case 'RethinkDB': {
                if (args) {
                    return '<span class="label label-warning" >RT</span>';
                } else {
                    return '<span class="label label-default" >RT</span>';
                }
            }
            case 'MySQL': {
                if (args) {
                    return '<span class="label label-warning" >MY</span>';
                } else {
                    return '<span class="label label-default" >MY</span>';
                }
            }
            case 'Mongodb': {
                if (args) {
                    return '<span class="label label-warning" >MO</span>';
                } else {
                    return '<span class="label label-default" >MO</span>';
                }
            }
            default: {
                return '<small> <span class="fa fa-remove" style="color:red"></span> </small>';
            }
        }
    }

}
