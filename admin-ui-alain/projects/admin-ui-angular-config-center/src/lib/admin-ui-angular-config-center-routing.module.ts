import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularConfigCenterComponent } from './features/admin-ui-angular-config-center.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularConfigCenterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularConfigCenterRoutingModule {}