import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ServiceListComponent} from "./features/service-list/service-list.component";
import {ServiceCreateComponent} from "./features/service-create/service-create.component";
import {ServiceEditComponent} from "./features/service-edit/service-edit.component";
import {ProjectConsoleGuard} from "@app/routes/guards/project-console-guard";
import {ServiceDetailContainerComponent} from "./features/service-detail/service-detail-container.component";
import {ServiceInfoComponent} from "./features/service-detail/info/service-info.component";
import {ServiceMonitorComponent} from "./features/service-detail/monitor/service-monitor.component";
import {ServiceLogComponent} from "./features/service-detail/log/service-log.component";
import {ServiceConsoleComponent} from "./features/service-detail/console/service-console.component";
import {AdminUiAngularServiceAutoscalerComponent} from "admin-ui-angular-service-autoscaler";
import {VersionCreateComponent} from "./features/service-create/version-create.component";
import {VersionEditComponent} from "./features/service-edit/version-edit.component";

const routes: Routes = [
  {
    path: 'all', component: ServiceListComponent,
    canActivate: [ProjectConsoleGuard]
  },
  {
    path: 'create', component: ServiceCreateComponent,
    canActivate: [ProjectConsoleGuard]
  },
  // {
  //   path: 'topo', component: ServiceTopoComponent,
  //   canActivate: [ProjectConsoleGuard]
  // },
  {
    path: ':serviceId',
    children: [
      {
        path: 'edit', component: ServiceEditComponent,
        canActivate: [ProjectConsoleGuard]
      },
      {
        path: 'detail', component: ServiceDetailContainerComponent,
        canActivate: [ProjectConsoleGuard],
        children: [
          {path: 'info', component: ServiceInfoComponent},
          {path: 'monitor', component: ServiceMonitorComponent},
          {path: 'log', component: ServiceLogComponent},
          {path: 'console', component: ServiceConsoleComponent},
          {path: 'autoScaler', component: AdminUiAngularServiceAutoscalerComponent}
        ]
      },
      {
        path: 'version', children: [
          {
            path: 'create', component: VersionCreateComponent,
            canActivate: [ProjectConsoleGuard]
          },
          {
            path: ':versionId', children: [
              {
                path: 'edit', component: VersionEditComponent,
                canActivate: [ProjectConsoleGuard]
              },
            ]
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
export class AdminUiAngularServiceManagementRoutingModule {}
