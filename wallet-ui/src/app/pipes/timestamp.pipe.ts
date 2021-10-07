import { Pipe, PipeTransform } from '@angular/core';
import { AppConstants } from '../config/constants';
import * as moment from '../../../node_modules/moment';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      try {
          let actual = value + AppConstants.baseConfig.EPOCH;
          let momentObj = moment.unix(actual);
          return momentObj.format('YYYY-MM-DDTHH:mm:ss');
      } catch (e) {
          console.error(e);
          return value;
      }
  }

}
