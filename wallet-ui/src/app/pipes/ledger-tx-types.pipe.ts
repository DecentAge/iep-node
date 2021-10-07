import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ledgerTxTypes'
})
export class LedgerTxTypesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value === 'BLOCK_GENERATED') {
          return ' Block Generated';
      } else if (value === 'REJECT_PHASED_TRANSACTION') {
          return 'Rejected Phased Transaction';
      } else if (value === 'TRANSACTION_FEE') {
          return 'Transaction Fee';
      } else if (value === 'ORDINARY_PAYMENT') {
          return 'Ordinary Payment';
      } else if (value === 'ACCOUNT_INFO') {
          return 'Account Info';
      } else if (value === 'ALIAS_ASSIGNMENT') {
          return 'Alias Assignment';
      } else if (value === 'ALIAS_BUY') {
          return 'Alias Buy';
      } else if (value === 'ALIAS_DELETE') {
          return 'Alias Delete';
      } else if (value === 'ALIAS_SELL') {
          return 'Alias Sell';
      } else if (value === 'ARBITRARY_MESSAGE') {
          return 'Message';
      } else if (value === 'HUB_ANNOUNCEMENT') {
          return 'Hub Announcement';
      } else if (value === 'PHASING_VOTE_CASTING') {
          return 'Phased Vote Casting';
      } else if (value === 'POLL_CREATION') {
          return 'Poll Creation';
      } else if (value === 'VOTE_CASTING') {
          return 'Vote Casting';
      } else if (value === 'ACCOUNT_PROPERTY') {
          return 'Account Property';
      } else if (value === 'ACCOUNT_PROPERTY_DELETE') {
          return 'Account Property Delete';
      } else if (value === 'ASSET_ASK_ORDER_CANCELLATION') {
          return 'Ask Order Cancellation';
      } else if (value === 'ASSET_ASK_ORDER_PLACEMENT') {
          return 'Ask Order Placement';
      } else if (value === 'ASSET_BID_ORDER_CANCELLATION') {
          return 'Bit Order Cancellation';
      } else if (value === 'ASSET_BID_ORDER_PLACEMENT') {
          return 'Bit Order Placement';
      } else if (value === 'ASSET_DIVIDEND_PAYMENT') {
          return 'Dividend Payment';
      } else if (value === 'ASSET_ISSUANCE') {
          return 'Asset Issuance';
      } else if (value === 'ASSET_TRADE') {
          return 'Asset Trade';
      } else if (value === 'ASSET_TRANSFER') {
          return 'Asset Transfer';
      } else if (value === 'ASSET_DELETE') {
          return 'Asset Delete';
      } else if (value === 'ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING') {
          return 'Effective Balance Leasing';
      } else if (value === 'ACCOUNT_CONTROL_PHASING_ONLY') {
          return 'Account Control';
      } else if (value === 'CURRENCY_DELETION') {
          return 'Currency Deletion';
      } else if (value === 'CURRENCY_DISTRIBUTION') {
          return 'Currency Distribution';
      } else if (value === 'CURRENCY_EXCHANGE') {
          return 'Currency Exchange';
      } else if (value === 'CURRENCY_EXCHANGE_BUY') {
          return 'Currency Buy';
      } else if (value === 'CURRENCY_EXCHANGE_SELL') {
          return 'Currency Sell';
      } else if (value === 'CURRENCY_ISSUANCE') {
          return 'Currency Issuance';
      } else if (value === 'CURRENCY_MINTING') {
          return 'Currency Minting';
      } else if (value === 'CURRENCY_OFFER_EXPIRED') {
          return 'Currency Offer Expired';
      } else if (value === 'CURRENCY_OFFER_REPLACED') {
          return 'Currency Offer Replaced';
      } else if (value === 'CURRENCY_PUBLISH_EXCHANGE_OFFER') {
          return 'Currency Offer';
      } else if (value === 'CURRENCY_RESERVE_CLAIM') {
          return 'Currency Reserve Claim';
      } else if (value === 'CURRENCY_RESERVE_INCREASE') {
          return 'Currency Reserve Increase';
      } else if (value === 'CURRENCY_TRANSFER') {
          return 'Currency Transfer';
      } else if (value === 'CURRENCY_UNDO_CROWDFUNDING') {
          return 'Currency Undo Crowdfunding';
      } else if (value === 'SHUFFLING_REGISTRATION') {
          return 'Shuffling Registration';
      } else if (value === 'SHUFFLING_PROCESSING') {
          return 'Shuffling Processing';
      } else if (value === 'SHUFFLING_CANCELLATION') {
          return 'Shuffling Cancellation';
      } else if (value === 'SHUFFLING_DISTRIBUTION') {
          return 'Shuffling Distribution';
      } else if (value === 'SUBSCRIPTION_CANCEL') {
          return 'Subscription Cancellation';
      } else if (value === 'SUBSCRIPTION_PAYMENT') {
          return 'Sunscription Payment';
      } else if (value === 'SUBSCRIPTION_SUBSCRIBE') {
          return 'Subscription Subscribe';
      } else if (value === 'ESCROW_CREATION') {
          return 'Escrow Creation';
      } else if (value === 'ESCROW_SIGN') {
          return 'Escrow Signing';
      } else if (value === 'ESCROW_RESULT') {
          return 'Escrow Result';
      } else if (value === 'AUTOMATED_TRANSACTION_CREATION') {
          return 'AT Creation';
      } else if (value === 'AT_PAYMENT') {
          return 'AT Payment';
      } else {
          return 'Unknown Holding';
      }
  }

}
