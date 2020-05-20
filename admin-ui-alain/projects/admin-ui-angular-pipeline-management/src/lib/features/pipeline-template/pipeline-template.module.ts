import {NgModule} from '@angular/core';
import {SharedModule} from "admin-ui-angular-common";
import {PipelineTemplateCodeComponent} from "./pipeline-template-code/pipeline-template-code.component";
import {PipelineTemplateInfoComponent} from "./pipeline-template-info/pipeline-template-info.component";
import {PipelineTemplateParamsComponent} from "./pipeline-template-preview/pipeline-template-params.component";
import {PipelineConstantTableComponent} from "./pipeline-constant-table/pipeline-constant-table.component";
import {PipelineTemplateListComponent} from "./pipeline-template-list.component";

const COMPONENT = [
  PipelineTemplateCreateComponent,
  PipelineTemplateCodeComponent,
  PipelineTemplateInfoComponent,
  PipelineTemplateParamsComponent,
  PipelineConstantTableComponent,
  PipelineTemplateListComponent
];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    SharedModule,
  ],
  exports: [...COMPONENT]
})
export class PipelineTemplateModule {
}
