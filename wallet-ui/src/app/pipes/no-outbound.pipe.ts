import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noOutbound'
})
export class NoOutboundPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value === undefined || value === '') {
          return 'No public key available, no outbound transaction made.';
      } else {
          return value;
      }
  }

}
