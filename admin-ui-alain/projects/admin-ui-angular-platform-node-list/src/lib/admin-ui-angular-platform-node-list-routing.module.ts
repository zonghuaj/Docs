import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {NodeListLayoutComponent} from "./features/list.component";

const routes: Routes = [{
  path: '',
  component: NodeListLayoutComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularPlatformNodeListRoutingModule {}
