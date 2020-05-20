import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ServiceListEntity, ServiceEntity} from '../../entities/service-list.entities';
import { ServiceManageService } from '../../services/service-manage.service';

@Component({
  selector: 'service-select',
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
export class ServiceSelectComponent implements OnInit {
  val = 0;
  @Input() name: string = null;

  servs: ServiceEntity[];
  servNames: string[];

  @Output() select$: EventEmitter<ServiceEntity> = new EventEmitter<ServiceEntity>();

  constructor(
    private servManService: ServiceManageService,
    private cdr: ChangeDetectorRef) {
    this.servNames = ['全部'];
  }

  onSelected() {
    const sev = this.val <= 0 ? {} as ServiceEntity : this.servs[this.val - 1];
    this.select$.emit(sev);
  }

  ngOnInit(): void {
    this.getAllServList();
  }

  getAllServList() {
    this.servManService.getAllServices()
      .subscribe((data: ServiceListEntity) => this.makeServiceListSelect(data));
  }

  makeServiceListSelect(data: ServiceListEntity) {
    if (data && data.rows) {
      this.servs = data.rows;
      this.servs.forEach((s: ServiceEntity) => {
        this.servNames.push(s.serviceName);
      });

      if (this.name) {
        const index = this.servNames.indexOf(this.name);
        this.val = index < 0 ? 0 : index;
      }
      this.cdr.detectChanges();
    }
  }
}
