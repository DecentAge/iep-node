import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'proxies'
})
export class ProxiesPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'BTC': {
                if (args) {
                    return '<span class="label label-warning" >BTC</span>';
                } else {
                    return '<span class="label label-default" >BTC</span>';
                }
            }
            case 'ETH': {
                if (args) {
                    return '<span class="label label-warning" >ETH</span>';
                } else {
                    return '<span class="label label-default" >ETH</span>';
                }
            }
            case 'LTC': {
                if (args) {
                    return '<span class="label label-warning" >LTC</span>';
                } else {
                    return '<span class="label label-default" >LTC</span>';
                }
            }

            case 'XRP': {
                if (args) {
                    return '<span class="label label-warning" >XRP</span>';
                } else {
                    return '<span class="label label-default" >XRP</span>';
                }
            }

            case 'MKT': {
                if (args) {
                    return '<span class="label label-warning" >MKT</span>';
                } else {
                    return '<span class="label label-default" >MKT</span>';
                }
            }

            default: {
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
            }
        }
    }

}
