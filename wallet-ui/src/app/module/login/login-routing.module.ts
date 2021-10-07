import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
    {   
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'sign-up/step-1',
        component: SignupComponent
    },
    {
        path: 'sign-up/step-2',
        component: SignupComponent
    },
    {
        path: 'sign-up/step-3',
        component: SignupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})

export class LoginRoutingModule {
}
