import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {ArtifactoryService} from "../artifactory.service";
import {StageFlowItem} from "../artifactory.entities";
import {NzMessageService, NzModalRef} from "ng-zorro-antd";
import {format} from "date-fns";

@Component({
  selector: 'artifactory-stage-audit',
  template: `
    <se-container class="mt-lg" col="1" labelWidth="100">
      <se label="申请信息">{{info}}</se>
      <se label="反馈">
        <textarea *ngIf="canApprove" nz-input [(ngModel)]="comment"></textarea>
        <span *ngIf="!canApprove">{{comment}}</span>
      </se>
    </se-container>

    <div *ngIf="canApprove" nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button *ngIf="stage.stageStatus === 'TO_APPROVE'" [nzLoading]="submitLoading"
              nz-button nzType="primary" type="button"
              (click)="approve()">审批
      </button>
      <button *ngIf="stage.stageStatus === 'TO_DEPLOY'" [nzLoading]="submitLoading"
              nz-button nzType="primary" type="button"
              (click)="deploy()">部署
      </button>
      <button *ngIf="canApprove" nz-button nzType="danger" type="button" [nzLoading]="rejectLoading"
              (click)="reject()">拒绝
      </button>
    </div>
  `,
  providers: [ArtifactoryService]
})
export class ArtifactoryStageApproveComponent implements OnInit {
  submitLoading: boolean;
  rejectLoading: boolean;

  @Input() vid;
  @Input() stage: StageFlowItem = {} as StageFlowItem;
  comment = '';

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private artfService: ArtifactoryService) {
  }

  ngOnInit(): void {
    this.comment = this.stage.comment;
  }

  get info() {
    switch (this.stage.stageStatus) {
      case "APPROVED":
        return `${this.stage.confirmUsername} 已经批准`; // no use
      case "TO_DEPLOY":
        return `${this.stage.createByName} 发起部署申请`;
      case "TO_APPROVE":
        return `${zformat(this.stage.deployAt)} - ${this.stage.createByName} 发起审批申请`;
      case "REJECTED":
        if (this.stage.deployApproveResult === 'REJECTED') {
          return `${zformat(this.stage.deployAt)} - ${this.stage.deployUsername} 拒绝了部署`;
        } else if (this.stage.confirmApproveReuslt === 'REJECTED') {
          return `${zformat(this.stage.confirmAt)} - ${this.stage.confirmUsername} 拒绝了审批`;
        } else {
          return '审批已被拒绝';
        }
      case "PENDING":
        return '-';
      default:
        return '-';
    }
  }

  get canApprove() { // to deploy & to approve
    return this.stage.stageStatus === 'TO_DEPLOY' || this.stage.stageStatus === 'TO_APPROVE';
  }

  approve() {
    this.submitLoading = true;
    this.artfService.auditArtVersionFlows(this.vid, this.stage.id, 'CONFIRM', 'APPROVED', this.comment)
      .subscribe(res => {
        this.submitLoading = false;
        this.msg.success('已审批');
        this.modal.close({});
      }, err => {
        this.submitLoading = false;
        this.msg.error('操作失败');
      });
  }

  deploy() {
    this.submitLoading = true;
    this.artfService.auditArtVersionFlows(this.vid, this.stage.id, 'DEPLOY', 'APPROVED', this.comment)
      .subscribe(res => {
        this.submitLoading = false;
        this.msg.success('已同意部署');
        this.modal.close({});
      }, err => {
        this.submitLoading = false;
        this.msg.error('操作失败');
      });
  }

  reject() {
    this.rejectLoading = true;
    const status = this.stage.stageStatus === 'TO_DEPLOY' ? 'DEPLOY' : 'CONFIRM';
    this.artfService.auditArtVersionFlows(this.vid, this.stage.id, status, 'REJECTED', this.comment)
      .subscribe(res => {
        this.rejectLoading = false;
        this.msg.success('已拒绝');
        this.modal.close({});
      }, err => {
        this.rejectLoading = false;
        this.msg.error('操作失败');
      });
  }

  cancel() {
    this.modal.close();
  }
}

function zformat(d) {
  return format(d, 'MM-DD HH:mm');
}
