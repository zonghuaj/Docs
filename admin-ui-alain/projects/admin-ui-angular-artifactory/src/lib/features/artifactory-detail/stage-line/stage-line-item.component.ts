import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {StageFlowItem} from "../../artifactory.entities";

@Component({
  selector: 'af-stage-line-item',
  template: `
    <div class="item">
      <ng-container [ngSwitch]="sign">
        <i *ngSwitchCase="'PENDING'" nz-icon nzType="clock-circle" nzTheme="outline" style="color: gray;"></i>
        <i *ngSwitchCase="'APPROVED'" nz-icon nzType="check-circle" nzTheme="fill" style="color: #43CF7C"></i>
        <i *ngSwitchCase="'REJECTED'" nz-icon nzType="stop" nzTheme="outline" style="color: #D43030"></i>
        <i *ngSwitchCase="'TO_DEPLOY'" nz-icon nzType="question-circle" nzTheme="outline" style="color: #d47400"></i>
        <i *ngSwitchCase="'TO_APPROVE'" nz-icon nzType="question-circle" nzTheme="outline" style="color: #d47400"></i>
        <i *ngSwitchCase="'RUNNING'" nz-icon nzType="sync" [nzSpin]="true" nzTheme="outline" style="color: #43CF7C"></i>
        {{stage.name}}
      </ng-container>
    </div>
  `,
  styles: [`
    .item {
      padding: 4px;
      font-size: 16px;
      display: inline-block;
      margin-top: 4px;
    }
  `]
})
export class StageLineItemComponent implements OnInit {
  @Input() stage: StageFlowItem;

  get sign() {
    return this.stage.stageStatus;
  }

  ngOnInit(): void {
  }
}
