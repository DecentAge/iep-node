import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollsComponent } from './show-polls/polls/polls.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { VotingRoutingModule } from './voting-routing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PollDetailsComponent } from './show-polls/polls/poll-details/poll-details.component';
import { PollResultComponent } from './show-polls/polls/poll-result/poll-result.component';
import { PollVoteComponent } from './show-polls/polls/poll-vote/poll-vote.component';
import { PollVotersComponent } from './show-polls/polls/poll-voters/poll-voters.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from "../../shared/shared.module";
import { CurrenciesModule } from "../currencies/currencies.module";
import { AssetsModule } from "../assets/assets.module";
import { ShowPollsComponent } from './show-polls/show-polls.component';

@NgModule({
    imports: [
        CommonModule,
        VotingRoutingModule,
        ArchwizardModule,
        FormsModule,
        NgxChartsModule,
        NgbModule,
        NgxDatatableModule,
        SharedModule,
        CurrenciesModule,
        AssetsModule
    ],
    declarations: [
        PollsComponent,
        CreatePollComponent,
        PollDetailsComponent,
        PollResultComponent,
        PollVoteComponent,
        PollVotersComponent,
        ShowPollsComponent
    ]
})
export class VotingModule {
}
