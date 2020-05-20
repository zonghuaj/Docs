import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArtifactoryListComponent} from "./features/artifactory-list/artifactory-list.component";
import {ArtifactoryStageListComponent} from "./features/artifactory-stage-flow/artifactory-stage-list.component";
import {DevelopConsoleGuard} from "@app/routes/guards/develop-console-guard";
import {ArtifactoryDetailContainerComponent} from "./features/artifactory-detail/artifactory-detail-container.component";
import {ArtifactoryDetailInfoComponent} from "./features/artifactory-detail/artifactory-detail-info.component";
import {ArtifactoryDetailRuntimeparamsComponent} from "./features/artifactory-detail/runtime-params/artifactory-detail-runtimeparams.component";
import {ArtifactoryDetailDeployparamsComponent} from "./features/artifactory-detail/deploy-params/artifactory-detail-deployparams.component";
import { ArtifactoryTemplateComponent } from './features/artifactory-template/artifactory-template.component';
import {ArtifactoryTemplateListComponent} from './features/artifactory-template/artifactory-template-list/artifactory-template-list.component'

const routes: Routes =  [
  {path: 'list', component: ArtifactoryListComponent, canActivate: [DevelopConsoleGuard]},
  {path: 'version/:vid/stage', component: ArtifactoryStageListComponent, canActivate: [DevelopConsoleGuard]},
  {path: 'version/:vid/flow-edit', component: ArtifactoryStageListComponent, canActivate: [DevelopConsoleGuard]},
  {path: 'template', component: ArtifactoryTemplateListComponent, canActivate: [DevelopConsoleGuard]},
  {path: 'template/create', component: ArtifactoryTemplateComponent, canActivate: [DevelopConsoleGuard]},
  {
    path: ':aid', component: ArtifactoryDetailContainerComponent, canActivate: [DevelopConsoleGuard],
    children: [
      {path: 'info', component: ArtifactoryDetailInfoComponent},
      {path: 'runtime', component: ArtifactoryDetailRuntimeparamsComponent},
      {path: 'deploy', component: ArtifactoryDetailDeployparamsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularArtifactoryRoutingModule {}
