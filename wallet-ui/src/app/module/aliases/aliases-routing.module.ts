import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowAliasComponent} from './show-alias/show-alias.component';
import {MySellOffersComponent} from './my-sell-offers/my-sell-offers.component';
import {BuyOffersComponent} from './buy-offers/buy-offers.component';
import {CreateAliasComponent} from './create-alias/create-alias.component';
import {TransactionDetailComponent} from '../../shared/search/transaction-detail/transaction-detail.component';
import {TransferAliasComponent} from './show-alias/transfer-alias/transfer-alias.component';
import {EditAliasComponent} from './show-alias/edit-alias/edit-alias.component';
import {DeleteAliasComponent} from './show-alias/delete-alias/delete-alias.component';
import {SellAliasComponent} from './show-alias/sell-alias/sell-alias.component';
import {CancelAliasSellComponent} from './my-sell-offers/cancel-alias-sell/cancel-alias-sell.component';
import {OffersComponent} from './buy-offers/offers/offers.component';
import {AccountDetailComponent} from '../../shared/search/account-detail/account-detail.component';
import {BuyAliasComponent} from './buy-offers/offers/buy-alias/buy-alias.component';
import {BtcDetailComponent} from '../../shared/search/btc-detail/btc-detail.component';

const routes: Routes = [
    {
        path: 'show-alias',
        component: ShowAliasComponent,
        data: {
            title: 'Alias'
        }
    },
    {
        path: 'my-sell-offers',
        component: MySellOffersComponent,
        data: {
            title: 'Alias'
        }
    },
    {
        path: 'buy-offers',
        component: BuyOffersComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'private'
            },
            {
                path: 'private',
                component: OffersComponent,
                data: {
                    offerType: 'PRIVATE',
                    title: 'Private Buy Offers'
                }
            },
            {
                path: 'public',
                component: OffersComponent,
                data: {
                    offerType: 'PUBLIC',
                    title: 'Private Buy Offers'
                },
            }
        ]
    },
    {
        path: 'create-alias',
        component: CreateAliasComponent,
        data: {
            title: 'Alias'
        }
    },
    {
        path: 'show-alias/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-alias/btc-details',
        component: BtcDetailComponent
    },
    {
        path: 'show-alias/transfer-alias',
        component: TransferAliasComponent
    },
    {
        path: 'show-alias/edit-alias',
        component: EditAliasComponent
    },
    {
        path: 'show-alias/delete-alias',
        component: DeleteAliasComponent
    },
    {
        path: 'show-alias/sell-alias',
        component: SellAliasComponent
    },
    {
        path: 'my-sell-offers/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-sell-offers/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-sell-offers/cancel-alias-sell',
        component: CancelAliasSellComponent
    },
    {
        path: 'buy-offers/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'buy-offers/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'buy-offers/buy-alias',
        component: BuyAliasComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AliasesRoutingModule {
}
