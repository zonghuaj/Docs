import {Component, Input, OnInit} from '@angular/core';
import {QGateProject} from '../../entities/quality-gate.entities';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {AdminUiAngularQualityGateService} from '../../services/admin-ui-angular-quality-gate.service';

@Component({
  selector: 'qgate-create-modal',
  template: `
    <se-container col="1" labelWidth="100">
      <se label="工程名称" required>
        <input nz-input [(ngModel)]="name" [disabled]="editable">
      </se>
      <se label="质量门禁" required>
        <nz-select nzPlaceHolder="请选择" style="width: 100%;" [(ngModel)]="qualityGateId">
          <nz-option *ngFor="let t of qgates" [nzLabel]="t.name" [nzValue]="t.id"></nz-option>
        </nz-select>
      </se>
    </se-container>

    <z-confirm-button-group (naturalClicked$)="add()" (negativeClicked$)="cancel()"
                            [naturalDisable]="disableSubmit"
                            [naturalLoading]="loading"></z-confirm-button-group>
  `,
  styles: [],
  providers: [AdminUiAngularQualityGateService]
})
export class QGateCreateModalComponent implements OnInit {
  loading: boolean;
  name: string;
  qualityGateId: string;

  @Input() project: QGateProject = {} as QGateProject;

  @Input() qgates: { id: string, name: string }[];

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private qgService: AdminUiAngularQualityGateService) {
  }

  ngOnInit(): void {
    if (this.editable) {
      this.name = this.project.name;

      this.qgService.getQualityGateProjectDetail(this.project.key).subscribe((res: any) => {
        if (res && res.qualityGate && this.qgates.findIndex(q => q.id === res.qualityGate.key) >= 0) {
          this.qualityGateId = res.qualityGate.key;
        }
      });
    }
  }

  add() {
    const proj = {
      "name": this.name,
      "project": this.name,
      "qualityGateId": this.qualityGateId
    };

    this.loading = true;
    if (this.project.id) {
      this.qgService.qgRuleBindProject(this.qualityGateId, [this.project.key]).subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.modal.close({});
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
    } else {
      this.qgService.addQualityGateProject(proj).subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.modal.close({});
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
    }
  }

  cancel() {
    this.modal.close();
  }

  get disableSubmit() {
    return !this.name || !this.qualityGateId;
  }

  get editable() {
    return this.project.id;
  }
}
