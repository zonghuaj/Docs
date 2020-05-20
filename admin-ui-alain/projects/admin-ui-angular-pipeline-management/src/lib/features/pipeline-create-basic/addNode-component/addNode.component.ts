import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'addNode',
  template: `
    <div class="outter" >
      <a class="add-btn-top noselect" *ngIf="editable" (click)="addAt$.emit(stageIndex)">+</a>
      <a class="add-btn-bottom noselect" *ngIf="editable" (click)="addAt$.emit(stageIndex + 1)">+</a>
      <a class="del-btn noselect" *ngIf="editable && parent.length > 1" (click)="removeAt$.emit(stageIndex)">-</a>
      <i nz-icon [nzType]="'plus-circle'" class="plus" (click)="addAt$.emit(stageIndex)"></i>
      <i nz-icon [nzType]="'right'" class="right" *ngIf="stageIndex+1 != parent.length"></i>
      <i nz-icon [nzType]="'delete'" class="delete" *ngIf="editable && parent.length > 1" (click)="removeAt$.emit(stageIndex)"></i>
      <div class="header">
          <span>{{_stage.title}}</span>
      </div>
      <div class="box" [ngClass]="{'node_highlight':ClickstageIndex === stageIndex,'node_error_highlight':errorArray.includes(stageIndex)}" [ngStyle]="{'cursor': selectable ? 'pointer': 'default'}" (click)="_stage.stageIndex = stageIndex;itemClick$.emit(_stage)">
        <span class="title">{{_stage.instance.name}}</span><!--stage.name-->
      </div>
    </div>
  `,
  styleUrls: ['./addNode.component.less'],
})
export class AddNodeComponent implements OnInit {

  _stage : any;
  @Input() stageIndex;
  @Input() ClickstageIndex;
  @Input() errorArray;
  //@Input() stage: StageFlowItem;

  @Input() set stage(s) {
    this._stage = {...s};
    this._stage.stageIndex = this.stageIndex;
  }

  get stage() {
    return this._stage;
  }


  //@Input() stage: any ;
  @Output() removeAt$ = new EventEmitter();
  @Output() addAt$ = new EventEmitter();
  @Input() parent?: any[] = [];

  @Output() itemClick$ = new EventEmitter();

  @Input() editable = true;

  @Input() isNeedHighLight = false;

  constructor() {
    console.log(this);
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
