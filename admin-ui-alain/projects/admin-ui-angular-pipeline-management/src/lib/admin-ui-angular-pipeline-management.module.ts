import {NgModule} from '@angular/core';

import {AdminUiAngularPipelineManagementRoutingModule} from './admin-ui-angular-pipeline-management-routing.module';
import {PipelineListComponent} from "./features/pipeline-list/list.component";
import {SharedModule} from "admin-ui-angular-common";
import {PipelineCreateBasicComponent} from "./features/pipeline-create-basic/pipeline-create-basic.component";
import {PipelineDrawerPanelComponent} from "./features/pipeline-create-basic/panel-component/pipeline-drawer-panel.component";
import {AddNodeComponent} from "./features/pipeline-create-basic/addNode-component/addNode.component";
import {FormDynamicComponent} from "./features/pipeline-create-basic/form-dynamic-component/form-dynamic.component";
import { DeployEnvComponent } from './features/pipeline-create-basic/deploy-env/deploy-env.component';
import {DeployEnvTableComponent} from './features/pipeline-create-basic/deploy-env/deploy-env-table.component';
import {PipelineLogListComponent} from "./features/pipeline-log-list/list.component";
import {PipelineLogComponent} from "./features/pipeline-log/list.component";
import {PipelineEditComponent} from "./features/pipeline-list/edit.component";
import {CodemirrorModule} from "@ctrl/ngx-codemirror";
import {AdminUiAngularQualityGateModule} from "admin-ui-angular-quality-gate";
import {AdminUiAngularUserManagementModule} from "admin-ui-angular-user-management";
import { DeployEnvDeployComponentFormComponent } from './features/pipeline-create-basic/deploy-env-deploy/deploy-env-deploy-form.component';
import { DeployEnvDeployComponent } from './features/pipeline-create-basic/deploy-env-deploy/deploy-env-deploy.component';
import { DeployEnvContainerComponent } from './features/pipeline-create-basic/deploy-env-container/deploy-env-container.component';
import { DeployEnvServiceCreateComponent } from './features/pipeline-create-basic/deploy-env-service-create/deploy-env-service-create.component';
import { ServiceCreateFormComponent } from './features/pipeline-create-basic/deploy-env-service-create/service-create-form/service-create-form.component';

const COMPONENT = [
  PipelineListComponent,
  PipelineEditComponent,
  PipelineLogComponent,
  PipelineLogListComponent,

  PipelineCreateBasicComponent,
  PipelineDrawerPanelComponent,
  AddNodeComponent,
  DeployEnvComponent,
  DeployEnvDeployComponentFormComponent,
  DeployEnvDeployComponent,
  DeployEnvTableComponent,
  DeployEnvContainerComponent,
  DeployEnvServiceCreateComponent,
  ServiceCreateFormComponent,
  FormDynamicComponent
];

const ENTRY_COMPONENTS = [
  PipelineDrawerPanelComponent,
  AddNodeComponent,
  DeployEnvComponent,
  DeployEnvTableComponent,
  DeployEnvDeployComponentFormComponent,
  DeployEnvDeployComponent,
  DeployEnvContainerComponent,
  DeployEnvServiceCreateComponent,
  ServiceCreateFormComponent,
  FormDynamicComponent
];

@NgModule({
  declarations: [...COMPONENT, DeployEnvContainerComponent, DeployEnvServiceCreateComponent, ServiceCreateFormComponent],
  entryComponents: ENTRY_COMPONENTS,
  imports: [
    SharedModule,
    CodemirrorModule,
    AdminUiAngularUserManagementModule,
    AdminUiAngularPipelineManagementRoutingModule,
    AdminUiAngularQualityGateModule
  ],
  exports: [...COMPONENT]
})
export class AdminUiAngularPipelineManagementModule {
}
