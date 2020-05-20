import { NgModule } from '@angular/core';

import { AdminUiAngularServiceTraceRoutingModule } from './admin-ui-angular-service-trace-routing.module';
import { AdminUiAngularServiceTraceComponent } from './features/admin-ui-angular-service-trace.component';
import { SharedModule } from 'admin-ui-angular-common';
import { TraceServiceSelectComponent } from './features/trace-service-select/trace-service-select.component';
import { TraceSpanDetailComponent } from './features/trace-span-detail/trace-span-detail.component';
import { TraceInstanceSelectComponent } from './features/trace-instance-select/trace-instance-select.component';
import { TraceListViewComponent } from './features/list-view/trace-list-view.component';
import { TraceTreeViewComponent } from './features/tree-view/trace-tree-view.component';

@NgModule({
  declarations: [
    AdminUiAngularServiceTraceComponent,
    TraceInstanceSelectComponent,
    TraceServiceSelectComponent,
    TraceSpanDetailComponent,
    TraceListViewComponent,
    TraceTreeViewComponent
  ],
  imports: [
    AdminUiAngularServiceTraceRoutingModule,
    SharedModule
  ],
  entryComponents: [TraceSpanDetailComponent],
  exports: [
    AdminUiAngularServiceTraceComponent,
    TraceSpanDetailComponent]
})
export class AdminUiAngularServiceTraceModule { }
