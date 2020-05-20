import {NgModule} from '@angular/core';

import {AdminUiAngularQualityGateRoutingModule} from './admin-ui-angular-quality-gate-routing.module';
import {AdminUiAngularQualityGateComponent} from './features/projects/admin-ui-angular-quality-gate.component';
import {SharedModule} from 'admin-ui-angular-common';
import {QGateLastCheckItemComponent} from './features/projects/qgate-lastcheck/qcheck-lastcheck-item.component';
import {QGateCreateModalComponent} from './features/projects/qgate-create-modal.component';
import {QGateLastCheckListComponent} from './features/projects/qgate-lastcheck/qcheck-lastcheck-list.component';
import {QualityGateRulesComponent} from './features/rules/quality-gate-rules.component';
import {QualityGateRulesMatchCreateComponent} from './features/rules/quality-gate-rules-condition-create.component';
import {QualityGateRulesMatchTableComponent} from './features/rules/quality-gate-rules-condition-table.component';
import {QualityGateRulesCreateComponent} from './features/rules/quality-gate-rules-create.component';
import {QGateCheckItemRingComponent} from './features/projects/index-items/ring-item.component';
import {QGateCheckItemDotComponent} from './features/projects/index-items/dot-item.component';
import {QGateProjectDetailComponent} from './features/projects/detail-page/qgate-project-detail.component';
import {QgateProjectDetailIndexComponent} from './features/projects/detail-page/qgate-project-detail-index.component';
import {QGateCheckItemRatingComponent} from './features/projects/index-items/rating-item.component';
import {QgateProjectDetailSumcardComponent} from './features/projects/detail-page/sum-card/qgate-project-detail-sumcard.component';
import {QualityGateLegendComponent} from "./features/projects/quality-gate-legend.component";

const COPONENTS = [
  AdminUiAngularQualityGateComponent,
  QGateLastCheckListComponent,
  QGateLastCheckItemComponent,
  QualityGateRulesComponent,
  QualityGateRulesMatchTableComponent,
  QGateCheckItemRingComponent,
  QGateCheckItemDotComponent,
  QGateCheckItemRatingComponent,
  QGateProjectDetailComponent,
  QgateProjectDetailIndexComponent,
  QgateProjectDetailSumcardComponent
];
const COPONENTS_ENTRY = [
  QGateCreateModalComponent,
  QualityGateRulesMatchCreateComponent,
  QualityGateRulesCreateComponent,
  QualityGateLegendComponent
];

@NgModule({
  declarations: [...COPONENTS, ...COPONENTS_ENTRY],
  imports: [
    AdminUiAngularQualityGateRoutingModule,
    SharedModule,
  ],
  entryComponents: COPONENTS_ENTRY,
  exports: [...COPONENTS]
})
export class AdminUiAngularQualityGateModule {
}
