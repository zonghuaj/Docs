import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularNoticeWayComponent } from './features/admin-ui-angular-notice-way.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularNoticeWayComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularNoticeWayRoutingModule {}