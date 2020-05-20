import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularAlertAllComponent } from './features/admin-ui-angular-alert-all.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularAlertAllComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularAlertAllRoutingModule {}