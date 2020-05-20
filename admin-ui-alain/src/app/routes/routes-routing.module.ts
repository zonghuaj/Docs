import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimpleGuard} from '@delon/auth';
import {environment} from '@env/environment';
// layout
import {LayoutDefaultComponent} from '../layout/default/default.component';
// passport pages
import {KeykloakForwardComponent} from './passport/keykloak/forward.component';
// single pages
import {CallbackComponent} from './callback/callback.component';
import {ProjectConsoleGuard} from "@app/routes/guards/project-console-guard";
import {DummyRootComponent} from "@app/dummy-root.component";
import {PlatformConsoleGuard} from "@app/routes/guards/platform-console-guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    children: [
      {path: '', redirectTo: 'dummy', pathMatch: 'full'},
      {
        path: 'dummy',
        component: DummyRootComponent,
      },
      {
        path: 'service-dashboard',
        // component: DashboardComponent,
        loadChildren: '../features/admin-ui-angular-service-dashboard/admin-ui-angular-service-dashboard-container.module#AdminUiAngularServiceDashboardContainerModule',
        canActivate: [ProjectConsoleGuard]
      },
      {
        path: 'service/log-summary',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-log-summary/admin-ui-angular-log-summary-container.module#AdminUiAngularLogSummaryContainerModule'
      },
      {
        path: 'service/trace',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-service-trace/admin-ui-angular-service-trace-container.module#AdminUiAngularServiceTraceContainerModule'
      },
      {
        path: 'service/configCenter',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-config-center/admin-ui-angular-config-center-container.module#AdminUiAngularConfigCenterContainerModule'
      },
      {
        path: 'service/traffic',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-service-traffic/admin-ui-angular-service-traffic-container.module#AdminUiAngularServiceTrafficContainerModule'
      },
      {
        path: 'service/autoscaler',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-service-autoscaler/admin-ui-angular-service-autoscaler-container.module#AdminUiAngularServiceAutoscalerContainerModule'
      },
      {
        path: 'monitor/all',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-monitor-all/admin-ui-angular-monitor-all-container.module#AdminUiAngularMonitorAllContainerModule'
      },
      {
        path: 'alert/rule',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-alert-rules/admin-ui-angular-alert-rules-container.module#AdminUiAngularAlertRulesContainerModule'
      },
      {
        path: 'alert/all',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-alert-all/admin-ui-angular-alert-all-container.module#AdminUiAngularAlertAllContainerModule'
      },
      {
        path: 'alert/notice-way',
        canActivate: [ProjectConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-notice-way/admin-ui-angular-notice-way-container.module#AdminUiAngularNoticeWayContainerModule'
      },
      {
        path: 'image-template',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-image-template/admin-ui-angular-image-template-container.module#AdminUiAngularImageTemplateContainerModule'
      },
      {
        path: 'quality-gate',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-quality-gate/admin-ui-angular-quality-gate-container.module#AdminUiAngularQualityGateContainerModule'
      },
      {
        path: 'itest',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-itest-platform/admin-ui-angular-itest-platform-container.module#AdminUiAngularItestPlatformContainerModule'
      },
      {
        path: 'service',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-service-management/admin-ui-angular-service-management-container.module#AdminUiAngularServiceManagementContainerModule'
      },
      {
        path: 'platform/operatingEnv',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-platform-os/admin-ui-angular-platform-os-container.module#AdminUiAngularPlatformOsContainerModule'
      },
      {
        path: 'team',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-user-management/admin-ui-angular-user-management-container.module#AdminUiAngularUserManagementContainerModule',
      },
      {
        path: 'devops/pipeline',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-pipeline-management/admin-ui-angular-pipeline-management-container.module#AdminUiAngularPipelineManagementContainerModule'
      },
      {
        path: 'platform/node',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-platform-node-list/admin-ui-angular-platform-node-list-container.module#AdminUiAngularPlatformNodeListContainerModule'
      },
      {
        path: 'event',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-event-management/admin-ui-angular-event-management-container.module#AdminUiAngularEventManagementContainerModule'
      },
      {
        path: 'project',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-project-management/admin-ui-angular-project-management-container.module#AdminUiAngularProjectManagementContainerModule'
      },
      {
        path: 'platform/tenant',
        canActivate: [PlatformConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-tenant-management/admin-ui-angular-tenant-management-container.module#AdminUiAngularTenantManagementContainerModule'
      },
      {
        path: 'platform/dashboard',
        canActivate: [PlatformConsoleGuard],
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-platform-dashboard/admin-ui-angular-platform-dashboard-container.module#AdminUiAngularPlatformDashboardContainerModule'
      },
      {
        path: 'artifactory',
        // tslint:disable-next-line:max-line-length
        loadChildren: '../features/admin-ui-angular-artifactory/admin-ui-angular-artifactory-container.module#AdminUiAngularArtifactoryContainerModule',
      },
    ]
  },
  {path: 'exception', loadChildren: './exception/exception.module#ExceptionModule'},
  {path: 'passport/keycloak', component: KeykloakForwardComponent},
  // 单页不包裹Layout
  {path: 'callback/:type', component: CallbackComponent},
  {path: '**', redirectTo: 'exception/404'},

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        useHash: environment.useHash,
        // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
        // Pls refer to https://ng-alain.com/components/reuse-tab
        scrollPositionRestoration: 'top',
      }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule {
}
