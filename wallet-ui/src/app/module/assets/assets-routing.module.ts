import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowAssetsComponent} from './show-assets/show-assets.component';
import {MyOpenOrdersComponent} from './my-open-orders/my-open-orders.component';
import {MyTradesComponent} from './my-trades/my-trades.component';
import {MyTransfersComponent} from './my-transfers/my-transfers.component';
import {LastTradesComponent} from './last-trades/last-trades.component';
import {IssueAssetComponent} from './issue-asset/issue-asset.component';
import {SendAssetsComponent} from './send-assets/send-assets.component';
import {AssetsComponent} from './show-assets/assets/assets.component';
import {AccountDetailComponent} from '../../shared/search/account-detail/account-detail.component';
import {TransactionDetailComponent} from '../../shared/search/transaction-detail/transaction-detail.component';
import {AssetDetailsComponent} from './show-assets/assets/asset-details/asset-details.component';
import {SearchAssetsComponent} from './search-assets/search-assets.component';
import {TradeDeskComponent} from './trade-desk/trade-desk.component';
import {OpenOrdersComponent} from './my-open-orders/open-orders/open-orders.component';
import {CancelOrderComponent} from './my-open-orders/open-orders/cancel-order/cancel-order.component';
import {TransferAssetComponent} from './show-assets/assets/transfer-asset/transfer-asset.component';
import {DividendPaymentComponent} from './show-assets/assets/dividend-payment/dividend-payment.component';
import {DeleteSharesComponent} from './show-assets/assets/delete-shares/delete-shares.component';
import {DeleteAssetComponent} from './show-assets/assets/delete-asset/delete-asset.component';
import {DividentHistoryComponent} from './show-assets/assets/divident-history/divident-history.component';
import {TradeDeskSellAssetComponent} from './trade-desk/trade-desk-sell-asset/trade-desk-sell-asset.component';
import {TradeDeskBuyAssetComponent} from './trade-desk/trade-desk-buy-asset/trade-desk-buy-asset.component';
import {ExpectedAssetTransferComponent} from './show-assets/assets/expected-asset-transfer/expected-asset-transfer.component';
import {ExpectedOrderCancellationComponent} from './show-assets/assets/expected-order-cancellation/expected-order-cancellation.component';
import {ExpectedAssetDeletesComponent} from './show-assets/assets/expected-asset-deletes/expected-asset-deletes.component';
import {ExpectedOrderDetailsComponent} from './show-assets/assets/expected-order-details/expected-order-details.component';
import {OrderTradeDetailsComponent} from './show-assets/assets/order-trade-details/order-trade-details.component';

const routes: Routes = [
    {
        path: 'show-assets',
        component: ShowAssetsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {   path: 'my',
                component: AssetsComponent,
                data: {
                    assetType: "MY",
                    title: 'My Assets'
                }
            },
            {   path: 'all',
                component: AssetsComponent,
                data: {
                    assetType: "ALL",
                    title: 'All Assets'
                },
            }
        ]
    },
    {
        path: 'show-assets/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-assets/asset-details',
        component: AssetDetailsComponent
    },
    {
        path: 'show-assets/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-assets/transfer-asset',
        component: TransferAssetComponent,
    },
    {
        path: 'show-assets/dividend-payment',
        component: DividendPaymentComponent,
    },
    {
        path: 'show-assets/delete-shares',
        component: DeleteSharesComponent,
    },
    {
        path: 'show-assets/delete-asset',
        component: DeleteAssetComponent,
    },
    {
        path: 'show-assets/dividend-history',
        component: DividentHistoryComponent,
    },
    {
        path: 'show-assets/dividend-history/transaction-details',
        component: TransactionDetailComponent,
    },
    {
        path: 'show-assets/expected-asset-transfer',
        component: ExpectedAssetTransferComponent,
    },
    {
        path: 'show-assets/expected-asset-transfer/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'show-assets/expected-asset-transfer/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-assets/expected-order-cancellation',
        component: ExpectedOrderCancellationComponent,
    },
    {
        path: 'show-assets/expected-order-cancellation/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-assets/expected-asset-deletes',
        component: ExpectedAssetDeletesComponent,
    },
    {
        path: 'show-assets/expected-asset-deletes/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'show-assets/expected-asset-deletes/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-assets/expected-order-details',
        component: ExpectedOrderDetailsComponent,
    },
    {
        path: 'show-assets/order-trade-details',
        component: OrderTradeDetailsComponent,
    },
    {
        path: 'show-assets/order-trade-details/transaction-details',
        component: TransactionDetailComponent,
    },
    {
        path: 'my-open-orders',
        component: MyOpenOrdersComponent,
        children: [
            {   path: 'buy',
                component: OpenOrdersComponent,
                data: {
                    offerType: "Buy",
                    title: 'Buy Orders'
                }
            },
            {   path: 'sell',
                component: OpenOrdersComponent,
                data: {
                    offerType: "Sell",
                    title: 'Sell Orders'
                },
            }
        ]
    },
    {
        path: 'open-orders/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'open-orders/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'open-orders/trade/:id',
        component: TradeDeskComponent,
    },
    {
        path: 'open-orders/cancel-order',
        component: CancelOrderComponent,
    },
    {
        path: 'my-trades',
        component: MyTradesComponent,
    },
    {
        path: 'my-trades/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'my-trades/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-trades/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-transfers',
        component: MyTransfersComponent,
    },
    {
        path: 'my-transfers/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'my-transfers/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-transfers/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'last-trades',
        component: LastTradesComponent,
    },
    {
        path: 'last-trades/asset-details',
        component: AssetDetailsComponent,
    },
    {
        path: 'last-trades/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'last-trades/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'issue-asset',
        component: IssueAssetComponent,
    },
    {
        path: 'search-assets',
        component: SearchAssetsComponent
    },
    {
        path: 'search-assets/asset-details',
        component: AssetDetailsComponent
    },
    {
        path: 'search-assets/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'send-assets',
        component: SendAssetsComponent
    },
    {
        path: 'trade/:id',
        component: TradeDeskComponent,
    },
    {
        path: 'trade/:id/buy',
        component: TradeDeskBuyAssetComponent
    },
    {
        path: 'trade/:id/sell',
        component: TradeDeskSellAssetComponent
    },
    {
        path: 'trade/:id/asset-details',
        component: AssetDetailsComponent
    },
    {
        path: 'trade/:id/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'trade/:id/account-details',
        component: AccountDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AssetsRoutingModule {
}
