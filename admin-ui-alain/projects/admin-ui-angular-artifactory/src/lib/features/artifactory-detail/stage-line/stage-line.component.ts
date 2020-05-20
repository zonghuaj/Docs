import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,} from '@angular/core';
import {StageFlowItem} from "../../artifactory.entities";

@Component({
  selector: 'af-stage-line',
  template: `
    <div style="display: inline-block; width: 100%">
      <af-stage-line-item class="stage-item" *ngFor="let s of statusList" [stage]="s"></af-stage-line-item>
    </div>
  `,
  styles: [`
    .stage-item:not(:last-child):after {
      background-image: url('./assets/images/arrow-right.png');
      background-size: 34px 12px;
      display: inline-block;
      position: relative;
      width: 34px;
      height: 12px;
      content: "";
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageLineComponent {
  @Input() statusList: StageFlowItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {
  }
}
