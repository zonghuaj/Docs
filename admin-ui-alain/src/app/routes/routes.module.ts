import {NgModule} from '@angular/core';

import {SharedModule} from '@shared';
import {RouteRoutingModule} from './routes-routing.module';
// passport pages
import {KeykloakForwardComponent} from './passport/keykloak/forward.component';
// single pages
import {CallbackComponent} from './callback/callback.component';
import {AdminUiAngularAlertAllModule} from "admin-ui-angular-alert-all";

const COMPONENTS = [
  // passport pages
  KeykloakForwardComponent,
  // single pages
  CallbackComponent,
];
const COMPONENTS_NOROUNT = [
];

@NgModule({
  imports: [
    SharedModule,
    RouteRoutingModule,
    AdminUiAngularAlertAllModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {
}
