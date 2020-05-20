import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'admin-ui-angular-common';
import { VersionTrafficConfigEntity } from '../../entities/traffic-config.entites';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'version-traffic-panel-form',
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submitForm()"
          style="width: 400px;">
      <nz-card nzTitle="过载保护" [nzBordered]="false" [nzExtra]="switcher1">
        <se-container col="1" labelWidth="120">
          <se label="最大并发数" error="请输入正确的数字" [required]="protectEnable">
            <nz-input-number class="width100" nz-input formControlName="maxConcurrent"
                             nzPlaceHolder="请输入最大并发数"></nz-input-number>
          </se>
          <se label="超时时长" error="请输入正确的数字" [required]="protectEnable">
            <nz-input-group nzAddOnAfter="秒">
              <nz-input-number class="width100" nz-input formControlName="overtime"
                               nzPlaceHolder="请输入超时时长"></nz-input-number>
            </nz-input-group>
          </se>
        </se-container>

        <ng-template #switcher1>
          <nz-switch formControlName="protectEnable"
                     nzCheckedChildren="开"
                     nzUnCheckedChildren="关"
                     (change)="onProjectEnableChanged($event.target.value)"
          ></nz-switch>
        </ng-template>
      </nz-card>

      <nz-card nzTitle="故障隔离" [nzBordered]="false" [nzExtra]="switcher2">
        <se-container col="1" labelWidth="120">
          <se label="检测间隔时间" error="请输入正确的数字" [required]="monitorEnable">
            <nz-input-group nzAddOnAfter="秒">
              <nz-input-number class="width100" nz-input formControlName="monitorInterval"
                               nzPlaceHolder="请输入间隔时间"></nz-input-number>
            </nz-input-group>
          </se>
          <se label="连续错误次数" error="请输入正确的数字" [required]="monitorEnable">
            <nz-input-number class="width100" nz-input formControlName="errorTimes"
                             nzPlaceHolder="请输入错误次数"></nz-input-number>
          </se>
          <se label="最小可用实例" error="请输入正确的数字" [required]="monitorEnable">
            <nz-input-group nzAddOnAfter="%">
              <nz-input-number class="width100" nz-input formControlName="minAvailableNum"
                               nzPlaceHolder="请输入可用实例"></nz-input-number>
            </nz-input-group>
          </se>
        </se-container>

        <ng-template #switcher2>
          <nz-switch formControlName="monitorEnable"
                     nzCheckedChildren="开"
                     nzUnCheckedChildren="关"
                     (change)="onMonitrorEnableChanged($event.target.value)"></nz-switch>
        </ng-template>
      </nz-card>
    </form>`,
  styleUrls: [],
  providers: []
})
export class VersionTrafficPanelFormComponent extends BaseFormComponent<VersionTrafficConfigEntity> implements OnInit {
  constructor(private fb: FormBuilder) {
    super();
  }

  protected initForm(): FormGroup {
    return this.fb.group({
      maxConcurrent: [0, []],
      overtime: [0, []],
      protectEnable: [false, []],
      monitorInterval: [0, []],
      errorTimes: [0, []],
      minAvailableNum: [0, []],
      monitorEnable: [false, []],
    });
  }

  get protectEnable() {
    return this.getFormValue('protectEnable');
  }

  get monitorEnable() {
    return this.getFormValue('monitorEnable');
  }

  onProjectEnableChanged(enabled) {
    if (this.protectEnable) {
      this.setValidators('maxConcurrent', [Validators.required]);
      this.setValidators('overtime', [Validators.required]);
    } else {
      this.setValidators('maxConcurrent');
      this.setValidators('overtime');
    }
  }

  onMonitrorEnableChanged(enabled) {
    if (this.monitorEnable) {
      this.setValidators('monitorInterval', [Validators.required]);
      this.setValidators('errorTimes', [Validators.required]);
      this.setValidators('minAvailableNum', [Validators.required]);
    } else {
      this.setValidators('maxConcurrent');
      this.setValidators('overtime');
      this.setValidators('minAvailableNum');
    }
  }
}
