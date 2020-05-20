import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminUiAngularQualityGateComponent} from './features/projects/admin-ui-angular-quality-gate.component';
import {QualityGateRulesComponent} from './features/rules/quality-gate-rules.component';
import {QGateProjectDetailComponent} from './features/projects/detail-page/qgate-project-detail.component';
import {DevelopConsoleGuard} from '@app/routes/guards/develop-console-guard';

const routes: Routes = [
  {
    path: 'projects',
    component: AdminUiAngularQualityGateComponent,
    canActivate: [DevelopConsoleGuard]
  },
  {
    path: 'project/:key',
    component: QGateProjectDetailComponent,
    canActivate: [DevelopConsoleGuard]
  },
  {
    path: 'rules',
    component: QualityGateRulesComponent,
    canActivate: [DevelopConsoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularQualityGateRoutingModule {
}
