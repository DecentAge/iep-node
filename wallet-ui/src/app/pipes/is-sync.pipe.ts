import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSync'
})
export class IsSyncPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case true:
        return 'NO';
      case false:
        return 'Yes';
      default:
        return 'NO';
    }
  }

}
