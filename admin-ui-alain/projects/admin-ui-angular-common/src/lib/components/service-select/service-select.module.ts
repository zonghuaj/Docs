import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSelectComponent } from './service-select.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceManageService } from '../../services/service-manage.service';

@NgModule({
  declarations: [
    ServiceSelectComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    ServiceSelectComponent],
  providers: [ServiceManageService]
})
export class ServiceSelectModule { }
