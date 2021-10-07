import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessagesComponent} from './messages/messages.component';
import {SendMessageComponent} from './send-message/send-message.component';
import {ReadMessageComponent} from "./read-message/read-message.component";
import {AccountDetailComponent} from "../../shared/search/account-detail/account-detail.component";
import {TransactionDetailComponent} from "../../shared/search/transaction-detail/transaction-detail.component";

const routes: Routes = [
    {
        path: 'show-messages',
        component: MessagesComponent,
    },
    {
        path: 'show-messages/read-message-details',
        component: ReadMessageComponent,
    },
    {
        path: 'show-messages/account-details',
        component: AccountDetailComponent,
    },
    {
        path: 'show-messages/transaction-details',
        component: TransactionDetailComponent
    },
    {
        path: 'send-message',
        component: SendMessageComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MessageRoutingModule { }
