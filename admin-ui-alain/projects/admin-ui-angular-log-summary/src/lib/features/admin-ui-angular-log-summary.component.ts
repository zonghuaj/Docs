import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SummaryLog, SummaryLogListEntity } from '../entities/log-summary.entities';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { AdminUiAngularLogSummaryService } from '../services/admin-ui-angular-log-summary.service';

@Component({
  selector: 'admin-ui-angular-log-summary-root',
  templateUrl: './admin-ui-angular-log-summary.component.html',
  styleUrls: ['./admin-ui-angular-log-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUiAngularLogSummaryComponent implements OnInit, AfterViewInit {

  page: STPage = {
    front: false,
  };
  q: any = {
    pi: 1,
    ps: 10,
    startDate: '',
    endDate: '',
    serv: null,
    keyword: ''
  };
  totalCount: number;
  data: SummaryLog[] = [];

  loading = false;
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '时间', index: 'timestamp', render: 'timeT', width: '100px' },
    { title: '日志', index: 'content', render: 'contentT' },
    { title: '服务', index: 'service', render: 'serviceT' },
    { title: '实例', index: 'pod', render: 'podT' },
  ];

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    return differenceInCalendarDays(current, today) > 0 ||
      differenceInCalendarDays(current, addDays(today, -7)) < 0;
  }

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private logsumService: AdminUiAngularLogSummaryService
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.q.serv = params.get('name');
      this.cdr.detectChanges();
    });
  }

  getData() {
    this.loading = true;

    const { pi, ps, startDate, endDate, serv, keyword } = this.q;
    const sname = (!serv || serv === '全部') ? '' : serv;
    const kwd = !keyword ? '' : keyword;
    const start = !startDate ? '' : format(startDate, 'YYYY-MM-DD HH:mm:ss');
    const end = !endDate ? '' : format(endDate, 'YYYY-MM-DD HH:mm:ss');

    this.logsumService.getFullLogData(pi, ps, start, end, sname, kwd)
      .subscribe((data: SummaryLogListEntity) => {
        this.data = data.rows;
        this.totalCount = data.count;
        this.loading = false;
        this.cdr.detectChanges();
      }, () => {
        this.loading = false;
        this.msg.error('查询失败');
        this.cdr.detectChanges();
      });
  }

  submitFilter() {
    this.getData();
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'filter':
        this.getData();
        break;
      case 'pi':
        this.q.pi = e.pi;
        this.getData();
        break;
    }
  }

  onDatePicked(result: Date[]) {
    this.q.startDate = result[0];
    this.q.endDate = result[1];
  }

  reset() {
    this.q.startDate = '';
    this.q.endDate = '';
    this.q.serv = null;
    this.q.keyword = '';
    this.q.pi = 1;
  }

  ngAfterViewInit(): void {
    this.makeDatepickerFitToFullWidth();
  }

  // <nz-range-picker> contains a <span> label to hold the inner input,
  // and this <span> cannot be reached for now,
  // so i manipulate the dom and make this one as 'width: 100%'
  makeDatepickerFitToFullWidth() {
    const insideSpans = window.document.querySelectorAll('admin-ui-angular-log-summary-root nz-range-picker .ant-calendar-picker');
    insideSpans.forEach((el: any) => el.style.width = '100%');
  }

}
