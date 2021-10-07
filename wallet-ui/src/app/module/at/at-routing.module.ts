import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAtComponent } from './create-at/create-at.component';
import { ShowAtsComponent } from './show-ats/show-ats.component';
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { AccountDetailComponent } from "../../shared/search/account-detail/account-detail.component";
import { AtComponent } from './show-ats/at/at.component';
import { AtDetailsComponent } from './show-ats/at-details/at-details.component';
import { WorkbenchComponent } from "./workbench/workbench.component";
import { CompilerComponent } from './workbench/compiler/compiler.component';
import { DashboardComponent } from './workbench/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: 'create-at',
        component: CreateAtComponent
    },
    {
        path: 'show-ats',
        component: ShowAtsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path: 'my',
                component: AtComponent,
                data: {
                    atType: "MY",
                    title: 'My ATs'
                }
            },
            {
                path: 'all',
                component: AtComponent,
                data: {
                    atType: "ALL",
                    title: 'All ATs'
                },
            }
        ]
    },
    {
        path: 'show-ats/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-ats/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-ats/at-details',
        component: AtDetailsComponent,
    },
    {
        path: 'workbench',
        component: WorkbenchComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'compiler',
                component: CompilerComponent
            }
        ]
    },
    // {
    //     path: 'workbench/compiler',
    //     component: CompilerComponent,
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AtRoutingModule { }
