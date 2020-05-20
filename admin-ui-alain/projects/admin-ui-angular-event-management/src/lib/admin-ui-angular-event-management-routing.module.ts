import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EventListComponent} from "./features/event-list/event-list.component";

const routes: Routes = [
  {path: 'list', component: EventListComponent},
  {path: 'list/:type', component: EventListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularEventManagementRoutingModule {}
