import { NgModule } from '@angular/core';

import { AdminUiAngularAlertRulesRoutingModule } from './admin-ui-angular-alert-rules-routing.module';
import { AdminUiAngularAlertRulesComponent } from './features/admin-ui-angular-alert-rules.component';
import { SharedModule } from 'admin-ui-angular-common';
import { AlertRuleCreateComponent } from './features/alert-rule-edit/alert-rule-create.component';
import { AlertRuleEditComponent } from './features/alert-rule-edit/alert-rule-edit.component';
import { AlertRuleFormComponent } from './features/alert-rule-edit/alert-rule-form.component';
@NgModule({
  declarations: [
    AdminUiAngularAlertRulesComponent,
    AlertRuleCreateComponent,
    AlertRuleEditComponent,
    AlertRuleFormComponent
  ],
  imports: [
    AdminUiAngularAlertRulesRoutingModule,
    SharedModule
  ],
  exports: [AdminUiAngularAlertRulesComponent]
})
export class AdminUiAngularAlertRulesModule { }
