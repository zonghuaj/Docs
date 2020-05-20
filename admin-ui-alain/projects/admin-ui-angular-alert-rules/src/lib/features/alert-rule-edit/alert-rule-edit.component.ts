import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { HeaderService } from '@app/layout/default/header/header.service';
import { AlertRuleEntity } from '../../entities/alert-rule.entities';
import { NzMessageService } from 'ng-zorro-antd';
import { AdminUiAngularAlertRulesService } from '../../services/admin-ui-angular-alert-rules.service';
import { Location } from '@angular/common';

@Component({
  selector: 'alert-rule-edit',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card [nzBordered]="false">
      <alert-rule-form #f (submit)="_submit($event)"
                       [data]="r"></alert-rule-form>

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
export class AlertRuleEditComponent implements OnInit {
  loading: boolean;

  r: AlertRuleEntity;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private header: HeaderService,
    private msg: NzMessageService,
    public location: Location,
    private ruleService: AdminUiAngularAlertRulesService) {
  }

  ngOnInit(): void {
    // this.header.setTitle('添加告警规则');

    const id = +this.route.parent.snapshot.paramMap.get('ruleId');
    setTimeout(() => this.getAlarmRuleDetail(id), 1500);
  }

  getAlarmRuleDetail(id) {
    this.ruleService.getAlertRuleInfo(id)
      .subscribe(res => this.r = res);
  }

  _submit(ar: AlertRuleEntity) {
    this.loading = true;

    this.ruleService.editAlertRule(ar)
      .subscribe(res => {
        this.msg.success('修改成功');
        this.router.navigateByUrl('/alert/rule/all');
      }, err => {
        this.msg.error('修改失败');
        this.loading = false;
      });
  }
}
