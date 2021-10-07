import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAtComponent } from './create-at/create-at.component';
import { ShowAtsComponent } from './show-ats/show-ats.component';
import { AtRoutingModule } from './at-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ArchwizardModule } from 'angular-archwizard';
import { AtComponent } from './show-ats/at/at.component';
import { AtDetailsComponent } from './show-ats/at-details/at-details.component';
import { AtService } from './at.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { WorkbenchComponent } from "./workbench/workbench.component";
import { CompilerComponent } from './workbench/compiler/compiler.component';
import { DashboardComponent } from './workbench/dashboard/dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        AtRoutingModule,
        SharedModule,
        ArchwizardModule,
        NgxDatatableModule,
        FormsModule
    ],
    declarations: [
        CreateAtComponent,
        ShowAtsComponent,
        AtComponent,
        AtDetailsComponent,
        WorkbenchComponent,
        CompilerComponent,
        DashboardComponent
    ],
    providers: [
        AtService
    ]
})
export class AtModule {
}
