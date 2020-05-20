import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularPlatformDashboardComponent } from './features/admin-ui-angular-platform-dashboard.component';
import { PlatformDashboardInfoComponent } from './features/platform-dashboard-info.component';
import { PlatformDashboardSettingComponent } from './features/platform-dashboard-setting.component';

const routes: Routes = [
  {
    path: '',
    component: AdminUiAngularPlatformDashboardComponent,
    children: [
      { path: '', component: PlatformDashboardInfoComponent },
      { path: 'settings', component: PlatformDashboardSettingComponent },
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularPlatformDashboardRoutingModule { }
