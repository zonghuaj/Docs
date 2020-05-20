import { NgModule } from '@angular/core';

import { AdminUiAngularServiceTopoRoutingModule } from './admin-ui-angular-service-topo-routing.module';
import {ServiceTopoComponent} from "./features/service-topo.component";
import {SharedModule} from 'admin-ui-angular-common';
import {TopoGraphComponent} from "./features/topo-graph/topo-graph.component";
import {TopoPanelServlistComponent} from "./features/topo-panel/topo-panel-servlist.component";
import {TopoPanelServDetailComponent} from "./features/topo-panel/topo-panel-servdetail.component";
import {TopoPanelDPComponent} from "./features/topo-panel/topo-panel-detectpoint.component";
import {ServiceTopoPanelComponent} from "./features/topo-panel/topo-panel.component";

const COMPONENTS = [
  ServiceTopoComponent,
  TopoPanelServDetailComponent,
  TopoPanelDPComponent,
  TopoGraphComponent,
  TopoPanelServlistComponent,
  ServiceTopoPanelComponent,
]

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    AdminUiAngularServiceTopoRoutingModule,
    SharedModule
  ],
  exports: [COMPONENTS]
})
export class AdminUiAngularServiceTopoModule { }
