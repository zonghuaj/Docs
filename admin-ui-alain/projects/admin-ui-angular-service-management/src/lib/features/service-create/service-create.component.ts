import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceEntity, ServiceManageService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";
import {MpHeaderService} from "admin-ui-angular-common";

@Component({
  selector: 'service-create',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card>
      <service-form #serviceF (submit)="_submit($event)"></service-form>

      <div nz-row nzType="flex" nzJustify="center">
        <button nz-button nzType="default" type="default" class="pl-lg pr-lg"
                (click)="location.back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                [nzLoading]="loading"
                (click)="serviceF.submitForm()">提交
        </button>
      </div>
    </nz-card>
  `,
  providers: [ServiceManageService],
})
export class ServiceCreateComponent implements OnInit {
  loading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servManService: ServiceManageService,
    private msg: NzMessageService,
    private headerService: MpHeaderService,
    public location: Location
  ) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('创建服务');
  }

  _submit(se: ServiceEntity) {
    this.loading = true;

    this.servManService.createService(se)
      .subscribe(res => {
        this.msg.success('服务创建成功');
        this.router.navigate([`/service/${res.id}/detail/info`]);
      }, (err) => {
        this.loading = false;
        this.msg.error('创建失败');
      });
  }
}
