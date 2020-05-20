import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdsBreadcrumbComponent } from './cds-breadcrumb.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    CdsBreadcrumbComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule
  ],
  exports: [
    CdsBreadcrumbComponent
  ]
})
export class CdsBreadcrumbModule { }
