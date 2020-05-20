import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {VersionEntity, ServiceManageService} from "admin-ui-angular-common";
import {MpHeaderService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'version-edit',
  template: `
    <nz-card [nzLoading]="detailLoading">
      <version-form #versionF
                    [data]="version"
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
  providers: [ServiceManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionEditComponent {
  detailLoading: boolean;
  loading: boolean;

  version: VersionEntity;

  serviceId: number;
  versionId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private servManService: ServiceManageService,
    private headerService: MpHeaderService,
    private msg: NzMessageService,
    public location: Location) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('编辑版本');

    // should be like service/:serviceId/version/:versionId/edit
    this.serviceId = +this.route.snapshot.paramMap.get('serviceId');
    this.versionId = +this.route.snapshot.paramMap.get('versionId');

    if (this.versionId) {
      this.getVersionDetail();
    }
  }

  getVersionDetail() {
    this.detailLoading = true;
    this.servManService.getVersionInfo(this.serviceId, this.versionId)
      .subscribe((ve: VersionEntity) => {
        this.detailLoading = false;
        this.version = ve;
        this.cdr.detectChanges();
      }, (err) => {
        this.msg.error('获取版本失败');
      });
  }

  _submit(newVe: VersionEntity) {
    this.loading = true;
    this.servManService.editVersion(this.serviceId, this.versionId, newVe)
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
