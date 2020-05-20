import { NgModule } from '@angular/core';

import { AdminUiAngularServiceManagementRoutingModule } from './admin-ui-angular-service-management-routing.module';
import { SharedModule } from 'admin-ui-angular-common';
import {RollBackModalComponent} from "./features/service-list/roll-back/roll-back-modal.component";
import {ErrorModalComponent} from "./features/version-list/error-modal.component";
import {ServiceListComponent} from "./features/service-list/service-list.component";
import {VersionListComponent} from "./features/version-list/version-list.component";
import {ServiceCreateComponent} from "./features/service-create/service-create.component";
import {ServiceEditComponent} from "./features/service-edit/service-edit.component";
import {VersionFormComponent} from "./features/service-edit/version-form.component";
import {VersionCreateComponent} from "./features/service-create/version-create.component";
import {ServiceFormComponent} from "./features/service-edit/service-form.component";
import {VersionEditComponent} from "./features/service-edit/version-edit.component";
import {ServiceDetailContainerComponent} from "./features/service-detail/service-detail-container.component";
import {ServiceConsoleComponent} from "./features/service-detail/console/service-console.component";
import {LogConsoleComponent} from "./features/service-detail/log/log-console/log-console.component";
import {ServiceInfoComponent} from "./features/service-detail/info/service-info.component";
import {ServiceLogComponent} from "./features/service-detail/log/service-log.component";
import {ServiceMonitorComponent} from "./features/service-detail/monitor/service-monitor.component";
import {VersionTableComponent} from "./features/service-edit/version-table.component";
import {AdminUiAngularServiceAutoscalerModule} from "admin-ui-angular-service-autoscaler";
import {AdminUiAngularArtifactoryModule} from "admin-ui-angular-artifactory";
import {AdminUiAngularPipelineManagementModule} from "admin-ui-angular-pipeline-management";
import {AdminUiAngularProjectManagementModule} from "admin-ui-angular-project-management";
import {AdminUiAngularConfigCenterModule} from "admin-ui-angular-config-center";
import {AdminUiAngularPlatformOsModule} from "../../../admin-ui-angular-platform-os/src/lib/admin-ui-angular-platform-os.module";

const COMPONENTS = [
  RollBackModalComponent,

  ServiceListComponent,
  VersionListComponent,
  ServiceCreateComponent,
  ServiceEditComponent,
  VersionCreateComponent,
  VersionEditComponent,
  ServiceFormComponent,
  VersionFormComponent,

  // details
  ServiceDetailContainerComponent,
  ServiceConsoleComponent,
  LogConsoleComponent,
  ServiceInfoComponent,
  ServiceLogComponent,
  ServiceMonitorComponent,
];

const COMPONENTS_ENTRY = [
  ErrorModalComponent,
  RollBackModalComponent,
  VersionTableComponent,
];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_ENTRY],
  imports: [
    AdminUiAngularServiceManagementRoutingModule,
    AdminUiAngularServiceAutoscalerModule,
    AdminUiAngularArtifactoryModule,
    AdminUiAngularPipelineManagementModule,
    AdminUiAngularProjectManagementModule,
    AdminUiAngularConfigCenterModule,
    AdminUiAngularPlatformOsModule,
    SharedModule
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: []
})
export class AdminUiAngularServiceManagementModule { }
