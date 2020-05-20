import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output, SimpleChanges
} from '@angular/core';
import { AdminUiAngularServiceTraceService } from '../../services/admin-ui-angular-service-trace.service';
@Component({
  selector: 'trace-instance-select',
  template: `
    <nz-select
      class="ellipsis"
      nzShowSearch
      nzAllowClear
      nzPlaceHolder="请选择实例"
      [(ngModel)]="val"
      (ngModelChange)="onSelected()"
      style="width: 200px"
    >
      <nz-option *ngFor="let s of instanceNames; let idx = index"
                 [nzLabel]="s" [nzValue]="idx"></nz-option>
    </nz-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceInstanceSelectComponent implements OnChanges {
  @Input() serviceId: number;
  @Input() startTime: Date;
  @Input() endTime: Date;

  instanceNames: string[];
  instances: { key: string, label: string }[];

  val = 0;

  @Output() select$: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private servTraceService: AdminUiAngularServiceTraceService,
    private cdr: ChangeDetectorRef) {
    this.instanceNames = ['全部'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.serviceId || !this.startTime || !this.endTime) {
      this.instanceNames = ['全部'];
      this.cdr.detectChanges();
      return;
    }

    this.getInstanceList(this.serviceId, this.startTime, this.endTime);
  }

  onSelected() {
    const ist = this.val <= 0 ? {} : this.instances[this.val - 1];
    this.select$.emit(ist);
  }

  getInstanceList(sid: number, start: Date, end: Date) {
    this.servTraceService.getTracedInstance(sid, start, end)
      .subscribe(res => {
        this.instances = res.data.instanceId;

        this.instances.forEach((i: any) => {
          this.instanceNames.push(i.label);
        });

        this.cdr.detectChanges();
      });
  }
}
