import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {subDays, subHours, subMonths, subWeeks} from "date-fns";

@Component({
  selector: 'project-monitor',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card nzTitle="整体使用资源概览" [nzExtra]="timepicker">
      <project-monitor-graph [times]="times"></project-monitor-graph>
      <nz-divider nzType="horizontal" class="mt-md"></nz-divider>
      <project-monitor-plist [times]="times"></project-monitor-plist>
    </nz-card>

    <ng-template #timepicker>
      <nz-range-picker nzShowTime nzFormat="yy-MM-dd HH:mm:ss"
                       name="times"
                       [(ngModel)]="times"
                       [nzRanges]="ranges"></nz-range-picker>
    </ng-template>
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMonitorComponent implements OnInit {

  times: Date[] = [
    subDays(new Date(), 1),
    new Date()
  ];

  ranges = {
    '最近1小时': [subHours(new Date(), 1), new Date()],
    '最近1天': [subDays(new Date(), 1), new Date()],
    '最近1周': [subWeeks(new Date(), 1), new Date()],
    '最近1月': [subMonths(new Date(), 1), new Date()],
  };

  constructor(private headerService: MpHeaderService) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('资源监控');
  }
}
