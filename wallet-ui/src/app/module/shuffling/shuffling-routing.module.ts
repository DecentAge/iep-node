import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowShufflingsComponent } from './show-shufflings/show-shufflings.component';
import { CreateShufflingComponent } from './create-shuffling/create-shuffling.component';
import { ShufflingsComponent } from './show-shufflings/shufflings/shufflings.component';
import { TransactionDetailComponent } from "../../shared/search/transaction-detail/transaction-detail.component";
import { AccountDetailComponent } from "../../shared/search/account-detail/account-detail.component";
import { ShufflingDetailsComponent } from './show-shufflings/shuffling-details/shuffling-details.component';
import { ShufflingParticipantsComponent } from './show-shufflings/shuffling-participants/shuffling-participants.component';
import { StartShufflingComponent } from './show-shufflings/start-shuffling/start-shuffling.component';
import { StopShufflingComponent } from './show-shufflings/stop-shuffling/stop-shuffling.component';
import { JoinShufflingComponent } from './show-shufflings/join-shuffling/join-shuffling.component';

const routes: Routes = [
    {
        path: 'create-shuffling',
        component: CreateShufflingComponent
    },
    {
        path: 'show-shufflings',
        component: ShowShufflingsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all'
            },
            {
                path: 'my',
                component: ShufflingsComponent,
                data: {
                    shufflingType: "MY",
                    title: 'My Shufflings'
                }
            },
            {
                path: 'all',
                component: ShufflingsComponent,
                data: {
                    shufflingType: "ALL",
                    title: 'All Shufflings'
                },
            }
        ]
    },
    {
        path: 'show-shufflings/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'show-shufflings/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-shufflings/shuffling-details',
        component: ShufflingDetailsComponent,
    },
    {
        path: 'show-shufflings/shuffling-participants',
        component: ShufflingParticipantsComponent,
    },
    {
        path: 'show-shufflings/shuffling-participants/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-shufflings/start-shuffling',
        component: StartShufflingComponent,
    },
    {
        path: 'show-shufflings/stop-shuffling',
        component: StopShufflingComponent,
    },
    {
        path: 'show-shufflings/join-shuffling',
        component: JoinShufflingComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShufflingRoutingModule { }
