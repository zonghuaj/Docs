import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {TitleService} from "@delon/theme";
import {ServiceEntity, VersionEntity, ServiceManageService} from "admin-ui-angular-common";
import {VersionListEntity, VersionStatus} from "../../service-list/service-list.entities";
import {VersionStatusService} from "../../version-list/version-status.service";

@Component({
  selector: 'service-info',
  templateUrl: './service-info.component.html',
  providers: [ServiceManageService, VersionStatusService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceInfoComponent implements OnInit, OnDestroy {
  service: ServiceEntity;

  totalVer: number;
  versions: VersionEntity[];

  newestStatusList: VersionStatus[];

  get editServiceUrl() {
    return `/service/${this.service.id}/edit`;
  }

  get createVersionUrl() {
    return `/service/${this.service.id}/version/create`;
  }

  get cannotRemove() {
    return this.versions && this.versions.length > 0;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private servManageService: ServiceManageService,
    private vsStatusService: VersionStatusService) {
  }

  ngOnInit() {
    this.titleSrv.setTitle('服务详情');
    const sid = +this.route.parent.snapshot.paramMap.get('serviceId');
    this.getServiceDetail(sid);
    this.getVersions(sid);
  }

  ngOnDestroy(): void {
    this.vsStatusService.stopWatchingVStatus();
  }

  getServiceDetail(sid: number) {
    this.servManageService.getServiceInfo(sid)
      .subscribe((data: ServiceEntity) => {
        this.service = data;
        this.cdr.detectChanges();
      });
  }

  watchVersionStatus(id: number) {
    this.vsStatusService.startWatchingVStatus(id)
      .subscribe((vss: VersionStatus[]) => {
        this.newestStatusList = vss;
        this.cdr.detectChanges();
      });
  }

  getVersions(sid: number) {
    this.servManageService.getAllVersions(sid)
      .subscribe((data: VersionListEntity) => {
        this.totalVer = data.count;
        this.versions = data.rows;
        this.cdr.detectChanges();

        const vids = this.versions.map(v => v.id);
        this.watchVersionStatus(sid);
      });
  }

  onVersionChanged(type: string) {
    if (type === 'delete') {
      this.getVersions(this.service.id);
    }
  }

  confirmDelete() {
    this.modalSrv.confirm({
      nzTitle: '删除服务',
      nzContent: '一旦删除将无法恢复，确定删除当前服务吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteService(),
      nzCancelText: '取消',
    });
  }

  deleteService() {
    this.servManageService.deleteService(this.service.id)
      .subscribe(() => {
        this.router.navigateByUrl('/service/all');
      }, (err) => {
        this.msg.error('删除失败');
      });
  }
}
