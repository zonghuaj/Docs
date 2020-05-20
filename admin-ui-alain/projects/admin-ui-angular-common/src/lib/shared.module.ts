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

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { ServiceSelectModule } from './components/service-select/service-select.module';
import { ConfirmButtonGroupModule } from './components/confirm-button-group/confirm-button-group.module';
import { CdsBreadcrumbModule } from './features/cds-breadcrumb.module';
import { SafeHtmlPipe } from './utils/safe-html.pipe';
import { EllipsisPipe } from './utils/ellipsis.pipe';
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
];
const COMPONENTS = [CdsBreadcrumbModule, ServiceSelectModule, ConfirmButtonGroupModule];
const PIPES = [SafeHtmlPipe, EllipsisPipe];
@NgModule({
  declarations: [PIPES],
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
    COMPONENTS,
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
    PIPES,
    COMPONENTS,
  ]
})
export class SharedModule { }
