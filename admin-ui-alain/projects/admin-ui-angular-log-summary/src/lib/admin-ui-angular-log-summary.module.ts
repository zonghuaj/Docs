import { NgModule } from '@angular/core';

import { AdminUiAngularLogSummaryRoutingModule } from './admin-ui-angular-log-summary-routing.module';
import { AdminUiAngularLogSummaryComponent } from './features/admin-ui-angular-log-summary.component';
import { SharedModule } from 'admin-ui-angular-common';
@NgModule({
  declarations: [AdminUiAngularLogSummaryComponent],
  imports: [
    AdminUiAngularLogSummaryRoutingModule,
    SharedModule
  ],
  exports: [AdminUiAngularLogSummaryComponent]
})
export class AdminUiAngularLogSummaryModule { }
