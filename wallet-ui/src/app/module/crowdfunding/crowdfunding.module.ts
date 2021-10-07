import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowCampaignsComponent } from './show-campaigns/show-campaigns.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CrowdfundingRoutingModule } from './crowdfunding-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule } from '@angular/forms';
import { CampaignsComponent } from './show-campaigns/campaigns/campaigns.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CrowdfundingService } from './crowdfunding.service';
import { CurrenciesModule } from "../currencies/currencies.module";
import { ReserveFoundersComponent } from './show-campaigns/campaigns/reserve-founders/reserve-founders.component';
import { ReserveUnitsComponent } from './show-campaigns/campaigns/reserve-units/reserve-units.component';

@NgModule({
    imports: [
        CommonModule,
        CrowdfundingRoutingModule,
        SharedModule,
        ArchwizardModule,
        FormsModule,
        NgxDatatableModule,
        CurrenciesModule
    ],
    declarations: [
        ShowCampaignsComponent,
        CreateCampaignComponent,
        CampaignsComponent,
        ReserveFoundersComponent,
        ReserveUnitsComponent
    ],
    providers: [
        CrowdfundingService
    ]
})
export class CrowdfundingModule { }
