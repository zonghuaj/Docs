import { NgModule } from '@angular/core';

import { AdminUiAngularAlertAllRoutingModule } from './admin-ui-angular-alert-all-routing.module';
import { AdminUiAngularAlertAllComponent } from './features/admin-ui-angular-alert-all.component';
import { SharedModule } from 'admin-ui-angular-common';
import { AlertConfirmComponent } from './features/alert-confirm.component';
@NgModule({
  declarations: [
    AdminUiAngularAlertAllComponent,
    AlertConfirmComponent],
  imports: [
    AdminUiAngularAlertAllRoutingModule,
    SharedModule
  ],
  entryComponents: [AlertConfirmComponent],
  exports: [AdminUiAngularAlertAllComponent]
})
export class AdminUiAngularAlertAllModule { }
