import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwappsRoutingModule } from './swapps-routing.module';
import { WalletSettingsComponent } from './wallet-settings/swapps-settings.component';
import { OptionsComponent } from './options/options.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
@NgModule({
    imports: [
        CommonModule,
        SwappsRoutingModule,
        FormsModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [WalletSettingsComponent, OptionsComponent]
})
export class SwappsModule {
}
