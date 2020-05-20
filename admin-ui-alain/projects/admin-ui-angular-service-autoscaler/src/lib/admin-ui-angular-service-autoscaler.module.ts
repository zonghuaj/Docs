import { NgModule } from '@angular/core';
import { AdminUiAngularServiceAutoscalerRoutingModule } from './admin-ui-angular-service-autoscaler-routing.module';
import { AdminUiAngularServiceAutoscalerComponent } from './features/admin-ui-angular-service-autoscaler.component';
import { SharedModule } from 'admin-ui-angular-common';
import { AutoscalerEditComponent } from './features/edit.component';
@NgModule({
  declarations: [
    AdminUiAngularServiceAutoscalerComponent,
    AutoscalerEditComponent
  ],
  imports: [
    AdminUiAngularServiceAutoscalerRoutingModule,
    SharedModule
  ],
  entryComponents: [AutoscalerEditComponent],
  exports: [AdminUiAngularServiceAutoscalerComponent]
})
export class AdminUiAngularServiceAutoscalerModule { }
