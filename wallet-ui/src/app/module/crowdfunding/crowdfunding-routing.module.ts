import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { ShowCampaignsComponent } from './show-campaigns/show-campaigns.component';
import { CampaignsComponent } from './show-campaigns/campaigns/campaigns.component';
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { CurrencyDetailsComponent } from '../currencies/currency-details/currency-details.component';
import { ReserveFoundersComponent } from './show-campaigns/campaigns/reserve-founders/reserve-founders.component';
import { ReserveUnitsComponent } from './show-campaigns/campaigns/reserve-units/reserve-units.component';
import { AccountDetailComponent } from "../../shared/search/account-detail/account-detail.component";

const routes: Routes = [
    {
        path: 'create-campaign',
        component: CreateCampaignComponent
    },
    {
        path: 'show-campaigns',
        component: ShowCampaignsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path: 'my',
                component: CampaignsComponent,
                data: {
                    campaignType: "MY",
                    title: 'My Campaigns'
                }
            },
            {
                path: 'all',
                component: CampaignsComponent,
                data: {
                    campaignType: "ALL",
                    title: 'All Campaigns'
                },
            }
        ]
    },
    {
        path: 'show-campaigns/currency-details',
        component: CurrencyDetailsComponent
    },
    {
        path: 'show-campaigns/reserve-founders',
        component: ReserveFoundersComponent
    },
    {
        path: 'show-campaigns/reserve-units',
        component: ReserveUnitsComponent
    },
    {
        path: 'show-campaigns/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-campaigns/account-details',
        component: AccountDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CrowdfundingRoutingModule { }
