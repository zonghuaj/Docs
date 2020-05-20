import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
];


@NgModule({
  imports: [SharedModule],
  entryComponents: [],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class LayoutModule { }
