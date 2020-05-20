import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./features/dashboard.component";
import {ProjectConsoleGuard} from "@app/routes/guards/project-console-guard";
import { LoginLoadingComponent } from './features/login-loading/login-loading/login-loading.component';

const routes: Routes = [{
  path: '', component: DashboardComponent, canActivate: [ProjectConsoleGuard]
},
{
  path: 'login-loading',
  component: LoginLoadingComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularServiceDashboardRoutingModule {
}
