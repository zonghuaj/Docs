import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularServiceTraceComponent } from './features/admin-ui-angular-service-trace.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularServiceTraceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularServiceTraceRoutingModule {}