import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceManageService, VersionEntity} from "admin-ui-angular-common";
import {MpHeaderService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'version-create',
  template: `
    <nz-card>
      <version-form #versionF
                    (submit)="_submit($event)"></version-form>

      <div nz-row nzType="flex" nzJustify="center">
        <button nz-button nzType="default" type="default" class="pl-lg pr-lg"
                (click)="location.back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                [nzLoading]="loading"
                (click)="versionF.submitForm()">提交
        </button>
      </div>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceManageService]
})
export class VersionCreateComponent implements OnInit {
  serviceId: number;
  version: VersionEntity;

  loading: boolean;

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
    this.headerService.setTitle('创建版本');

    // should be like service/:serviceId/version/:versionId/edit
    this.serviceId = +this.route.snapshot.paramMap.get('serviceId');
  }

  _submit(ve: VersionEntity) {
    console.log("_submit....");
    ve = {...ve, serviceId: this.serviceId};

    this.loading = true;
    this.servManService.createVersion(this.serviceId, ve)
      .subscribe(res => {
        this.loading = false;
        this.msg.success('创建成功');
        this.router.navigate([`/service/${this.serviceId}/detail/info`]);
      }, (err) => {
        console.log(err);
        this.loading = false;
        this.msg.error('创建失败');
        this.cdr.detectChanges();
      });
  }
}
