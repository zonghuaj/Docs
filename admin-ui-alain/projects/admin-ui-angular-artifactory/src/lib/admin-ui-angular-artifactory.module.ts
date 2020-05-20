import {NgModule} from '@angular/core';

import {SharedModule} from 'admin-ui-angular-common';
import {ArtifactoryListComponent} from "./features/artifactory-list/artifactory-list.component";
import {ArtifactoryDetailRuntimeparamsComponent} from "./features/artifactory-detail/runtime-params/artifactory-detail-runtimeparams.component";
import {ArtifactoryStageItemComponent} from "./features/artifactory-stage-flow/stage-item/artifactory-stage-item.component";
import {ArtifactoryVersionListComponent} from "./features/artifactory-detail/artifactory-version-list.component";
import {ArtifactoryDetailDeployparamsComponent} from "./features/artifactory-detail/deploy-params/artifactory-detail-deployparams.component";
import {StageLineComponent} from "./features/artifactory-detail/stage-line/stage-line.component";
import {RuntimeParamsTableComponent} from "./features/artifactory-detail/runtime-params/runtime-params-table.component";
import {ArtifactoryStageListComponent} from "./features/artifactory-stage-flow/artifactory-stage-list.component";
import {StageLineItemComponent} from "./features/artifactory-detail/stage-line/stage-line-item.component";
import {ArtifactoryCreateComponent} from "./features/artifactory-create/artifactory-create.component";
import {ArtifactoryVersionCreateComponent} from "./features/artifactory-create/artifactory-version-create.component";
import {ArtifactoryStageEditComponent} from "./features/artifactory-stage-flow/stage-item/artifactory-stage-edit.component";
import {ArtifactoryFlowStartComponent} from "./features/artifactory-stage-flow/artifactory-flow-start.component";
import {ArtifactoryStageApproveComponent} from "./features/artifactory-stage-flow/artifactory-stage-approve.component";
import {ArtifactoryDetailDeployparamsFormComponent} from "./features/artifactory-detail/deploy-params/artifactory-detail-deployparams-form.component";
import {ArtifactoryDetailInfoComponent} from "./features/artifactory-detail/artifactory-detail-info.component";
import {ArtifactoryDetailContainerComponent} from "./features/artifactory-detail/artifactory-detail-container.component";
import {ArtifactoryStageFlowDrawerPanelComponent} from "./features/artifactory-stage-flow/rightpanel-component/artifactory-stage-flow-drawer-panel.component";
import {AdminUiAngularArtifactoryRoutingModule} from "./admin-ui-angular-artifactory-routing.module";
import {FlowFormDynamicComponent} from './features/artifactory-stage-flow/flow-form-dynamic-component/flow-form-dynamic.component'
import {AdminUiAngularUserManagementModule} from "admin-ui-angular-user-management";
import { ArtifactoryTemplateComponent } from './features/artifactory-template/artifactory-template.component';
import { ArtifactoryTemplateListComponent } from './features/artifactory-template/artifactory-template-list/artifactory-template-list.component';
import { ArtifactoryTemplateCreateComponent } from './features/artifactory-template/artifactory-template-create/artifactory-template-create.component';

const COMPONENTS = [
  ArtifactoryListComponent,
  ArtifactoryDetailContainerComponent,
  ArtifactoryDetailInfoComponent,
  ArtifactoryDetailRuntimeparamsComponent,
  ArtifactoryDetailDeployparamsComponent,
  ArtifactoryVersionListComponent,
  ArtifactoryStageItemComponent,
  RuntimeParamsTableComponent,
  ArtifactoryDetailDeployparamsFormComponent,
  StageLineComponent,
  StageLineItemComponent,
  ArtifactoryStageListComponent,
  FlowFormDynamicComponent,
  ArtifactoryStageFlowDrawerPanelComponent,
  ArtifactoryTemplateComponent
];

const COMPONENTS_ENTRY = [
  ArtifactoryCreateComponent,
  ArtifactoryStageApproveComponent,
  ArtifactoryVersionCreateComponent,
  ArtifactoryStageEditComponent,
  ArtifactoryStageFlowDrawerPanelComponent,
  FlowFormDynamicComponent,
  ArtifactoryFlowStartComponent,
  ArtifactoryTemplateComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_ENTRY,
    ArtifactoryTemplateComponent,
    ArtifactoryTemplateListComponent,
    ArtifactoryTemplateCreateComponent
  ],
  imports: [
    SharedModule,
    AdminUiAngularUserManagementModule,
    AdminUiAngularArtifactoryRoutingModule
  ],
  exports: [
    ...COMPONENTS,
    ...COMPONENTS_ENTRY,
  ],
  entryComponents: COMPONENTS_ENTRY
})
export class AdminUiAngularArtifactoryModule {
}
