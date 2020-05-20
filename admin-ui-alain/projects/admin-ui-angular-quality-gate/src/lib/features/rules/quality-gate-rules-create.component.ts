import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {RuleMetric} from '../../entities/quality-gate-rule.entities';
import {AdminUiAngularQualityGateService} from "../../services/admin-ui-angular-quality-gate.service";

@Component({
  selector: 'qgate-rules-condition-rules-match-create',
  template: `
    <se-container col="1" labelWidth="120">
      <se label="质量门名称" required>
        <input nz-input [(ngModel)]="name">
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
export class QualityGateRulesCreateComponent implements OnInit {
  loading: boolean;
  name: string;
  @Input() qg;

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private qgService: AdminUiAngularQualityGateService) {
  }

  ngOnInit(): void {
    if (this.qg) {
      this.name = this.qg.name;
    }
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.loading = true;
    if (this.qg) { // edit
      // this.qgService.editGualityGateRuleName(this.qg.id, this.name).subscribe(res => {
      //   this.loading = false;
      //   this.msg.success('提交成功');
      //   this.modal.close(res);
      // }, err => {
      //   this.loading = false;
      //   this.msg.error('提交失败');
      // });
    } else { // create
      this.qgService.createGualityGateRule(this.name).subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.modal.close(res);
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
    }
  }

  get disableSubmit() {
    return !this.name;
  }
}
