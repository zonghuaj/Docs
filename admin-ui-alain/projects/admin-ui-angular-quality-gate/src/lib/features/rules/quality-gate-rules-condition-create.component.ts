import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {RuleMetric} from '../../entities/quality-gate-rule.entities';
import {AdminUiAngularQualityGateService} from "../../services/admin-ui-angular-quality-gate.service";

@Component({
  selector: 'qgate-rules-condition-rules-match-create',
  template: `
    <se-container col="1" labelWidth="80">
      <se label="指标" required>
        <nz-select style="width: 100%;" nzShowSearch nzPlaceHolder="请选择质量检测类型"
                   [ngModel]="selectedMId"
                   (ngModelChange)="onMetricSelected($event)">
          <nz-option *ngFor="let t of metrics" [nzLabel]="t.name" [nzValue]="t.id"></nz-option>
        </nz-select>
        <!-- <se-error >名称为3-15个字符</se-error> -->
      </se>
      <se *ngIf="selectedM" label="比较条件" required>
        <nz-select *ngIf="selectedM.direction === 0" style="width: 100%;" [(ngModel)]="selectedM.op">
          <nz-option nzLabel="大于" nzValue="GT"></nz-option>
          <nz-option nzLabel="小于" nzValue="LT"></nz-option>
        </nz-select>

        <span *ngIf="selectedM.direction === 1 || selectedM.direction === -1">
          <strong>{{selectedM.direction === 1 ? '小于' : '大于'}}</strong>
        </span>
        <!-- <se-error >名称为3-15个字符</se-error> -->
      </se>
      <se *ngIf="selectedM" label="失败阈值" required>
        <input nz-input [(ngModel)]="selectedM.value">
        <!-- <se-error >名称为3-15个字符</se-error> -->
      </se>
    </se-container>

    <z-confirm-button-group (naturalClicked$)="submit()" (negativeClicked$)="cancel()"
                            [naturalLoading]="loading"
                            [naturalDisable]="disableSubmit"></z-confirm-button-group>
  `,
  styles: [],
  providers: [AdminUiAngularQualityGateService]
})
export class QualityGateRulesMatchCreateComponent implements OnInit {
  @Input() qg: any;

  @Input() metrics: RuleMetric[];
  selectedMId: string;
  selectedM: RuleMetric;

  loading: boolean;

  readonly SUPPORTED_CONDITION_TYPES = ["INT", "MILLISEC", "RATING", "WORK_DUR", "FLOAT", "PERCENT", "LEVEL"];

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private qgService: AdminUiAngularQualityGateService) {
  }

  ngOnInit(): void {
    this.metrics = this.metrics.filter(m => !m.hidden && this.SUPPORTED_CONDITION_TYPES.indexOf(m.type) >= 0);
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.loading = true;
    const condition = {
      gateId: this.qg.id,
      "metric": this.selectedM.key,
      "op": this.selectedM.op,
      "error": this.selectedM.value
    };
    this.qgService.createGualityGateCondition(condition)
      .subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.modal.close(this.selectedM);
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
  }

  get disableSubmit() {
    return !this.selectedM;
  }

  onMetricSelected(mid) {
    if (!mid) return;
    this.selectedM = {...this.metrics.find(m => m.id === mid)};
    this.selectedM.op = this.selectedM.direction <= 0 ? 'GT' : 'LT';
  }
}
