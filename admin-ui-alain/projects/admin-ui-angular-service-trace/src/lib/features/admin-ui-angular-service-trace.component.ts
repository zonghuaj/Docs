import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AdminUiAngularServiceTraceService } from '../services/admin-ui-angular-service-trace.service';
import { ServTrace } from '../entities/service-trace.entities';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TraceSpanDetailComponent } from './trace-span-detail/trace-span-detail.component';
import { subDays } from 'date-fns';

@Component({
  selector: 'admin-ui-angular-service-trace-root',
  templateUrl: './admin-ui-angular-service-trace.component.html',
  styleUrls: ['./admin-ui-angular-service-trace.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUiAngularServiceTraceComponent implements OnInit, AfterViewInit {

  filterExpand = false;
  showType = 'L';

  listLoading = false;
  detailLoading = false;

  q = {
    serviceId: '',
    instanceId: '',
    state: 'ALL',
    times: [
      new Date(subDays(new Date(), 1)),
      new Date()
    ],
    endPoint: '',
    traceId: '',
    maxDur: null, // duration max
    minDur: null, // duration min
    pi: 1,
    ps: 10,
    timeType: 'BY_DURATION', // duration or startTime
  };

  current: ServTrace;
  traceList: ServTrace[] = [];
  total: number;
  spans: any[] = [];

  selectedTraceId: string;

  constructor(
    private modalService: NzModalService,
    private traceService: AdminUiAngularServiceTraceService,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getDatas();
  }

  getDatas() {
    const {
      serviceId, instanceId, state,
      endPoint, traceId, minDur, maxDur, pi, ps, timeType
    } = this.q;
    const start = this.q.times[0];
    const end = this.q.times[1];

    this.listLoading = true;
    this.traceService.getTraceList(
      serviceId, instanceId, state, endPoint, traceId,
      minDur, maxDur, start, end, pi, ps, timeType
    ).subscribe((res: any) => {
      this.listLoading = false;
      this.total = res.total;
      this.traceList = res.data;
      this.cdr.detectChanges();
    }, () => {
      this.listLoading = false;
      this.msg.error('列表获取失败');
      this.cdr.detectChanges();
    });
  }

  onPageChanged(pi: number) {
    if (this.total <= 10) return;

    this.getDatas();
  }

  selectTraceItem(item: ServTrace) {
    if (this.current === item) return;

    this.current = item;
    if (item) { // empty
      const traceIds = this.current.traceIds;
      if (traceIds && traceIds.length > 0) {
        this.selectedTraceId = this.current.traceIds[0];
      }
      this.getTraceDetail();
    } else {
      this.spans = [];
      this.cdr.detectChanges();
    }
  }

  getTraceDetail() {
    this.detailLoading = true;
    this.traceService.getTraceDetail(this.selectedTraceId)
      .subscribe((res: any) => {
        this.detailLoading = false;
        res._traceId = this.selectedTraceId;
        this.spans = res;
        this.cdr.detectChanges();
      }, () => {
        this.detailLoading = false;
        this.msg.error('获取详情失败');
      });
  }

  submitFilter() {
    this.getDatas();
  }

  onDetailClicked(detail) {
    this.modalService.create({
      nzTitle: '跨度详情',
      nzContent: TraceSpanDetailComponent,
      nzComponentParams: { currentSpan: detail },
      nzFooter: null
    });

    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // no better idea
    document.querySelector('.small-simple-page input')
      .setAttribute('size', '1');
  }
}
