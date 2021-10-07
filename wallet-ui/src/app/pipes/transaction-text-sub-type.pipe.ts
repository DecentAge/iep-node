import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionTextSubType'
})
export class TransactionTextSubTypePipe implements PipeTransform {

  transform(type: any, subType: any): any {
      switch (type) {
          case 0:
              switch (subType) {
                  case 0:
                      return 'Ordinary Payment';
                  default:
                      //return subType;
              }
              break;
          case 1:
              switch (subType) {
                  case 0:
                      return 'Encrypted Message';
                  case 1:
                      return 'Alias Assigment';
                  case 2:
                      return 'Poll Creation';
                  case 3:
                      return 'Vote Casting';
                  case 4:
                      return 'Hub Announcement';
                  case 5:
                      return 'Account Info';
                  case 6:
                      return 'Alias Sell';
                  case 7:
                      return 'Alias Buy';
                  case 8:
                      return 'Alias Delete';
                  case 9:
                      return 'Phasing Vote Casting';
                  case 10:
                      return 'Account Property';
                  case 11:
                      return 'Account Property delete';
                  default:
                      //return subType;
              }
              break;
          case 2:
              switch (subType) {
                  case 0:
                      return 'Asset Issuance';
                  case 1:
                      return 'Asset Transfer';
                  case 2:
                      return 'Ask Order Placement';
                  case 3:
                      return 'Bid Order Placement';
                  case 4:
                      return 'Ask Order Cancellation';
                  case 5:
                      return 'Bid Order Cancellation';
                  case 6:
                      return 'Dividend Payment';
                  case 7:
                      return 'Shares Delete';
                  case 8:
                      return 'Asset Delete';
                  default:
                      //return subType;
              }
              break;
          case 4:
              switch (subType) {
                  case 0:
                      return 'Effective Balance Lease';
                  case 1:
                      return 'Account Control';
                  default:
                      //return subType;
              }
              break;
          case 5:
              switch (subType) {
                  case 0:
                      return 'Currency Issuance';
                  case 1:
                      return 'Reserve Increase';
                  case 2:
                      return 'Resverve Claim';
                  case 3:
                      return 'Currency Transfer';
                  case 4:
                      return 'Publish Exchange Offer';
                  case 5:
                      return 'Exchange Buy';
                  case 6:
                      return 'Exchange Sell';
                  case 7:
                      return 'Currency Minting';
                  case 8:
                      return 'Currency Deletion';
                  default:
                      //return subType;
              }
              break;

          case 7:
              switch (subType) {
                  case 0:
                      return 'Shuffling Creation';
                  case 1:
                      return 'Shuffling Register';
                  case 2:
                      return 'Shuffling Processing';
                  case 3:
                      return 'Shuffling Recipients';
                  case 4:
                      return 'Shuffling Verification';
                  case 5:
                      return 'Shuffling Cancel';
                  default:
                      //return subType;
              }
              break;

          case 21:
              switch (subType) {
                  case 0:
                      return 'Escrow Creation';
                  case 1:
                      return 'Escrow Sign';
                  case 2:
                      return 'Escrow Results';
                  case 3:
                      return 'Subscription Creation';
                  case 4:
                      return 'Subscription Cancel';
                  case 5:
                      return 'Subscription Payment';
                  default:
                      //return subType;
              }
              break;


          case 22:
              switch (subType) {
                  case 0:
                      return 'AT Creation';
                  case 1:
                      return 'AT Payment';
                  default:
                    //  return subType;
              }
              break;


          default:
              return subType;
      }
  };

}
