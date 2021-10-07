import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { HorizontalLayoutComponent } from "./layouts/horizontal/horizontal-layout.component";

import * as $ from 'jquery';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import { LoginService } from './services/login.service';
import { CryptoService } from './services/crypto.service';
import { CryptoWrapperService } from './services/crypto-wrapper.service';
import { SessionStorageService } from './services/session-storage.service';
import { SwappService } from './services/swapp.service';
import { MomentModule } from 'ngx-moment';

import { MatchHeightModule } from "./shared/directives/match-height.directive";
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { BroadcastService } from './services/broadcast.service';
import { LocalhostService } from './services/localhost.service';
import { NodeService } from './services/node.service';
import { OptionService } from './services/option.service';
import { PeerService } from './services/peer.service';

import { CommonService } from './services/common.service';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { TransactionService } from './services/transaction.service';
import { HttpProviderService } from './services/http-provider.service';
import { OptionsConfigurationService } from './services/options-configuration.service';
import { AccountService } from './module/account/account.service';
import { VotingService } from './module/voting/voting.service';
import { DashboardService } from './module/dashboard/dashboard.service';
import { FeeService } from "./services/fee.service";
import { QRCodeModule } from "angularx-qrcode";
import { AmountTqtPipe } from './pipes/amount-tqt.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { TransactionTextSubTypePipe } from './pipes/transaction-text-sub-type.pipe';
import { TransactionIconSubTypePipe } from './pipes/transaction-icon-sub-type.pipe';
import { ExtensionsService } from './module/extensions/extensions.service';
import {APP_BASE_HREF} from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        HorizontalLayoutComponent,
        ContentLayoutComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        SharedModule,
        HttpClientModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        MatchHeightModule,
        FormsModule,
        QRCodeModule,
        NgxDatatableModule,
        MomentModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AuthService,
        AuthGuard,
        LoginService,
        CryptoService,
        CryptoWrapperService,
        SessionStorageService,
        SwappService,
        BroadcastService,
        LocalhostService,
        NodeService,
        OptionService,
        PeerService,
        CommonService,
        TransactionService,
        HttpProviderService,
        OptionsConfigurationService,
        AccountService,
        DashboardService,
        FeeService,
        VotingService,
        ExtensionsService,
        AmountTqtPipe,
        TimestampPipe,
        TransactionTypePipe,
        TransactionTextSubTypePipe,
        TransactionIconSubTypePipe,
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
        {provide: APP_BASE_HREF, useValue: window['envConfig']['APP_BASE_HREF']}
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
