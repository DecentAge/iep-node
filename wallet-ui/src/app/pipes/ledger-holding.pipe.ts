import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ledgerHolding'
})
export class LedgerHoldingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value === 'UNCONFIRMED_XIN_BALANCE') {
          return ' Unconfirmed Balance ';
      } else if (value === 'XIN_BALANCE') {
          return ' Confirmed Balance ';
      } else if (value === 'UNCONFIRMED_ASSET_BALANCE') {
          return ' Unconfirmed Asssets ';
      } else if (value === 'ASSET_BALANCE') {
          return ' Asset Balance ';
      } else if (value === 'UNCONFIRMED_CURRENCY_BALANCE') {
          return ' Unconfirmed Currencies ';
      } else if (value === 'CURRENCY_BALANCE') {
          return ' Currency Balance ';
      } else {
          return 'Unknown Holding';
      }
  }

}
