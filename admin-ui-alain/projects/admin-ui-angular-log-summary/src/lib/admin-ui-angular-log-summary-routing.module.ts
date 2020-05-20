import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularLogSummaryComponent } from './features/admin-ui-angular-log-summary.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularLogSummaryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularLogSummaryRoutingModule { }
