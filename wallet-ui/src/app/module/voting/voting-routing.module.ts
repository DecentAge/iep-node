import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollsComponent } from './show-polls/polls/polls.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { PollDetailsComponent } from './show-polls/polls/poll-details/poll-details.component';
import { PollResultComponent } from './show-polls/polls/poll-result/poll-result.component';
import { PollVoteComponent } from './show-polls/polls/poll-vote/poll-vote.component';
import { PollVotersComponent } from './show-polls/polls/poll-voters/poll-voters.component';
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { ShowPollsComponent } from './show-polls/show-polls.component';

const routes: Routes = [
    {
        path: 'show-polls',
        component: ShowPollsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path: 'my',
                component: PollsComponent,
                data: {
                    pollType: "MY",
                    title: 'My Polls'
                }
            },
            {
                path: 'all',
                component: PollsComponent,
                data: {
                    pollType: "ALL",
                    title: 'All Polls'
                },
            }
        ]
    },
    {
        path: 'show-polls/details',
        component: PollDetailsComponent
    },
    {
        path: 'show-polls/result',
        component: PollResultComponent
    },
    {
        path: 'show-polls/vote',
        component: PollVoteComponent
    },
    {
        path: 'show-polls/voters',
        component: PollVotersComponent
    },
    {
        path: 'show-polls/voters/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'create-poll',
        component: CreatePollComponent,
        data: {
            title: 'Create Poll'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VotingRoutingModule { }
