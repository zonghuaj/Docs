import { NgModule } from '@angular/core';
import { AdminUiAngularServiceTrafficRoutingModule } from './admin-ui-angular-service-traffic-routing.module';
import { AdminUiAngularServiceTrafficComponent } from './features/admin-ui-angular-service-traffic.component';
import { SharedModule } from 'admin-ui-angular-common';
import { GatewayTrafficPanelComponent } from './features/gateway-panel/gateway-traffic-panel.component';
import { GatewayTrafficPanelFormComponent } from './features/gateway-panel/gateway-traffic-panel-form.component';
import { ServiceTrafficPanelComponent } from './features/service-panel/service-traffic-panel.component';
import { ServiceTrafficPanelFormComponent } from './features/service-panel/service-traffic-panel-form.component';
import { TrafficGraphComponent } from './features/traffic-graph/traffic-graph.component';
import { VersionTrafficPanelComponent } from './features/version-panel/version-traffic-panel.component';
import { VersionTrafficPanelFormComponent } from './features/version-panel/version-traffic-panel-form.component';
import { LinePanelComponent } from './features/line-panel/line-panel.component';

@NgModule({
  declarations: [
    AdminUiAngularServiceTrafficComponent,
    GatewayTrafficPanelComponent,
    GatewayTrafficPanelFormComponent,
    ServiceTrafficPanelComponent,
    ServiceTrafficPanelFormComponent,
    TrafficGraphComponent,
    VersionTrafficPanelComponent,
    VersionTrafficPanelFormComponent,
    LinePanelComponent
  ],
  imports: [
    AdminUiAngularServiceTrafficRoutingModule,
    SharedModule
  ],
  entryComponents: [
    GatewayTrafficPanelComponent,
    VersionTrafficPanelComponent,
    ServiceTrafficPanelComponent
  ],
  exports: [AdminUiAngularServiceTrafficComponent]
})
export class AdminUiAngularServiceTrafficModule { }
