import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasMessage'
})
export class HasMessagePipe implements PipeTransform {

  transform(row: any, account: any): any {
      if (row.attachment && row.attachment.encryptedMessage) {
          if (account === row.senderRS) {
              return ' <i class="fa fa-upload" aria-hidden="true" style="color: black;"></i> ';
          } else if (account === row.recipientRS) {
              return '<i class="fa fa-download" aria-hidden="true" style="color:black;"></i>';
          } else {
              return '<i class="fa fa-check success" aria-hidden="true"></i>'; //was wrapped in small TODO:need to check dependency
          }
      } else {
          return '<i class="fa fa-times danger" aria-hidden="true"></i>'; //was wrapped in small TODO:need to check dependency
      }

  }

}
