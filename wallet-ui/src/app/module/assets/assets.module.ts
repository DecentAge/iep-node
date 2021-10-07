import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssetsRoutingModule } from './assets-routing.module';
import { ShowAssetsComponent } from './show-assets/show-assets.component';
import { MyOpenOrdersComponent } from './my-open-orders/my-open-orders.component';
import { MyTradesComponent } from './my-trades/my-trades.component';
import { MyTransfersComponent } from './my-transfers/my-transfers.component';
import { LastTradesComponent } from './last-trades/last-trades.component';
import { IssueAssetComponent } from './issue-asset/issue-asset.component';
import { AssetsService } from './assets.service';
import { SendAssetsComponent } from './send-assets/send-assets.component';
import { AssetsComponent } from './show-assets/assets/assets.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../../shared/shared.module';
import { AssetDetailsComponent } from './show-assets/assets/asset-details/asset-details.component';
import { SearchAssetsComponent } from './search-assets/search-assets.component';
import { TradeDeskComponent } from './trade-desk/trade-desk.component';
import { OpenOrdersComponent } from './my-open-orders/open-orders/open-orders.component';
import { CancelOrderComponent } from './my-open-orders/open-orders/cancel-order/cancel-order.component';
import { TransferAssetComponent } from './show-assets/assets/transfer-asset/transfer-asset.component';
import {ShareToQuantityPipe} from '../../pipes/share-to-quantity.pipe';
import {AliasesService} from '../aliases/aliases.service';
import { DividendPaymentComponent } from './show-assets/assets/dividend-payment/dividend-payment.component';
import {CurrenciesService} from '../currencies/currencies.service';
import { DeleteSharesComponent } from './show-assets/assets/delete-shares/delete-shares.component';
import { DeleteAssetComponent } from './show-assets/assets/delete-asset/delete-asset.component';
import { DividentHistoryComponent } from './show-assets/assets/divident-history/divident-history.component';
import {QuantityToSharePipe} from '../../pipes/quantity-to-share.pipe';
import {AmChartsService} from '@amcharts/amcharts3-angular';
import {NumericalStringPipe} from '../../pipes/numerical-string.pipe';
import { TradeDeskSellAssetComponent } from './trade-desk/trade-desk-sell-asset/trade-desk-sell-asset.component';
import { TradeDeskBuyAssetComponent } from './trade-desk/trade-desk-buy-asset/trade-desk-buy-asset.component';
import {PriceTqtToSumPipe} from '../../pipes/price-tqt-to-sum.pipe';
import { ExpectedAssetTransferComponent } from './show-assets/assets/expected-asset-transfer/expected-asset-transfer.component';
import { ExpectedOrderCancellationComponent } from './show-assets/assets/expected-order-cancellation/expected-order-cancellation.component';
import { ExpectedAssetDeletesComponent } from './show-assets/assets/expected-asset-deletes/expected-asset-deletes.component';
import { ExpectedOrderDetailsComponent } from './show-assets/assets/expected-order-details/expected-order-details.component';
import { OrderTradeDetailsComponent } from './show-assets/assets/order-trade-details/order-trade-details.component';
import {RateTqtToPricePipe} from '../../pipes/rate-tqt-to-price.pipe';
import {PricePerShareSellOrderPipe} from '../../pipes/price-per-share-sell-order.pipe';
import {PricePerShareBuyOrderPipe} from '../../pipes/price-per-share-buy-order.pipe';


@NgModule({
    imports: [
        CommonModule,
        AssetsRoutingModule,
        ArchwizardModule,
        FormsModule,
        SharedModule,
        NgxChartsModule,
        NgxDatatableModule,
        NgbModule
    ],
    declarations: [
        ShowAssetsComponent,
        MyOpenOrdersComponent,
        MyTradesComponent,
        MyTransfersComponent,
        LastTradesComponent,
        IssueAssetComponent,
        SendAssetsComponent,
        AssetsComponent,
        AssetDetailsComponent,
        SearchAssetsComponent,
        TradeDeskComponent,
        OpenOrdersComponent,
        CancelOrderComponent,
        TransferAssetComponent,
        DividendPaymentComponent,
        DeleteSharesComponent,
        DeleteAssetComponent,
        DividentHistoryComponent,
        TradeDeskSellAssetComponent,
        TradeDeskBuyAssetComponent,
        ExpectedAssetTransferComponent,
        ExpectedOrderCancellationComponent,
        ExpectedAssetDeletesComponent,
        ExpectedOrderDetailsComponent,
        OrderTradeDetailsComponent
    ],
    providers: [
        AssetsService,
        AliasesService,
        CurrenciesService,
        ShareToQuantityPipe,
        QuantityToSharePipe,
        NumericalStringPipe,
        PriceTqtToSumPipe,
        RateTqtToPricePipe,
        PricePerShareSellOrderPipe,
        PricePerShareBuyOrderPipe,
        AmChartsService
    ],
    entryComponents: [ShowAssetsComponent],
})
export class AssetsModule {
}
