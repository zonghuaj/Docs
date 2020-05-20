import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef, Input,
} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'dashboard-z-list',
  template: `
    <ul>
      <li nz-row *ngFor="let d of data; let i = index">
        <span nz-col nzSpan="2" class="i text-left">{{i + 1}}</span>
        <span nz-col nzSpan="16" class="n ell">{{d.name}}</span>
        <span nz-col nzSpan="6" class="v ell text-right float-right">{{makeValue(d.value)}}</span>
      </li>
    </ul>`,
  styles: [`
    ul, li {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .i {
      display: inline-block;
      width: 24px;
      text-align: center;
    }

    .n {
      font-weight: 600;
    }

    .v {
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardZListComponent implements OnInit {
  @Input() data: ZData[] = [];
  @Input() isPercent = false;

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  makeValue(_val) {
    let val = parseFloat(_val);
    if (isNaN(val)) {
      return '-';
    } else {
      if (this.isPercent) {
        return Number((val * 100).toFixed(2)) + '%';
      } else {
        return Number(val.toFixed(4));
      }
    }
  }
}

export interface ZData {
  name: string;
  value: number;
  desc?: string;
}
