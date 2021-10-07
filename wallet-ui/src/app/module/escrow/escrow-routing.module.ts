import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateEscrowComponent} from './create-escrow/create-escrow.component';
import {MyEscrowComponent} from './my-escrow/my-escrow.component';
import {EscrowStatusComponent} from './my-escrow/escrow-status/escrow-status.component';
import {TransactionDetailComponent} from '../../shared/search/transaction-detail/transaction-detail.component';
import {AccountDetailComponent} from '../../shared/search/account-detail/account-detail.component';
import {SignEscrowComponent} from './my-escrow/sign-escrow/sign-escrow.component';

const routes: Routes = [
    {
        path: 'create-escrow',
        component: CreateEscrowComponent
    },
    {
        path: 'my-escrow',
        component: MyEscrowComponent
    },
    {
        path: 'my-escrow/escrow-status',
        component: EscrowStatusComponent
    },
    {
        path: 'my-escrow/sign-escrow',
        component: SignEscrowComponent
    },
    {
        path: 'my-escrow/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'my-escrow/escrow-status/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'my-escrow/account-details',
        component: AccountDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EscrowRoutingModule {
}
