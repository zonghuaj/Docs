import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef, Input,
} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {AlertEntity} from "admin-ui-angular-alert-all";

@Component({
  selector: 'dashboard-alert-list',
  template: `
    <div class="c">
      <ul>
        <li class="th">
          <span class="d">告警内容</span>
          <span class="s">状态</span>
        </li>
        <li *ngFor="let d of data">
          <span class="d">{{d.summary}}</span>
          <span class="s">{{d.status === 0 ? '未处理' : d.status === 1 ? '处理中' : '已处理'}}</span>
        </li>
      </ul>
    </div>`,
  styles: [`
    .c {
      height: 130px;
    }

    ul, li {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .th {
      font-weight: 600;
    }

    .d {

    }

    .s {
      float: right;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAlertListComponent implements OnInit {
  @Input() data: AlertEntity[] = [];

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }
}
