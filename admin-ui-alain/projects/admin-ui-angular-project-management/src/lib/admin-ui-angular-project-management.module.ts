import { NgModule } from '@angular/core';

import {SharedModule, ZGrafnaModule} from "admin-ui-angular-common";
import { AdminUiAngularProjectManagementRoutingModule } from './admin-ui-angular-project-management-routing.module';
import {ProjectListComponent} from "./features/project-list/project-list.component";
import {ProjectCreateComponent} from "./features/project-create/project-create.component";
import {ProjectInfoComponent} from "./features/project-detail/info/project-info.component";
import {ProjectMemberControlComponent} from "./features/project-detail/members/project-member-control.component";
import {ProjectMonitorComponent} from "./features/project-monitor/project-monitor.component";
import {ProjectDetailContainerComponent} from "./features/project-detail/project-detail-container.component";
import {ProjectMonitorPListComponent} from "./features/project-monitor/project-monitor-plist.component";
import {PlatformIntegrationDistributionComponent} from "./features/platform-integration-center/platform-integration-dist.component";
import {PlatformIntegrationTestComponent} from "./features/platform-integration-center/platform-integration-test.component";
import {PlatformIntegrationEditComponent} from "./features/platform-integration-center/platform-integration-edit.component";
import {ProjectMemberEditComponent} from "./features/project-detail/members/project-member-edit.component";
import {PlatformIntegrationListComponent} from "./features/platform-integration-center/platform-integration-list.component";
import {ProjectRoleListComponent} from "./features/project-roles/project-role-list.component";
import {PlatformIntegrationComponent} from "./features/platform-integration-center/platform-integration.component";
import {ProjectRoleEditComponent} from "./features/project-roles/project-role-edit.component";
import {ProjectRoleBindComponent} from "./features/project-roles/project-role-bind.component";
import {ProjectMonitorGraphComponent} from "./features/project-monitor/project-monitor-graph.component";
import {ProjectEditComponent} from "./features/project-edit/project-edit.component";
import {ProjectFormComponent} from "./features/project-create/project-form.component";
import {PlatformIntegrationItemComponent} from "./features/platform-integration-center/platform-integration-item.component";

const COMPONENTS = [
  ProjectListComponent,
  ProjectCreateComponent,
  ProjectFormComponent,
  ProjectEditComponent,
  ProjectDetailContainerComponent,
  ProjectInfoComponent,
  ProjectMemberControlComponent,
  ProjectMemberEditComponent,
  ProjectMonitorComponent,
  ProjectMonitorPListComponent,
  ProjectMonitorGraphComponent,
  ProjectRoleListComponent,
  ProjectRoleBindComponent,
  ProjectRoleEditComponent,

  PlatformIntegrationComponent,
  PlatformIntegrationItemComponent,
  PlatformIntegrationEditComponent,
  PlatformIntegrationListComponent,
  PlatformIntegrationTestComponent,
  PlatformIntegrationDistributionComponent
];

const COMPONENTS_ENTRY = [
  ProjectMemberEditComponent,
  PlatformIntegrationEditComponent,
  PlatformIntegrationTestComponent,
  PlatformIntegrationDistributionComponent
];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_ENTRY],
  entryComponents: COMPONENTS_ENTRY,
  imports: [
    SharedModule,
    AdminUiAngularProjectManagementRoutingModule,
    ZGrafnaModule
  ],
  exports: []
})

export class AdminUiAngularProjectManagementModule { }
