import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges
} from '@angular/core';
import { AdminUiAngularServiceTraceService } from '../../services/admin-ui-angular-service-trace.service';

@Component({
  selector: 'trace-service-select',
  template: `
    <nz-select
      nzShowSearch
      nzAllowClear
      nzPlaceHolder="请选择服务"
      [(ngModel)]="val"
      (ngModelChange)="onSelected()"
      style="width: 100%"
    >
      <nz-option *ngFor="let s of servNames; let idx = index"
                 [nzLabel]="s" [nzValue]="idx"></nz-option>
    </nz-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceServiceSelectComponent implements OnChanges {
  val = 0;

  servs: {
    key: string;
    label: string;
  }[];
  servNames: string[];

  @Input() startTime: Date;
  @Input() endTime: Date;

  @Output() select$: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private servTraceService: AdminUiAngularServiceTraceService,
    private cdr: ChangeDetectorRef) {
    this.servNames = ['全部'];
  }

  onSelected() {
    const serv = this.val <= 0 ? {} : this.servs[this.val - 1];
    this.select$.emit(serv);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.startTime || !this.endTime) {
      this.servNames = ['全部'];
      this.cdr.detectChanges();
      return;
    }

    this.getAllServList(this.startTime, this.endTime);
  }

  getAllServList(start: Date, end: Date) {
    this.servTraceService.getTracedService(start, end)
      .subscribe(res => {
        this.servs = res.data.services;
        this.servs.forEach(s => {
          this.servNames.push(s.label);
        });

        this.cdr.detectChanges();
      });
  }
}
