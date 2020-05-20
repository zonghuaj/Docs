import { NgModule } from '@angular/core';

import { AdminUiAngularPlatformOsRoutingModule } from './admin-ui-angular-platform-os-routing.module';
import {OperatingEnvManagementComponent} from "./features/operatingEnv-management.component";
import {SharedModule} from "admin-ui-angular-common";

@NgModule({
  declarations: [OperatingEnvManagementComponent],
  imports: [
    SharedModule,
    AdminUiAngularPlatformOsRoutingModule,
  ],
  exports: [OperatingEnvManagementComponent]
})
export class AdminUiAngularPlatformOsModule { }
