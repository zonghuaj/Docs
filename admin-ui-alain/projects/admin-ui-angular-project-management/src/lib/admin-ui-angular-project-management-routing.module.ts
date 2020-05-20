import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from "./features/project-list/project-list.component";
import {ProjectMonitorComponent} from "./features/project-monitor/project-monitor.component";
import {TenantConsoleGuard} from "@app/routes/guards/tenant-console-guard";
import {ProjectCreateComponent} from "./features/project-create/project-create.component";
import {PlatformIntegrationComponent} from "./features/platform-integration-center/platform-integration.component";
import {PlatformIntegrationEditComponent} from "./features/platform-integration-center/platform-integration-edit.component";
import {ProjectEditComponent} from "./features/project-edit/project-edit.component";
import {ProjectDetailContainerComponent} from "./features/project-detail/project-detail-container.component";
import {ProjectInfoComponent} from "./features/project-detail/info/project-info.component";
import {ProjectMemberControlComponent} from "./features/project-detail/members/project-member-control.component";
import {ProjectRoleListComponent} from "./features/project-roles/project-role-list.component";
import {ProjectRoleEditComponent} from "./features/project-roles/project-role-edit.component";
import {ProjectRoleBindComponent} from "./features/project-roles/project-role-bind.component";

const routes: Routes = [
  {
    path: 'all', component: ProjectListComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'dashboard', component: ProjectMonitorComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'create', component: ProjectCreateComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'platform-center', component: PlatformIntegrationComponent,
    children: [
      {
        path: 'list', component: PlatformIntegrationComponent,
      },
      {
        path: 'edit', component: PlatformIntegrationEditComponent,
      }]
    // canActivate: [TenantConsoleGuard]
  },
  {
    path: 'role', component: ProjectRoleListComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'role/add', component: ProjectRoleEditComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'role/:roleId/edit', component: ProjectRoleEditComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'role/:roleId/bind', component: ProjectRoleBindComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: ':projectId',
    children: [
      {
        path: 'edit', component: ProjectEditComponent,
        canActivate: [TenantConsoleGuard]
      },
      {
        path: 'detail', component: ProjectDetailContainerComponent,
        canActivate: [TenantConsoleGuard],
        children: [
          {
            path: 'info', component: ProjectInfoComponent
          },
          {
            path: 'members', component: ProjectMemberControlComponent
          },
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularProjectManagementRoutingModule {
}
