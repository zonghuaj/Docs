import { NgModule } from '@angular/core';

import { AdminUiAngularItestPlatformRoutingModule } from './admin-ui-angular-itest-platform-routing.module';
import { AdminUiAngularItestPlatformComponent } from './features/admin-ui-angular-itest-platform.component';
import { SharedModule } from 'admin-ui-angular-common';

@NgModule({
  declarations: [AdminUiAngularItestPlatformComponent],
  imports: [
    AdminUiAngularItestPlatformRoutingModule,
    SharedModule
  ],
  exports: [AdminUiAngularItestPlatformComponent]
})
export class AdminUiAngularItestPlatformModule { }
