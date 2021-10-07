import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowShufflingsComponent } from './show-shufflings/show-shufflings.component';
import { CreateShufflingComponent } from './create-shuffling/create-shuffling.component';
import { ShufflingRoutingModule } from './shuffling-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule } from '@angular/forms';
import { ShufflingsComponent } from './show-shufflings/shufflings/shufflings.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ShufflingService } from './shuffling.service';
import { ShufflingDetailsComponent } from './show-shufflings/shuffling-details/shuffling-details.component';
import { ShufflingParticipantsComponent } from './show-shufflings/shuffling-participants/shuffling-participants.component';
import { StartShufflingComponent } from './show-shufflings/start-shuffling/start-shuffling.component';
import { StopShufflingComponent } from './show-shufflings/stop-shuffling/stop-shuffling.component';
import { JoinShufflingComponent } from './show-shufflings/join-shuffling/join-shuffling.component';
import { CurrenciesService } from '../currencies/currencies.service';
import { AssetsService } from '../assets/assets.service';
import { AmountToQuantPipe } from "../../pipes/amount-to-quant.pipe";
import { ShareToQuantityPipe } from "../../pipes/share-to-quantity.pipe";
@NgModule({
    imports: [
        CommonModule,
        ShufflingRoutingModule,
        SharedModule,
        ArchwizardModule,
        FormsModule,
        NgxDatatableModule
    ],
    declarations: [
        ShowShufflingsComponent,
        CreateShufflingComponent,
        ShufflingsComponent,
        ShufflingDetailsComponent,
        ShufflingParticipantsComponent,
        StartShufflingComponent,
        StopShufflingComponent,
        JoinShufflingComponent
    ],
    providers: [
        ShufflingService,
        CurrenciesService,
        AssetsService,
        AmountToQuantPipe,
        ShareToQuantityPipe
    ]
})
export class ShufflingModule { }
