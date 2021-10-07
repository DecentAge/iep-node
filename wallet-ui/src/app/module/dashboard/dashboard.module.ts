import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../../shared/directives/match-height.directive";
import { DashboardRoutingModule} from './dashboard-routing.module';

import {SharedModule} from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';

import { DashboardService } from './dashboard.service';
import { NodeService } from '../../services/node.service';
import { OptionService } from '../../services/option.service';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartsModule,
        NgbModule,
        MatchHeightModule,
        SharedModule,
        FormsModule,
        AmChartsModule
    ],
    exports: [],
    declarations: [
    ],
    providers: [
        DashboardService
    ],
})
export class DashboardModule { }
