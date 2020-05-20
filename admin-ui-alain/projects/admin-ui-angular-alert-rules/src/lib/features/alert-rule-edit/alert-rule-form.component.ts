import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent, ServiceManageService } from 'admin-ui-angular-common';
import {
  AlertRuleEntity,
  Index,
  SerVerItem
} from '../../entities/alert-rule.entities';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminUiAngularAlertRulesService } from '../../services/admin-ui-angular-alert-rules.service';
import { zip } from 'rxjs';

@Component({
  selector: 'alert-rule-form',
  templateUrl: './alert-rule-form.component.html',
  styleUrls: ['./alert-rule-form.component.less'],
})
export class AlertRuleFormComponent extends BaseFormComponent<AlertRuleEntity> implements OnInit {
  readonly INDEXES: Index[] = [
    { v: 'SERVICE_STOP', l: '服务异常停止', hasValue: false },
    { v: 'CPU_USE_PERCENT_OVER', l: 'CPU使用率超过(%)', hasValue: true },
    { v: 'MEMORY_USER_PERCENT_OVER', l: '内存使用率超过(%)', hasValue: true },
    { v: 'QUERY_DELAY_OVER', l: '请求延迟超过(秒)', hasValue: false },
    { v: 'QUERY_PERCENT_SECOND_COUNT', l: '每秒请求数超过(次)', hasValue: false },
    { v: 'HTTP_CODE_5XX_COUNT_OVER', l: '错误数超过(个)', hasValue: true },
  ];

  userGroup: { id: string, name: string }[] = [];

  services: CheckableS[] = [];

  allChecked = false;
  indeterminate = false;

  constructor(
    private fb: FormBuilder,
    private alertRuleSevice: AdminUiAngularAlertRulesService,
    private servManService: ServiceManageService,
    private cdr: ChangeDetectorRef) {
    super();

  }

  ngOnInit(): void {
    super.ngOnInit();

    zip(
      this.alertRuleSevice.getUserGroup(),
      this.servManService.getAllServices()
    ).subscribe((ress) => {
      this.initUserGroups(ress[0]);
      this.initServices(ress[1]);
      this.cdr.detectChanges();
    });

  }

  private initUserGroups(res: any) {
    this.userGroup = [...res.rows];
  }

  private initServices(res: any) {
    this.services = res.rows
      .reduce((pre, cur) => [
        ...pre,
        ...cur.versions.map(v => ({
          ...v,
          sid: cur.id,
          sname: cur.serviceName
        }))], [])
      .map((v) => ({
        versionId: v.id,
        serviceId: v.sid,
        versionName: v.version,
        serviceName: v.sname,
        checked: false
      }));
  }

  protected initForm(): FormGroup {
    this.form = this.fb.group({
      name: ['', [Validators.required,]],
      receiveGroup: [[], []],
      level: ['M', []],
      services: [],
      rules: this.fb.array([this.createRule()])
    });

    return this.form;
  }

  setFormData(d: AlertRuleEntity) {
    // add some count of rule controls
    if (this.rules.controls.length < d.rules.length) {
      for (let i = 0; i < d.rules.length - 1; i++) {
        this.addRule();
      }
    }
    super.setFormData(d);
    // rest disable/enable status of rule controls
    this.rules.controls.forEach((rc: any) => {
      if (rc.controls.metric.value === this.INDEXES[0].v) {
        rc.controls.threshold.disable();
      } else {
        rc.controls.threshold.enable();
      }
    });

    this.setServiceChecked();
  }

  private setServiceChecked() {
    this.services.forEach((sv, index) => {
      const _sv = this.data.services.find(s => s.versionId === sv.versionId);
      if (_sv) {
        sv.checked = true;
      }
    });
    this.updateSingleChecked();
  }

  get name() {
    return this.form.controls.name;
  }

  get receiveGroup() {
    return this.form.controls.receiveGroup;
  }

  get rules() {
    return this.form.controls.rules as FormArray;
  }

  getMetric(index) {
    return this.rules.controls[index]['controls'].metric.value;
  }

  createRule() {
    return this.fb.group({
      metric: 'SERVICE_STOP',
      threshold: { value: 0, disabled: true },
      duration: '1',
    });
  }

  addRule() {
    this.rules.push(this.createRule());
  }

  removeRule(i) {
    this.rules.removeAt(i);
  }

  onMetricSelChanged(val: string, index: number) {
    const thdCtrl = this.rules.controls[index]['controls'].threshold as FormControl;
    thdCtrl.setValue(0);
    if (val === this.INDEXES[0].v) {
      thdCtrl.disable();
    } else {
      thdCtrl.enable();
    }
  }

  _submitForm(d: AlertRuleEntity): AlertRuleEntity {
    // d.receiveGroup = d.receiveGroup.filter(r => !!r);

    d.rules.forEach(r => {
      if (!r.threshold) r.threshold = 0;
    });

    const sevs = [...this.services];
    d.services = sevs.filter(s => s.checked).map(s => {
      delete s.checked;
      return s;
    });

    return super._submitForm(d);
  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.services = this.services.map(item => ({ ...item, checked: true }));
    } else {
      this.services = this.services.map(item => ({ ...item, checked: false }));
    }
  }

  updateSingleChecked(): void {
    if (this.services.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.services.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}

interface CheckableS extends SerVerItem {
  checked: boolean;
}
