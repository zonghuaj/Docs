import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PipelineListComponent} from "./features/pipeline-list/list.component";
import {PipelineCreateBasicComponent} from "./features/pipeline-create-basic/pipeline-create-basic.component";
import {PipelineLogListComponent} from "./features/pipeline-log-list/list.component";
import {PipelineLogComponent} from "./features/pipeline-log/list.component";

const routes: Routes = [
  {path: 'list', component: PipelineListComponent},
  {path: 'list/edit', component: PipelineCreateBasicComponent},
  {
    path: 'log/list', children: [
      {path: ':pipelineId', component: PipelineLogListComponent,},
      {path: ':pipelineId/detail/:logId', component: PipelineLogComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularPipelineManagementRoutingModule {
}
