import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { HeaderService } from '@app/layout/default/header/header.service';
import { AlertRuleEntity } from '../../entities/alert-rule.entities';
import { NzMessageService } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { AdminUiAngularAlertRulesService } from '../../services/admin-ui-angular-alert-rules.service';

@Component({
  selector: 'alert-rule-create',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card [nzBordered]="false">
      <alert-rule-form #f (submit)="_submit($event)"></alert-rule-form>

      <div nz-row nzType="flex" nzJustify="center">
        <button nz-button nzType="default" type="default" class="pl-lg pr-lg"
                (click)="location.back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                [nzLoading]="loading"
                (click)="f.submitForm()">提交
        </button>
      </div>
    </nz-card>`,
})
export class AlertRuleCreateComponent implements OnInit {
  loading: boolean;

  constructor(
    private router: Router,
    // private header: HeaderService,
    private msg: NzMessageService,
    public location: Location,
    private ruleService: AdminUiAngularAlertRulesService) {
  }

  ngOnInit(): void {
    // this.header.setTitle('添加告警规则');
  }

  _submit(se: AlertRuleEntity) {
    this.loading = true;

    this.ruleService.createAlertRule(se)
      .subscribe(res => {
        this.msg.success('创建成功');
        this.router.navigateByUrl('/alert/rule/all');
      }, err => {
        this.msg.error('创建失败');
        this.loading = false;
      });
  }
}
