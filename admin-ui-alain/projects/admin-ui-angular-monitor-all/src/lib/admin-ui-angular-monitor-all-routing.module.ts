import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularMonitorAllComponent } from './features/admin-ui-angular-monitor-all.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularMonitorAllComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularMonitorAllRoutingModule {}