import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionIconSubType'
})
export class TransactionIconSubTypePipe implements PipeTransform {

  transform(type: any, subType: any): any {
      switch (type) {
          case 0:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-usd" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ordinary Payment"></i>';
                  default:
                      //return subType;
              }
              break;
          case 1:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-envelope-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Encrypted Message"></i>';
                  case 1:
                      return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Assigment"></i>';
                  case 2:
                      return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Poll Creation"></i>';
                  case 3:
                      return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Vote Casting"></i>';
                  case 4:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Hub Announcement"></i>';
                  case 5:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Info"></i>';
                  case 6:
                      return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Sell"></i>';
                  case 7:
                      return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Buy"></i>';
                  case 8:
                      return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Delete"></i>';
                  case 9:
                      return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Phasing Vote Casting"></i>';
                  case 10:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property"></i>';
                  case 11:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property delete"></i>';
                  default:
                      //return subType;
              }
              break;
          case 2:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Issuance"></i>';
                  case 1:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Transfer"></i>';
                  case 2:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Placement"></i>';
                  case 3:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Placement"></i>';
                  case 4:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Cancellation"></i>';
                  case 5:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Cancellation"></i>';
                  case 6:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Dividend Payment"></i>';
                  case 7:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shares Delete"></i>';
                  case 8:
                      return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Delete"></i>';
                  default:
                      //return subType;
              }
              break;
          case 4:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Effective Balance Lease"></i>';
                  case 1:
                      return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Control"></i>';
                  default:
                      //return subType;
              }
              break;
          case 5:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Issuance"></i>';
                  case 1:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Reserve Increase"></i>';
                  case 2:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Resverve Claim"></i>';
                  case 3:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Transfer"></i>';
                  case 4:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Publish Exchange Offer"></i>';
                  case 5:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Buy"></i>';
                  case 6:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Sell"></i>';
                  case 7:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Minting"></i>';
                  case 8:
                      return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Deletion"></i>';
                  default:
                      //return subType;
              }
              break;

          case 7:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Creation"></i>';
                  case 1:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Register"></i>';
                  case 2:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Processing"></i>';
                  case 3:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Recipients"></i>';
                  case 4:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Verification"></i>';
                  case 5:
                      return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Cancel"></i>';
                  default:
                      //return subType;
              }
              break;

          case 21:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Creation"></i>';
                  case 1:
                      return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Sign"></i>';
                  case 2:
                      return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Results"></i>';
                  case 3:
                      return '<i class="fa fa-hourglass" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Creation"></i>';
                  case 4:
                      return '<i class="fa fa-hourglass-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Cancel"></i>';
                  case 5:
                      return '<i class="fa fa-hourglass-half" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Payment"></i>';
                  default:
                      //return subType;
              }
              break;


          case 22:
              switch (subType) {
                  case 0:
                      return '<i class="fa fa-cogs" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="AT Creation"></i>';
                  case 1:
                      return '<i class="fa fa-cogs" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="AT Payment"></i>';
                  default:
                    //  return subType;
              }
              break;


          default:
              return subType;
      }
  };

}
