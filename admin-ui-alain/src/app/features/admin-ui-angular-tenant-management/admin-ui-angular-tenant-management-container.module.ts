import { NgModule } from '@angular/core';
import { AdminUiAngularTenantManagementContainerComponent } from './admin-ui-angular-tenant-management-container.component';
import { TenantManagementModule } from 'admin-ui-angular-tenant-management';

@NgModule({
  declarations: [
    AdminUiAngularTenantManagementContainerComponent
  ],
  imports: [
    TenantManagementModule
  ]
})
export class AdminUiAngularTenantManagementContainerModule { }
