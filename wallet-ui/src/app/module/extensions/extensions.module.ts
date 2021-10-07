import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ExtensionsRoutingModule } from './extensions-routing.module';
import { OverviewComponent } from "./overview/overview.component";
import { MacapComponent } from './macap/macap.component';
import { UpDownPipe } from '../../pipes/up-down.pipe';
import { NewsPriorityPipe } from '../../pipes/news-priority.pipe';
import { NewsSectionPipe } from '../../pipes/news-section.pipe';
import { NewsCenterComponent } from './news-center/news-center.component';
import { ServiceMonitorComponent } from './service-monitor/service-monitor.component';
import { ChainViewerComponent } from './chain-viewer/chain-viewer.component';
import { BlocksComponent } from './chain-viewer/blocks/blocks.component';
import { TransactionsComponent } from './chain-viewer/transactions/transactions.component';
import { UnconfirmedComponent } from './chain-viewer/unconfirmed/unconfirmed.component';
import { PeersComponent } from './chain-viewer/peers/peers.component';
import { ReadNewsComponent } from './news-center/read-news/read-news.component';
import { NewsCenterService } from "./news-center/news-center.service";
import { BlockTransactionsPipe } from "../../pipes/block-transactions.pipe";
import { SearchTermPipe } from "../../pipes/search-term.pipe";
import { ChartsModule  } from "ng2-charts";
import { AllComponent } from './overview/all/all.component';
import { OnlineComponent } from './overview/online/online.component';
import { DevelopmentComponent } from './overview/development/development.component';
import { ConceptComponent } from './overview/concept/concept.component';
import { PocComponent } from './overview/poc/poc.component';

@NgModule({
    imports: [
        CommonModule,
        ExtensionsRoutingModule,
        SharedModule,
        FormsModule,
        HttpClientModule,
        NgxDatatableModule,
        ChartsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        OverviewComponent,
        MacapComponent,
        UpDownPipe,
        NewsCenterComponent,
        ServiceMonitorComponent,
        ChainViewerComponent,
        BlocksComponent,
        TransactionsComponent,
        UnconfirmedComponent,
        PeersComponent,
        NewsPriorityPipe,
        NewsSectionPipe,
        ReadNewsComponent,
        BlockTransactionsPipe,
        SearchTermPipe,
        AllComponent,
        OnlineComponent,
        DevelopmentComponent,
        ConceptComponent,
        PocComponent
    ],
    providers: [
        NewsCenterService
    ]
})
export class ExtensionsModule {}
