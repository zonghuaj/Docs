import {NgModule} from "@angular/core";
import {SharedModule} from "@shared";
import {ZGrafnaSchartComponent} from "@app/common/zgrafna/schart/zgrafna-schart.component";
import {ZGrafnaSinglestatComponent} from "@app/common/zgrafna/singlestat/zgrafna-singlestat.component";
import {ZGrafnaContainerComponent} from "@app/common/zgrafna/container/zgrafna-container.component";

const COMPONENTS = [
  ZGrafnaContainerComponent,
  ZGrafnaSchartComponent,
  ZGrafnaSinglestatComponent,
];

const COMPONENTS_ENTRY = [
];

@NgModule({
  imports: [SharedModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_ENTRY
  ],
  exports: [
    ...COMPONENTS,
    ...COMPONENTS_ENTRY
  ],
  entryComponents: COMPONENTS_ENTRY
})
export class ZGrafnaModule {
}
