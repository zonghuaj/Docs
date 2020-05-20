import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ZGrafnaSchartComponent } from './schart/zgrafna-schart.component';
import { ZGrafnaSinglestatComponent } from './singlestat/zgrafna-singlestat.component';
import { ZGrafnaContainerComponent } from './container/zgrafna-container.component';

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
