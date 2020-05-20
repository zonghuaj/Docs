import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenantListComponent } from './features/tenant-list.component';

const routes: Routes = [{
  path: '',
  component: TenantListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantManagementRoutingModule {}
