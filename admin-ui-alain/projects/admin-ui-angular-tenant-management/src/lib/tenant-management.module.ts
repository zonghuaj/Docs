import { NgModule } from '@angular/core';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { TenantEditComponent } from './features/tenant-edit.component';
import { TenantListComponent } from './features/tenant-list.component';
import { SharedModule } from 'admin-ui-angular-common';

@NgModule({
  declarations: [
    TenantListComponent,
    TenantEditComponent
  ],
  imports: [
    TenantManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [TenantEditComponent],
  exports: [TenantListComponent]
})
export class TenantManagementModule { }
