import {NgModule} from '@angular/core';

import {AdminUiAngularServiceDashboardRoutingModule} from './admin-ui-angular-service-dashboard-routing.module';
import {DashboardComponent} from "./features/dashboard.component";
import {DashboardWWaveComponent} from "./features/zwwave.component";
import {G2WaterWaveComponent2} from "./features/water-wave/water-wave2.component";
import {DashboardZListComponent} from "./features/dashboard-zlist.component";
import {DashboardAlertListComponent} from "./features/dashboard-alert-list.component";
import {SharedModule, ZGrafnaModule} from "admin-ui-angular-common";
import { LoginLoadingComponent } from './features/login-loading/login-loading/login-loading.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardWWaveComponent,
    G2WaterWaveComponent2,
    DashboardZListComponent,
    DashboardAlertListComponent,
    LoginLoadingComponent
  ],
  imports: [
    SharedModule,
    ZGrafnaModule,
    AdminUiAngularServiceDashboardRoutingModule,
  ],
  exports: []
})
export class AdminUiAngularServiceDashboardModule {
}
