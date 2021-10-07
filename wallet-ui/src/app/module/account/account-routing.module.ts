import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { SendComponent } from './send/send.component';
import { ReceiveTabComponent } from './receive/receive-tab.component';
import { HistoryComponent } from './history/history.component';
import { ControlComponent } from './control/control.component';
import { BalanceLeaseComponent } from './balance-lease/balance-lease.component';
import { SearchAccountComponent } from './search-account/search-account.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { LessorsComponent } from './lessors/lessors.component';
import { PropertiesComponent } from './properties/properties.component';
import { BlockGenerationComponent } from './block-generation/block-generation.component';
import { FundingMonitorComponent } from './funding-monitor/funding-monitor.component';
import { LedgerViewComponent } from './ledger-view/ledger-view.component';
import { CompletedTransactionsComponent } from './history/completed-transactions/completed-transactions.component';
import { PendingTransactionsComponent } from './history/pending-transactions/pending-transactions.component';
import { TransactionDetailComponent } from '../../shared/search/transaction-detail/transaction-detail.component';
import { AccountDetailComponent } from '../../shared/search/account-detail/account-detail.component';
import { SetPropertyComponent } from './properties/set-property/set-property.component';
import { DeletePropertyComponent } from './properties/set-property/delete-property/delete-property.component';
import { SendSimpleComponent } from './send/send-simple/send-simple.component';
import { SendDeferredComponent } from './send/send-deferred/send-deferred.component';
import { SendReferenceComponent } from './send/send-reference/send-reference.component';
import { SendSecretComponent } from './send/send-secret/send-secret.component';
import { BookmarkListOnlyComponent } from './send/bookmark-list-only/bookmark-list-only.component';
import { ControlApproveComponent } from './control/control-approve/control-approve.component';
import { ClaimComponent } from './receive/claim/claim.component';
import { ReceiveComponent } from './receive/receive/receive.component';
import { ControlFundingMonitorComponent } from './funding-monitor/control-funding-monitor/control-funding-monitor.component';
import { ActiveFundingMonitorComponent } from './funding-monitor/active-funding-monitor/active-funding-monitor.component';

const routes: Routes = [
    {
        path: 'detail',
        component: DetailsComponent,
        data: {
            title: 'Account Detail'
        }
    },
    {
        path: 'send',
        component: SendComponent,
        data: {
            title: 'Send'
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'simple'
            },
            {
                path: 'simple',
                component: SendSimpleComponent,
            },
            {
                path: 'deferred',
                component: SendDeferredComponent,
            },
            {
                path: 'reference',
                component: SendReferenceComponent,
            },
            {
                path: 'secret',
                component: SendSecretComponent,
            }
        ]
    },
    {
        path: 'receive-tab',
        component: ReceiveTabComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'receive'
            },
            {
                path: 'receive',
                component: ReceiveComponent,
            },
            {
                path: 'claim',
                component: ClaimComponent,
            }
        ]
    },
    {
        path: 'transactions',
        component: HistoryComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'completed'
            },
            {
                path: 'completed',
                component: CompletedTransactionsComponent,
                data: {
                    title: 'Completed Transactions'
                }
            },

            {
                path: 'pending',
                component: PendingTransactionsComponent,
                data: {
                    title: 'Pending Transactions'
                },
            }
        ]
    },
    {
        path: 'transactions/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'transactions/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'control',
        component: ControlComponent
    },
    {
        path: 'control/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'control/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'control/control-approve',
        component: ControlApproveComponent,
    },
    {
        path: 'balance-lease',
        component: BalanceLeaseComponent
    },
    {
        path: 'search-account',
        component: SearchAccountComponent
    },
    {
        path: 'search-account/account-details',
        component: AccountDetailComponent
    },
    {
        path: 'bookmark',
        component: BookmarkComponent
    },
    {
        path: 'lessors',
        component: LessorsComponent
    },
    {
        path: 'properties',
        component: PropertiesComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'set-property'
            },
            {
                path: 'set-property',
                component: SetPropertyComponent,
                data: {
                    propertyType: 'SET',
                    title: 'Set Account Property'
                }
            },
            {
                path: 'my-properties',
                component: SetPropertyComponent,
                data: {
                    propertyType: 'MY',
                    title: 'My Account Properties'
                }
            },
            {
                path: 'external-properties',
                component: SetPropertyComponent,
                data: {
                    propertyType: 'ALL',
                    title: 'External Account Properties'
                },
            }
        ]
    },
    {
        path: 'properties/delete-property',
        component: DeletePropertyComponent,
    },
    {
        path: 'properties/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'block-generation',
        component: BlockGenerationComponent
    },
    {
        path: 'funding-monitor',
        component: FundingMonitorComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'control-funding'
            },
            {
                path: 'control-funding',
                component: ControlFundingMonitorComponent
            },
            {
                path: 'active-monitors',
                component: ActiveFundingMonitorComponent
            }
        ]
    },
    {
        path: 'ledger-view',
        component: LedgerViewComponent
    },
    {
        path: 'ledger-view/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'send/bookmark-list-only',
        component: BookmarkListOnlyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule { }