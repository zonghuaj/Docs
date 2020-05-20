import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularAlertRulesComponent } from './features/admin-ui-angular-alert-rules.component';
import { AlertRuleCreateComponent } from './features/alert-rule-edit/alert-rule-create.component';
import { AlertRuleEditComponent } from './features/alert-rule-edit/alert-rule-edit.component';

const routes: Routes = [
  {
    path: 'all',
    component: AdminUiAngularAlertRulesComponent
  },
  {
    path: 'create', component: AlertRuleCreateComponent,
  },
  {
    path: ':ruleId',
    children: [
      {
        path: 'edit', component: AlertRuleEditComponent,
      },
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularAlertRulesRoutingModule { }
