import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef, ViewEncapsulation, Input, OnChanges,
} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {isNumber} from "util";

@Component({
  selector: 'dashboard-water-wave',
  template: `
    <div class="dashboard-water-wave__container">
      <g2-water-wave2
        [percent]="data.percent" [color]="data.color"
        height="100"></g2-water-wave2>
      <span class="dashboard-water-wave__desc">{{data.desc}}</span>

      <span class="dashboard-water-wave__name">{{data.name}}</span>
      <span class="dashboard-water-wave__value">{{getValue(data.percent)}}</span>
    </div>`,
  styles: [`
    .g2-water-wave__desc-percent {
      display: none;
    }

    .dashboard-water-wave__container {
      display: inline-block;
      position: relative;
      height: 130px;
    }

    .dashboard-water-wave__desc {
      display: block;
      text-align: center;
      height: 20px;
      line-height: 20px;
    }

    .dashboard-water-wave__name {
      position: absolute;
      top: 30px;
      left: 50%;
      color: #AAA;
      transform: translate(-50%, 0);
    }

    .dashboard-water-wave__value {
      position: absolute;
      top: 50px;
      left: 50%;
      font-size: 18px;
      font-weight: 600;
      color: #444;
      transform: translate(-50%, 0);
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DashboardWWaveComponent implements OnInit {
  loading = true;

  @Input() data: WWData;

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  getValue(p) {
    return isNumber(p) && p >= 0 ? p + '%' : '-';
  }

}

export interface WWData {
  name: string;
  percent: number;
  desc: string;
  color?: string;
}
