import { NgModule } from '@angular/core';
import { Routes , RouterModule} from '@angular/router';
import { WalletSettingsComponent } from "./wallet-settings/swapps-settings.component";
import { OptionsComponent } from "./options/options.component";

const routes: Routes = [
    {
        path: 'swapps',
        component: WalletSettingsComponent,
        data: {
            title: 'Wallet Settings'
        }
    }, {
        path: 'options',
        component: OptionsComponent,
        data: {
            title: 'Options'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SwappsRoutingModule {
}
