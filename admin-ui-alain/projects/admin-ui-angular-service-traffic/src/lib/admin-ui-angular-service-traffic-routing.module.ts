import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUiAngularServiceTrafficComponent } from './features/admin-ui-angular-service-traffic.component';

const routes: Routes = [{
  path: '',
  component: AdminUiAngularServiceTrafficComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularServiceTrafficRoutingModule {}
