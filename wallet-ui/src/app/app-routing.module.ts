import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { FULL_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from './shared/auth/auth-guard.service';

const appRoutes: Routes = [
    { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES, canActivate: [AuthGuard] },
    { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: FULL_ROUTES, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { 'useHash': true, enableTracing: false })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
