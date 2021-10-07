import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../../shared/directives/match-height.directive";
import { AccountRoutingModule } from './account-routing.module';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { ReceiveTabComponent } from './receive/receive-tab.component';
import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';
import { ControlComponent } from './control/control.component';
import { BalanceLeaseComponent } from './balance-lease/balance-lease.component';
import { SearchAccountComponent } from './search-account/search-account.component';
import { ArchwizardModule } from 'angular-archwizard';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { LessorsComponent } from './lessors/lessors.component';
import { PropertiesComponent } from './properties/properties.component';
import { BlockGenerationComponent } from './block-generation/block-generation.component';
import { FundingMonitorComponent } from './funding-monitor/funding-monitor.component';
import { LedgerViewComponent } from './ledger-view/ledger-view.component';
import { AccountService } from './account.service';
import { AssetsService } from '../assets/assets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { QRCodeModule } from "angularx-qrcode";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CompletedTransactionsComponent } from './history/completed-transactions/completed-transactions.component';
import { PendingTransactionsComponent } from './history/pending-transactions/pending-transactions.component';
import { AliasesService } from '../aliases/aliases.service';
import { SetPropertyComponent } from './properties/set-property/set-property.component';
import { DeletePropertyComponent } from './properties/set-property/delete-property/delete-property.component';
import { SendSimpleComponent } from './send/send-simple/send-simple.component';
import { SendDeferredComponent } from './send/send-deferred/send-deferred.component';
import { SendReferenceComponent } from './send/send-reference/send-reference.component';
import { SendSecretComponent } from './send/send-secret/send-secret.component';
import { BookmarkListOnlyComponent } from './send/bookmark-list-only/bookmark-list-only.component';
import { ControlApproveComponent } from './control/control-approve/control-approve.component';
import { AddressService } from './address.service';
import { ClaimComponent } from './receive/claim/claim.component';
import { ReceiveComponent } from './receive/receive/receive.component';
import { ControlFundingMonitorComponent } from './funding-monitor/control-funding-monitor/control-funding-monitor.component';
import { ActiveFundingMonitorComponent } from './funding-monitor/active-funding-monitor/active-funding-monitor.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        AccountRoutingModule,
        NgxChartsModule,
        NgbModule,
        MatchHeightModule,
        SharedModule,
        FormsModule,
        ArchwizardModule,
        QRCodeModule,
        NgxDatatableModule,
        HttpClientModule
    ],
    exports: [],
    declarations: [
        DetailsComponent,
        ReceiveTabComponent,
        SendComponent,
        HistoryComponent,
        ControlComponent,
        BalanceLeaseComponent,
        SearchAccountComponent,
        BookmarkComponent,
        LessorsComponent,
        PropertiesComponent,
        BlockGenerationComponent,
        FundingMonitorComponent,
        LedgerViewComponent,
        CompletedTransactionsComponent,
        PendingTransactionsComponent,
        SetPropertyComponent,
        DeletePropertyComponent,
        SendSimpleComponent,
        SendDeferredComponent,
        SendReferenceComponent,
        SendSecretComponent,
        BookmarkListOnlyComponent,
        ControlApproveComponent,
        ClaimComponent,
        ReceiveComponent,
        ControlFundingMonitorComponent,
        ActiveFundingMonitorComponent
    ],
    providers: [
        AccountService,
        AssetsService,
        CurrenciesService,
        AliasesService,
        AddressService
    ],
})
export class AccountModule { }
