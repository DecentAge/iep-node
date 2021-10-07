import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCurrenciesComponent } from './show-currencies/show-currencies.component';
import { MyTransfersComponent } from './my-transfers/my-transfers.component';
import { MyOpenOffersComponent } from './my-open-offers/my-open-offers.component';
import { IssueCurrencyComponent } from './issue-currency/issue-currency.component';
import { SendCurrenciesComponent } from './send-currencies/send-currencies.component';
import { CurrenciesComponent } from './show-currencies/currencies/currencies.component';
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { CurrencyDetailsComponent } from '../currencies/currency-details/currency-details.component';
import { AccountDetailComponent } from "../../shared/search/account-detail/account-detail.component";
import { SearchCurrenciesComponent } from './search-currencies/search-currencies.component';
import { TradeDeskComponent } from './trade-desk/trade-desk.component';
import { TradeDeskSellComponent } from './trade-desk/trade-desk-sell/trade-desk-sell.component';
import { TradeDeskBuyComponent } from './trade-desk/trade-desk-buy/trade-desk-buy.component';
import { PublishExchangeOfferComponent } from './trade-desk/publish-exchange-offer/publish-exchange-offer.component';
import { PublishExchangeBuyOfferComponent } from './trade-desk/publish-exchange-buy-offer/publish-exchange-buy-offer.component';
import { PublishExchangeSellOfferComponent } from './trade-desk/publish-exchange-sell-offer/publish-exchange-sell-offer.component';
import { TransferCurrencyComponent } from './show-currencies/currencies/transfer-currency/transfer-currency.component';
import { DeleteCurrencyComponent } from './show-currencies/currencies/delete-currency/delete-currency.component';
import { OpenOffersComponent } from './my-open-offers/open-offers/open-offers.component';
import { CancelOfferComponent } from './my-open-offers/cancel-offer/cancel-offer.component';
import { LastExchangesComponent } from './last-exchanges/last-exchanges.component';
import { MyExchangesComponent } from './my-exchanges/my-exchanges.component';

const routes: Routes = [
    {
        path: 'show-currencies',
        component: ShowCurrenciesComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path: 'my',
                component: CurrenciesComponent,
                data: {
                    currencyType: "MY",
                    title: 'My Currencies'
                }
            },
            {
                path: 'all',
                component: CurrenciesComponent,
                data: {
                    currencyType: "ALL",
                    title: 'All Currencies'
                },
            }
        ]
    },
    {
        path: 'show-currencies/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'show-currencies/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-currencies/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-currencies/transfer-currency/:id',
        component: TransferCurrencyComponent,
    },
    {
        path: 'show-currencies/delete-currency/:id',
        component: DeleteCurrencyComponent,
    },
    {
        path: 'trade/:id',
        component: TradeDeskComponent
    },
    {
        path: 'trade/:id/buy',
        component: TradeDeskBuyComponent
    },
    {
        path: 'trade/:id/sell',
        component: TradeDeskSellComponent
    },
    {
        path: 'trade/:id/publish-exchange-offer',
        component: PublishExchangeOfferComponent,
    },
    {
        path: 'trade/:id/publish-exchange-buy-offer',
        component: PublishExchangeBuyOfferComponent,
    },
    {
        path: 'trade/:id/publish-exchange-sell-offer',
        component: PublishExchangeSellOfferComponent,
    },
    {
        path: 'trade/:id/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'trade/:id/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'trade/:id/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'search-currencies',
        component: SearchCurrenciesComponent
    },
    {
        path: 'search-currencies/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'search-currencies/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-exchanges',
        component: MyExchangesComponent
    },
    {
        path: 'my-exchanges/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-exchanges/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'my-exchanges/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'last-exchanges',
        component: LastExchangesComponent
    },
    {
        path: 'last-exchanges/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'last-exchanges/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'last-exchanges/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-transfers',
        component: MyTransfersComponent
    },
    {
        path: 'my-transfers/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-transfers/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'my-transfers/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-open-offers',
        component: MyOpenOffersComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'buy'
            },
            {
                path: 'buy',
                component: OpenOffersComponent,
                data: {
                    offerType: "BUY",
                    title: 'Open Buy Offers'
                }
            },
            {
                path: 'sell',
                component: OpenOffersComponent,
                data: {
                    offerType: "SELL",
                    title: 'Open Sell Offers'
                },
            }
        ]
    },
    {
        path: 'my-open-offers/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'my-open-offers/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-open-offers/cancel-offer',
        component: CancelOfferComponent
    },
    {
        path: 'issue-currency',
        component: IssueCurrencyComponent
    },
    {
        path: 'send-currencies',
        component: SendCurrenciesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CurrenciesRoutingModule {
}
