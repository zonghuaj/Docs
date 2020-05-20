import {NgModule} from '@angular/core';

import {AdminUiAngularEventManagementRoutingModule} from './admin-ui-angular-event-management-routing.module';
import {EventListComponent} from "./features/event-list/event-list.component";
import {EventDetailComponent} from "./features/event-list/detail/event-detail.component";
import {SharedModule} from "admin-ui-angular-common";

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailComponent
  ],
  entryComponents: [EventDetailComponent],
  imports: [
    SharedModule,
    AdminUiAngularEventManagementRoutingModule,
  ],
  exports: []
})
export class AdminUiAngularEventManagementModule {
}
