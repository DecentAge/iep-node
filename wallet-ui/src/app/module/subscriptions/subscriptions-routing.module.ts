import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MySubscriptionsComponent} from './my-subscriptions/my-subscriptions.component';
import {CreateSubscriptionComponent} from './create-subscription/create-subscription.component';
import {AccountDetailComponent} from '../../shared/search/account-detail/account-detail.component';
import {TransactionDetailComponent} from '../../shared/search/transaction-detail/transaction-detail.component';
import {CancelSubscriptionsComponent} from './cancel-subscriptions/cancel-subscriptions.component';

const routes: Routes = [
    {
        path: 'create-subscription',
        component: CreateSubscriptionComponent
    },
    {
        path: 'my-subscriptions',
        component: MySubscriptionsComponent
    },
    {
        path: 'my-subscriptions/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-subscriptions/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-subscriptions/cancel-subscription',
        component: CancelSubscriptionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubscriptionsRoutingModule {
}
