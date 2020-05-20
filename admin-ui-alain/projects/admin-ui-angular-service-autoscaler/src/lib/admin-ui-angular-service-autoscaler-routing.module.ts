import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularServiceAutoscalerComponent } from './features/admin-ui-angular-service-autoscaler.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularServiceAutoscalerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularServiceAutoscalerRoutingModule { }
