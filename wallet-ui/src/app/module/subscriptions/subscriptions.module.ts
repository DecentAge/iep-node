import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MySubscriptionsComponent} from './my-subscriptions/my-subscriptions.component';
import {CreateSubscriptionComponent} from './create-subscription/create-subscription.component';
import {SubscriptionsRoutingModule} from './subscriptions-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {ArchwizardModule} from 'angular-archwizard';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SubscriptionService} from './subscription.service';
import {CancelSubscriptionsComponent} from './cancel-subscriptions/cancel-subscriptions.component';
import {AliasesService} from '../aliases/aliases.service';

@NgModule({
    imports: [
        CommonModule,
        SubscriptionsRoutingModule,
        SharedModule,
        NgxDatatableModule,
        ArchwizardModule,
        FormsModule
    ],
    declarations: [
        MySubscriptionsComponent,
        CreateSubscriptionComponent,
        CancelSubscriptionsComponent
    ],
    providers: [
        SubscriptionService,
        AliasesService
    ]
})
export class SubscriptionsModule {
}
