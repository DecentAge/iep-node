import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'gateways'
})
export class GatewaysPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'TenderMint': {
                if (args) {
                    return '<span class="label label-warning" >TM</span>';
                } else {
                    return '<span class="label label-default" >TM</span>';
                }
            }

            case 'ZeroNet': {
                if (args) {
                    return '<span class="label label-warning" >ZN</span>';
                } else {
                    return '<span class="label label-default" >ZN</span>';
                }
            }

            case 'IPFS': {
                if (args) {
                    return '<span class="label label-warning" >IPFS</span>';
                } else {
                    return '<span class="label label-default" >IPFS</span>';
                }
            }

            default: {
                return '<small> <span class="fa fa-remove" style="color:red"></span> </small>';
            }
        }
    }

}
