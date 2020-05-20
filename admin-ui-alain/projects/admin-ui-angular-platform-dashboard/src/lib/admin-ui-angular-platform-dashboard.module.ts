import { NgModule } from '@angular/core';

import { AdminUiAngularPlatformDashboardRoutingModule } from './admin-ui-angular-platform-dashboard-routing.module';
import { AdminUiAngularPlatformDashboardComponent } from './features/admin-ui-angular-platform-dashboard.component';
import { PlatformDashboardInfoComponent } from './features/platform-dashboard-info.component';
import { PlatformDashboardSettingComponent } from './features/platform-dashboard-setting.component';
import { SharedModule, ZGrafnaModule } from 'admin-ui-angular-common';
@NgModule({
  declarations: [
    AdminUiAngularPlatformDashboardComponent,
    PlatformDashboardInfoComponent,
    PlatformDashboardSettingComponent
  ],
  imports: [
    AdminUiAngularPlatformDashboardRoutingModule,
    SharedModule,
    ZGrafnaModule
  ],
  exports: [AdminUiAngularPlatformDashboardComponent]
})
export class AdminUiAngularPlatformDashboardModule { }
