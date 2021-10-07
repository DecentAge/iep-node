import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from "./overview/overview.component";
import { MacapComponent } from "./macap/macap.component";
import { NewsCenterComponent } from "./news-center/news-center.component";
import { ServiceMonitorComponent } from "./service-monitor/service-monitor.component";
import { ChainViewerComponent } from "./chain-viewer/chain-viewer.component";
import { BlocksComponent } from "./chain-viewer/blocks/blocks.component";
import { TransactionsComponent } from "./chain-viewer/transactions/transactions.component";
import { UnconfirmedComponent } from "./chain-viewer/unconfirmed/unconfirmed.component";
import { PeersComponent } from "./chain-viewer/peers/peers.component";
import { ReadNewsComponent } from "./news-center/read-news/read-news.component";
import { AccountDetailComponent } from "../../shared/search/account-detail/account-detail.component";
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { BlockTransactionDetailsComponent } from "../../shared/search/block-transaction-details/block-transaction-details.component";
import { NodeDetailsComponent } from "../../shared/search/node-details/node-details.component";
import { AllComponent } from "./overview/all/all.component";
import { OnlineComponent } from "./overview/online/online.component";
import { DevelopmentComponent } from "./overview/development/development.component";
import { ConceptComponent } from "./overview/concept/concept.component";
import { PocComponent } from "./overview/poc/poc.component";

const routes: Routes = [
    {
        path:'',
        component: OverviewComponent,
        children:[
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path:'all',
                component: AllComponent
            },
            {
                path:'online',
                component: OnlineComponent
            },
            {
                path:'development',
                component: DevelopmentComponent
            },
            {
                path:'concept',
                component: ConceptComponent
            },
            {
                path:'poc',
                component: PocComponent
            }
        ]
    },
    {
        path:'macap',
        component: MacapComponent,
    },
    {
        path:'newsviewer',
        component: NewsCenterComponent
    },
    {
        path: 'newsviewer/read-news',
        component: ReadNewsComponent
    },
    {
        path:'service-monitor',
        component: ServiceMonitorComponent,
    },
    {
        path:'chain-viewer',
        component: ChainViewerComponent,
        children:[
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'blocks'
            },
            {
                path:'blocks',
                component: BlocksComponent,
            },
            {
                path:'transactions',
                component: TransactionsComponent,
            },
            {
                path:'unconfirmed',
                component: UnconfirmedComponent,
            },
            {
                path:'peers',
                component: PeersComponent,
            },
        ]
    },
    {
        path:'chain-viewer/account-details',
        component: AccountDetailComponent,
    },
    {
        path:'chain-viewer/transaction-details',
        component: TransactionDetailComponent,
    },
    {
        path:'chain-viewer/block-transaction-details',
        component: BlockTransactionDetailsComponent,
    },
    {
        path:'chain-viewer/block-details',
        component: TransactionDetailComponent,
    },
    {
        path:'chain-viewer/node-details',
        component: NodeDetailsComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtensionsRoutingModule { }
