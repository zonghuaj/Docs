import {NgModule} from '@angular/core';

import {AdminUiAngularPlatformNodeListRoutingModule} from './admin-ui-angular-platform-node-list-routing.module';
import {NodeListLayoutComponent} from "./features/list.component";
import {NodeListEditComponent} from "./features/edit.component";
import {SharedModule} from "admin-ui-angular-common";

@NgModule({
  declarations: [NodeListLayoutComponent, NodeListEditComponent],
  entryComponents: [NodeListEditComponent],
  imports: [
    SharedModule,
    AdminUiAngularPlatformNodeListRoutingModule,
  ],
  exports: [NodeListLayoutComponent]
})
export class AdminUiAngularPlatformNodeListModule {
}
