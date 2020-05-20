import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceEntity, ServiceManageService} from "admin-ui-angular-common";
import {MpHeaderService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";
import {Location} from "@angular/common";

@Component({
  selector: 'service-create',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card [nzBordered]="false" [nzLoading]="detailLoading">
      <service-form #serviceF
                    [data]="service"
                    (submit)="_submit($event)"></service-form>

      <div nz-row nzType="flex" nzJustify="center">
        <button nz-button nzType="default" type="default" class="pl-lg pr-lg"
                (click)="location.back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                (click)="serviceF.submitForm()">提交
        </button>
      </div>
    </nz-card>
  `,
  providers: [ServiceManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceEditComponent implements OnInit {
  detailLoading: boolean;
  loading: boolean;

  serviceId: number;
  service: ServiceEntity;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private servManService: ServiceManageService,
    private headerService: MpHeaderService,
    private msg: NzMessageService,
    public location: Location
  ) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('编辑服务');

    this.serviceId = +this.route.snapshot.paramMap.get('serviceId');
    if (this.serviceId) {
      this.getServiceDetail(this.serviceId);
    }
  }

  getServiceDetail(id: number) {
    this.detailLoading = true;
    this.servManService.getServiceInfo(id)
      .subscribe((data: ServiceEntity) => {
        this.service = data;
        this.detailLoading = false;
        this.cdr.detectChanges();
      }, (err) => {
        this.msg.error('获取服务失败');
      });
  }

  _submit(newSe: ServiceEntity) {
    this.loading = true;
    this.servManService.editService(newSe)
      .subscribe(res => {
        this.msg.success('修改成功');
        this.location.back();
      }, (err) => {
        this.loading = false;
        this.msg.error('修改失败');
        this.cdr.detectChanges();
      });
  }
}
