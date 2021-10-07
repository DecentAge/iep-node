import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageRoutingModule } from './message-routing.module';
import { MessageService } from "./message.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared/shared.module";
import { ReadMessageComponent } from './read-message/read-message.component';
import { FormsModule } from "@angular/forms";
import { ArchwizardModule } from "angular-archwizard";
import { AliasesService } from '../aliases/aliases.service';
import { AccountService } from '../account/account.service';

@NgModule({
    imports: [
        CommonModule,
        MessageRoutingModule,
        NgxDatatableModule,
        SharedModule,
        FormsModule,
        ArchwizardModule
    ],
    declarations: [
        MessagesComponent,
        SendMessageComponent,
        ReadMessageComponent
    ],
    providers: [
        MessageService,
        AliasesService
    ]
})
export class MessageModule { }
