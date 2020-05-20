import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ServiceTopoComponent} from "./features/service-topo.component";

const routes: Routes = [{
  path: '',
  component: ServiceTopoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularServiceTopoRoutingModule {}
