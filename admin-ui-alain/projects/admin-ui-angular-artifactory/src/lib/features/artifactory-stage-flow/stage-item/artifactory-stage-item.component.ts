import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'artifactory-stage-item',
  template: `
    <div class="outter">
      <a class="add-btn-top noselect" *ngIf="editable" (click)="addAt$.emit(stageIndex)">+</a>
      <a class="add-btn-bottom noselect" *ngIf="editable" (click)="addAt$.emit(stageIndex + 1)">+</a>
      <a class="del-btn noselect" *ngIf="editable && parent.length > 1" (click)="removeAt$.emit(stageIndex)">-</a>

      <span class="sign-icon noselect" *ngIf="!editable" [style.background]="signColor">
        <ng-container [ngSwitch]="stage.stageStatus">
            <i *ngSwitchCase="'APPROVED'" nz-icon nzType="check" nzTheme="outline"></i>
            <i *ngSwitchCase="'REJECTED'" nz-icon nzType="close" nzTheme="outline"></i>
            <i *ngSwitchCase="'TO_DEPLOY'" nz-icon nzType="question" nzTheme="outline"></i>
            <i *ngSwitchCase="'TO_APPROVE'" nz-icon nzType="question" nzTheme="outline"></i>
            <i *ngSwitchCase="'PENDING'" nz-icon nzType="ellipsis" nzTheme="outline"></i>
            <i *ngSwitchCase="'RUNNING'" nz-icon nzType="sync" [nzSpin]="true" nzTheme="outline"></i>
            <!--i *ngSwitchCase="'RUNNING'" nz-icon nzType="sync"  [nzSpin]="true" nzTheme="outline"></i-->
        </ng-container>
      </span>

      <div class="box" [ngStyle]="{'cursor': selectable ? 'pointer': 'default'}" 
      (click)="stage.stageIndex = stageIndex;itemClick$.emit(_stage);">
        <span class="title">{{stage.name}}</span>
        <span class="content" [ngClass]="{'rejected': rejectDeploy, 'approved': !rejectDeploy}"
              *ngIf="!editable && stage.stageStatus =='APPROVED'">
          {{stage.updateAt | date: 'HH:mm'}} {{'批准'}} {{stage.updateBy}}
        </span>
        <span class="content" [ngClass]="{'rejected': rejectApprove, 'approved': !rejectApprove}"
              *ngIf="!editable && stage.stageStatus =='REJECTED'">
          {{stage.updateAt | date: 'HH:mm'}} {{'拒绝审批'}} {{stage.updateBy}}
        </span>
      </div>
    </div>
  `,
  styleUrls: ['./artifactory-stage-item.component.less'],
})
export class ArtifactoryStageItemComponent implements OnInit {
  // @Input() stageIndex;
  // @Input() stage: StageFlowItem;

  _stage: any;
  @Input() stageIndex;
  @Input() ClickstageIndex;
  @Input() errorArray;
  @Input() isNeedHighLight = false;

  @Input() set stage(s) {
    this._stage = {...s};
    this._stage.stageIndex = this.stageIndex;
  }

  get stage() {
    return this._stage;
  }

  @Output() removeAt$ = new EventEmitter();
  @Output() addAt$ = new EventEmitter();
  @Input() parent?: any[] = [];

  @Output() itemClick$ = new EventEmitter();

  @Input() editable = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  get signColor() {
    switch (this.stage.stageStatus) {
      case "APPROVED":
        return '#008000';
      case "TO_DEPLOY":
      case "TO_APPROVE":
        return '#FF8D1A';
      case "REJECTED":
        return '#D43030';
        case "RUNNING":
        return '#008000';
      case "PENDING":
      default:
        return '#A6A6A6';
    }
  }

  get selectable() {
    return this.editable || this.stage.stageStatus === 'TO_DEPLOY' || this.stage.stageStatus === 'TO_APPROVE' || this.stage.stageStatus === 'REJECTED';
  }

  get rejected() {
    return this.rejectDeploy || this.rejectApprove;
  }

  get rejectDeploy() {
    return this.stage.deployApproveResult === 'REJECTED';
  }

  get rejectApprove() {
    return this.stage.confirmApproveReuslt === 'REJECTED';
  }
}
