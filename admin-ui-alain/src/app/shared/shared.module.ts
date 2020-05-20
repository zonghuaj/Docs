import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonChartModule } from '@delon/chart';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';

// #region third libs
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  // NzDescriptionsModule
];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    NgxEchartsModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // third libs
    THIRDMODULES,
  ],
  declarations: [
    // your components
    COMPONENTS,
    DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    NgxEchartsModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // i18n
    TranslateModule,
    // third libs
    THIRDMODULES,
    // your components
    COMPONENTS,
    DIRECTIVES,
  ]
})
export class SharedModule { }
