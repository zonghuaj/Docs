import { NgModule } from '@angular/core';

import { AdminUiAngularNoticeWayRoutingModule } from './admin-ui-angular-notice-way-routing.module';
import { AdminUiAngularNoticeWayComponent } from './features/admin-ui-angular-notice-way.component';
import { SharedModule } from 'admin-ui-angular-common';
@NgModule({
  declarations: [AdminUiAngularNoticeWayComponent],
  imports: [
    AdminUiAngularNoticeWayRoutingModule,
    SharedModule
  ],
  exports: [AdminUiAngularNoticeWayComponent]
})
export class AdminUiAngularNoticeWayModule { }
