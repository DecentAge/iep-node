import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowCurrenciesComponent } from './show-currencies/show-currencies.component';
import { MyOpenOffersComponent } from './my-open-offers/my-open-offers.component';
import { MyTransfersComponent } from './my-transfers/my-transfers.component';
import { IssueCurrencyComponent } from './issue-currency/issue-currency.component';
import { CurrenciesRoutingModule } from './currencies-routing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from '../../shared/shared.module';
import { CurrencyDetailsComponent } from './currency-details/currency-details.component';
import { CurrenciesService } from './currencies.service';
import { SendCurrenciesComponent } from './send-currencies/send-currencies.component';
import { FormsModule } from '@angular/forms';
import { CurrenciesComponent } from './show-currencies/currencies/currencies.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SearchCurrenciesComponent } from './search-currencies/search-currencies.component';
import { TradeDeskComponent } from './trade-desk/trade-desk.component';
import { QuantToAmountPipe } from '../../pipes/quant-to-amount.pipe';
import { ShareToQuantityPipe } from '../../pipes/share-to-quantity.pipe';
import { QuantityToSharePipe } from '../../pipes/quantity-to-share.pipe';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { NumericalStringPipe } from '../../pipes/numerical-string.pipe';
import { TradeDeskSellComponent } from './trade-desk/trade-desk-sell/trade-desk-sell.component';
import { TradeDeskBuyComponent } from './trade-desk/trade-desk-buy/trade-desk-buy.component';
import { AmountTknPipe } from '../../pipes/amount-tkn.pipe';
import { PublishExchangeOfferComponent } from './trade-desk/publish-exchange-offer/publish-exchange-offer.component';
import { PublishExchangeBuyOfferComponent } from './trade-desk/publish-exchange-buy-offer/publish-exchange-buy-offer.component';
import { PublishExchangeSellOfferComponent } from './trade-desk/publish-exchange-sell-offer/publish-exchange-sell-offer.component';
import { TransferCurrencyComponent } from './show-currencies/currencies/transfer-currency/transfer-currency.component';
import { DeleteCurrencyComponent } from './show-currencies/currencies/delete-currency/delete-currency.component';
import { AliasesService } from '../aliases/aliases.service';
import { OpenOffersComponent } from './my-open-offers/open-offers/open-offers.component';
import { CancelOfferComponent } from './my-open-offers/cancel-offer/cancel-offer.component';
import { LastExchangesComponent } from './last-exchanges/last-exchanges.component';
import { MyExchangesComponent } from './my-exchanges/my-exchanges.component';

@NgModule({
    imports: [
        CommonModule,
        CurrenciesRoutingModule,
        SharedModule,
        ArchwizardModule,
        FormsModule,
        NgxDatatableModule
    ],
    declarations: [
        ShowCurrenciesComponent,
        MyOpenOffersComponent,
        MyTransfersComponent,
        IssueCurrencyComponent,
        CurrencyDetailsComponent,
        SendCurrenciesComponent,
        CurrenciesComponent,
        SearchCurrenciesComponent,
        TradeDeskComponent,
        TradeDeskSellComponent,
        TradeDeskBuyComponent,
        PublishExchangeOfferComponent,
        PublishExchangeBuyOfferComponent,
        PublishExchangeSellOfferComponent,
        TransferCurrencyComponent,
        DeleteCurrencyComponent,
        OpenOffersComponent,
        CancelOfferComponent,
        LastExchangesComponent,
        MyExchangesComponent
    ],
    providers: [
        CurrenciesService,
        QuantToAmountPipe,
        ShareToQuantityPipe,
        QuantityToSharePipe,
        AmChartsService,
        NumericalStringPipe,
        AmountTknPipe,
        AliasesService
    ]
})
export class CurrenciesModule {
}
