import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUiAngularItestPlatformComponent } from './features/admin-ui-angular-itest-platform.component';
import {DevelopConsoleGuard} from "@app/routes/guards/develop-console-guard";

const routes: Routes = [{
  path: '',
  component: AdminUiAngularItestPlatformComponent,
  canActivate: [DevelopConsoleGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularItestPlatformRoutingModule {}
