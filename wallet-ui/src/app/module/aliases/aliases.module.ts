import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowAliasComponent } from './show-alias/show-alias.component';
import { AliasesRoutingModule } from './aliases-routing.module';
import { MySellOffersComponent } from './my-sell-offers/my-sell-offers.component';
import { BuyOffersComponent } from './buy-offers/buy-offers.component';
import { CreateAliasComponent } from './create-alias/create-alias.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AliasesService } from './aliases.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TransferAliasComponent } from './show-alias/transfer-alias/transfer-alias.component';
import { EditAliasComponent } from './show-alias/edit-alias/edit-alias.component';
import { DeleteAliasComponent } from './show-alias/delete-alias/delete-alias.component';
import { SellAliasComponent } from './show-alias/sell-alias/sell-alias.component';
import { CancelAliasSellComponent } from './my-sell-offers/cancel-alias-sell/cancel-alias-sell.component';
import { OffersComponent } from './buy-offers/offers/offers.component';
import { BuyAliasComponent } from './buy-offers/offers/buy-alias/buy-alias.component';

@NgModule({
    imports: [
        CommonModule,
        AliasesRoutingModule,
        UiSwitchModule,
        NgxDatatableModule,
        ArchwizardModule,
        FormsModule,
        SharedModule
    ],
    declarations: [ShowAliasComponent, MySellOffersComponent, BuyOffersComponent, CreateAliasComponent, TransferAliasComponent, EditAliasComponent, DeleteAliasComponent, SellAliasComponent, CancelAliasSellComponent, OffersComponent, BuyAliasComponent],
    providers: [
        AliasesService
    ]
})
export class AliasesModule {
}
