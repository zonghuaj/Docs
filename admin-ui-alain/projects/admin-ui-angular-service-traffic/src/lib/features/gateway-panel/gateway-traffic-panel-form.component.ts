import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'admin-ui-angular-common';
import { GatewayConfigEntity } from '../../entities/traffic-config.entites';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {DESC_K8S_PLACEHOLDER, k8sNameFormValidor} from "admin-ui-angular-common";

@Component({
  selector: 'gateway-traffic-panel-form',
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submitForm()"
          style="width: 400px;">
      <nz-card nzTitle="入口路由" [nzBordered]="false" [nzExtra]="switcher1">
        <se-container col="1" labelWidth="80">
          <se label="名称" [error]="namePlaceHolder" required>
            <input nz-input formControlName="name" placeholder="请输入名称">
          </se>
          <se label="端口" error="请输入正确的端口" required>
            <nz-input-number class="width100" nz-input formControlName="port" nzPlaceHolder="请输入端口"></nz-input-number>
          </se>
          <se label="域名" error="请输入正确的域名" required>
            <textarea nz-input formControlName="domains" placeholder="以换行分隔多个域名" rows="3"
                      style="resize:none;"></textarea>
          </se>
        </se-container>

        <ng-template #switcher1>
          <nz-switch formControlName="enable" nzCheckedChildren="开" nzUnCheckedChildren="关"></nz-switch>
        </ng-template>
      </nz-card>
    </form>`,
  styleUrls: [],
  providers: []
})
export class GatewayTrafficPanelFormComponent extends BaseFormComponent<GatewayConfigEntity> implements OnInit {
  readonly namePlaceHolder = DESC_K8S_PLACEHOLDER;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super();
  }

  protected initForm(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required, k8sNameFormValidor]],
      domains: [null, [Validators.required]],
      port: [80, [Validators.required, this.portValidator]],
      enable: [false, []]
    });
  }

  protected setFormData(d: GatewayConfigEntity) {
    super.setFormData(d);
  }

  portValidator(control: FormControl): any {
    const result = Number.parseInt(control.value);
    const valid = Number.isInteger(result) && result < 65535 && result > 0;
    return valid ? null : { appPort: '' };
  }

  _submitForm(d: GatewayConfigEntity): GatewayConfigEntity {
    return super._submitForm(d);
  }
}
