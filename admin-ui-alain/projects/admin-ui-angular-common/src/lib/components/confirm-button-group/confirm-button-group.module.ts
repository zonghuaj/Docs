import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ConfirmButtonGroupComponet} from "./confirm-button-group.componet";

@NgModule({
  declarations: [
    ConfirmButtonGroupComponet
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  exports: [ConfirmButtonGroupComponet],
})
export class ConfirmButtonGroupModule {
}
