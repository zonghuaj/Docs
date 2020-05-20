import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OperatingEnvManagementComponent} from "./features/operatingEnv-management.component";
import {ProjectConsoleGuard} from "@app/routes/guards/project-console-guard";

const routes: Routes = [{
  component: OperatingEnvManagementComponent,
  canActivate: [ProjectConsoleGuard],
  path: ''
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularPlatformOsRoutingModule {}
