import { NgModule } from '@angular/core';

import { AdminUiAngularMonitorAllRoutingModule } from './admin-ui-angular-monitor-all-routing.module';
import { AdminUiAngularMonitorAllComponent } from './features/admin-ui-angular-monitor-all.component';
import { SharedModule, ZGrafnaModule, ProjectManageService} from 'admin-ui-angular-common';
import { ServiceMonitorOverviewComponent } from './features/service-monitor-overview.component';
import { ServiceMonitorInstanceComponent } from './features/service-monitor-instance.component';
import { VersionSelectComponent } from './features/version-select/version-select.component';
@NgModule({
  declarations: [
    AdminUiAngularMonitorAllComponent,
    ServiceMonitorOverviewComponent,
    ServiceMonitorInstanceComponent,
    VersionSelectComponent
  ],
  imports: [
    AdminUiAngularMonitorAllRoutingModule,
    SharedModule,
    ZGrafnaModule
  ],
  providers: [ProjectManageService],
  exports: [AdminUiAngularMonitorAllComponent]
})
export class AdminUiAngularMonitorAllModule { }
