import { NgModule } from '@angular/core';
import { Routes , RouterModule} from '@angular/router';
import { TransactionTypesComponent } from './transaction-types/transaction-types.component';
import { ServiceFeesComponent } from './service-fees/service-fees.component';
import { GenerateSignatureComponent } from './generate-signature/generate-signature.component';
import { ValidateSignatureComponent } from './validate-signature/validate-signature.component';
import { ParseTransactionComponent } from './parse-transaction/parse-transaction.component';
import { BroadcastTransactionComponent } from './broadcast-transaction/broadcast-transaction.component';
import { CalculateHashComponent } from './calculate-hash/calculate-hash.component';
import { ChainStatisticsComponent } from './chain-statistics/chain-statistics.component';
import { UserGuideComponent } from './user-guide/user-guide.component';

const routes: Routes = [
    {
        path: 'transaction-types',
        component: TransactionTypesComponent,
        data: {
            title: 'Transaction Types'
        }
    },
    {
        path: 'service-fees',
        component: ServiceFeesComponent,
        data: {
            title: 'Service Fees'
        }
    },
    {
        path: 'generate-signature',
        component: GenerateSignatureComponent,
        data: {
            title: 'Generate Signature'
        }
    },
    {
        path: 'validate-signature',
        component: ValidateSignatureComponent,
        data: {
            title: 'Validate Signature'
        }
    },
    {
        path: 'parse-transaction',
        component: ParseTransactionComponent,
        data: {
            title: 'Parse Transaction'
        }
    },
    {
        path: 'broadcast-transaction',
        component: BroadcastTransactionComponent,
        data: {
            title: 'Broadcast Transaction'
        }
    },
    {
        path: 'calculate-hash',
        component: CalculateHashComponent,
        data: {
            title: 'Calculate Hash'
        }
    },
    {
        path: 'chain-statistics',
        component: ChainStatisticsComponent,
        data: {
            title: 'Chain Statistics'
        }
    },
    {
        path: 'user-guide',
        component: UserGuideComponent,
        data: {
            title: 'User Guide'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class ToolsPagesRoutingModule {
}
