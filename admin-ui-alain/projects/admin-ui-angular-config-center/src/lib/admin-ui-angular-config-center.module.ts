import { NgModule } from '@angular/core';

import { AdminUiAngularConfigCenterRoutingModule } from './admin-ui-angular-config-center-routing.module';
import { AdminUiAngularConfigCenterComponent } from './features/admin-ui-angular-config-center.component';
import { SharedModule } from 'admin-ui-angular-common';
@NgModule({
  declarations: [AdminUiAngularConfigCenterComponent],
  imports: [
    AdminUiAngularConfigCenterRoutingModule,
    SharedModule
  ],
  exports: [AdminUiAngularConfigCenterComponent]
})
export class AdminUiAngularConfigCenterModule { }
