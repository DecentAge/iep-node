import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from '../module/dashboard/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { IsExpertViewDirective } from '../custom-directive/is-expert-view.directive';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { IsAppEnabledDirective } from '../custom-directive/is-app-enabled.directive';
import { AmountTqtPipe } from '../pipes/amount-tqt.pipe';
import { AmountTknPipe } from '../pipes/amount-tkn.pipe';
import { NumericalStringPipe } from '../pipes/numerical-string.pipe';
import { NotSetPipe } from '../pipes/not-set.pipe';
import { NoOutboundPipe } from '../pipes/no-outbound.pipe';
import { ControlModelPipe } from '../pipes/control-model.pipe';
import { FiatComponent } from './fiat/fiat.component';
import { QuantToAmountPipe } from '../pipes/quant-to-amount.pipe';
import { FiatService } from '../services/fiat.service';
import { TxIsValidPipe } from '../pipes/tx-is-valid.pipe';
import { AmountToQuantPipe } from '../pipes/amount-to-quant.pipe';
import { IsEnabledPipe } from '../pipes/is-enabled.pipe';
import { IsSyncPipe } from '../pipes/is-sync.pipe';
import { BookmarkListComponent } from './bookmark-list/bookmark-list.component';
import { TransactionConfPipe } from '../pipes/transaction-conf.pipe';
import { HasMessagePipe } from '../pipes/has-message.pipe';
import { QuantityToSharePipe } from '../pipes/quantity-to-share.pipe';
import { TimestampPipe } from '../pipes/timestamp.pipe';
import { NumberStringPipe } from '../pipes/number-string.pipe';
import { IsMessagePipe } from '../pipes/is-message.pipe';
import { HasMessageDirectionPipe } from '../pipes/has-message-direction.pipe';
import { TransactionIconSubTypePipe } from '../pipes/transaction-icon-sub-type.pipe';
import { TransactionTextSubTypePipe } from '../pipes/transaction-text-sub-type.pipe';
import { VotingModelLabelPipe } from '../pipes/voting-model-label.pipe';
import { VotingModelPipe } from '../pipes/voting-model.pipe';
import { PollDaysPipe } from '../pipes/poll-days.pipe';
import { MomentModule } from 'ngx-moment';
import { TransactionTypePipe } from '../pipes/transaction-type.pipe';
import { AccountDetailComponent } from './search/account-detail/account-detail.component';
import { TransactionDetailComponent } from './search/transaction-detail/transaction-detail.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SearchService } from './search/search.service';
import { TxDirectionPipe } from '../pipes/tx-direction.pipe';
import { SupplyPipe } from '../pipes/supply.pipe';
import { PollProgressPipe } from '../pipes/poll-progress.pipe';
import { ProgressComponent } from './progress/progress.component';
import { EscrowRolePipe } from '../pipes/escrow-role.pipe';
import { MinValueDirective } from '../custom-directive/min-value.directive';
import { MaxValueDirective } from '../custom-directive/max-value.directive';
import { ShufflingStagePipe } from '../pipes/shuffling-stage.pipe';
import { HoldingTypePipe } from '../pipes/holding-type.pipe';
import { BtcDetailComponent } from './search/btc-detail/btc-detail.component';
import { BlockrService } from './search/blockr.service';
import { EscrowService } from '../module/escrow/escrow.service';
import { SubscriptionService } from '../module/subscriptions/subscription.service';
import { IsExtensionEnabledDirective } from '../custom-directive/is-extension-enabled.directive';
import { AutoRefreshDirective } from '../custom-directive/auto-refresh.directive';
import { PriceTqtPipe } from '../pipes/price-tqt.pipe';
import { QuantityQntPipe } from '../pipes/quantity-qnt.pipe';
import { BuySellPipe } from '../pipes/buy-sell.pipe';
import { AmountToDecimalPipe } from '../pipes/amount-to-decimal.pipe';
import { ShareToQuantityPipe } from '../pipes/share-to-quantity.pipe';
import { UnitsToQuantityPipe } from '../pipes/units-to-quantity.pipe';
import { RateTqtToPricePipe } from '../pipes/rate-tqt-to-price.pipe';
import { RateTqtToSumPipe } from '../pipes/rate-tqt-to-sum.pipe';
import { BlockTransactionDetailsComponent } from './search/block-transaction-details/block-transaction-details.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NodeDetailsComponent } from './search/node-details/node-details.component';
import { GatewaysPipe } from "../pipes/gateways.pipe";
import { ProxiesPipe } from "../pipes/proxies.pipe";
import { StoragePipe } from "../pipes/storage.pipe";
import { PriceTqtToSumPipe } from '../pipes/price-tqt-to-sum.pipe';
import { CurrencyModelPipe } from '../pipes/currency-model.pipe';
import { PricePerShareSellOrderPipe } from '../pipes/price-per-share-sell-order.pipe';
import { PricePerShareBuyOrderPipe } from '../pipes/price-per-share-buy-order.pipe';
import { LessorsPercentagePipe } from '../pipes/lessors-percentage.pipe';
import { LessorsDaysLeftPipe } from '../pipes/lessors-days-left.pipe';
import { LedgerHoldingPipe } from '../pipes/ledger-holding.pipe';
import { LedgerTxTypesPipe } from '../pipes/ledger-tx-types.pipe';
import { CharactersPipe } from '../pipes/characters.pipe';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AddressService } from '../module/account/address.service';

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        NgbModule,
        TranslateModule,
        DashboardComponent,
        IsExpertViewDirective,
        IsAppEnabledDirective,
        AmountTqtPipe,
        AmountTknPipe,
        NumericalStringPipe,
        NotSetPipe,
        NoOutboundPipe,
        ControlModelPipe,
        QuantToAmountPipe,
        FiatComponent,
        TxIsValidPipe,
        IsEnabledPipe,
        IsSyncPipe,
        TimestampPipe,
        QuantityToSharePipe,
        NumberStringPipe,
        TransactionConfPipe,
        IsMessagePipe,
        HasMessagePipe,
        HasMessageDirectionPipe,
        TransactionIconSubTypePipe,
        TransactionTextSubTypePipe,
        VotingModelLabelPipe,
        VotingModelPipe,
        PollDaysPipe,
        BookmarkListComponent,
        TransactionTypePipe,
        QRCodeModule,
        TxDirectionPipe,
        SupplyPipe,
        PriceTqtPipe,
        QuantityQntPipe,
        BuySellPipe,
        AmountToDecimalPipe,
        PollProgressPipe,
        ProgressComponent,
        EscrowRolePipe,
        MinValueDirective,
        MaxValueDirective,
        ShufflingStagePipe,
        HoldingTypePipe,
        IsExtensionEnabledDirective,
        AutoRefreshDirective,
        ShareToQuantityPipe,
        UnitsToQuantityPipe,
        RateTqtToPricePipe,
        RateTqtToSumPipe,
        PriceTqtToSumPipe,
        PricePerShareSellOrderPipe,
        PricePerShareBuyOrderPipe,
        LessorsPercentagePipe,
        LessorsDaysLeftPipe,
        LedgerHoldingPipe,
        LedgerTxTypesPipe,
        CharactersPipe,
        GatewaysPipe,
        ProxiesPipe,
        StoragePipe,
        CurrencyModelPipe,
        BreadcrumbComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgxChartsModule,
        NgbModule,
        NgxDatatableModule,
        TranslateModule,
        FormsModule,
        UiSwitchModule,
        ChartsModule,
        MomentModule,
        QRCodeModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        DashboardComponent,
        IsExpertViewDirective,
        IsAppEnabledDirective,
        AmountTqtPipe,
        AmountTknPipe,
        NumericalStringPipe,
        NotSetPipe,
        NoOutboundPipe,
        ControlModelPipe,
        QuantToAmountPipe,
        FiatComponent,
        TxIsValidPipe,
        IsEnabledPipe,
        IsSyncPipe,
        TimestampPipe,
        QuantityToSharePipe,
        NumberStringPipe,
        TransactionConfPipe,
        IsMessagePipe,
        HasMessagePipe,
        HasMessageDirectionPipe,
        TransactionIconSubTypePipe,
        TransactionTextSubTypePipe,
        VotingModelLabelPipe,
        VotingModelPipe,
        PollDaysPipe,
        BookmarkListComponent,
        TransactionTypePipe,
        AccountDetailComponent,
        TransactionDetailComponent,
        TxDirectionPipe,
        SupplyPipe,
        PriceTqtPipe,
        QuantityQntPipe,
        AmountToDecimalPipe,
        BuySellPipe,
        PollProgressPipe,
        ProgressComponent,
        EscrowRolePipe,
        MinValueDirective,
        MaxValueDirective,
        ShufflingStagePipe,
        HoldingTypePipe,
        BtcDetailComponent,
        IsExtensionEnabledDirective,
        AutoRefreshDirective,
        ShareToQuantityPipe,
        UnitsToQuantityPipe,
        RateTqtToPricePipe,
        RateTqtToSumPipe,
        PriceTqtToSumPipe,
        PricePerShareSellOrderPipe,
        PricePerShareBuyOrderPipe,
        LessorsPercentagePipe,
        LessorsDaysLeftPipe,
        LedgerHoldingPipe,
        LedgerTxTypesPipe,
        CharactersPipe,
        BlockTransactionDetailsComponent,
        NodeDetailsComponent,
        GatewaysPipe,
        ProxiesPipe,
        StoragePipe,
        CurrencyModelPipe,
        BreadcrumbComponent,
        AmountToQuantPipe
    ],
    providers: [
        QuantToAmountPipe,
        FiatService,
        AmountToQuantPipe,
        TimestampPipe,
        SearchService,
        BlockrService,
        EscrowService,
        SubscriptionService,
        AddressService
    ]
})
export class SharedModule {
}
