import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { AdminUiAngularServiceTrafficService } from '../../services/admin-ui-angular-service-traffic.service';
import { VersionTrafficConfigEntity } from '../../entities/traffic-config.entites';

@Component({
  selector: 'traffic-service-panel',
  template: `
    <version-traffic-panel-form #f (submit)="_submit($event)" [data]="versionTraffic"></version-traffic-panel-form>

    <div nz-row nzType="flex" nzJustify="center">
      <button nz-button nzType="default" type="submit" class="pl-lg pr-lg"
              (click)="close()">关闭
      </button>
      <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
              [nzLoading]="loading"
              (click)="f.submitForm()">提交
      </button>
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionTrafficPanelComponent implements OnInit {
  @Input() id = 0;

  @Input() version;

  loading = false;

  versionTraffic;

  constructor(
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    private trafficService: AdminUiAngularServiceTrafficService) {
  }

  ngOnInit(): void {
    if (this.version) {
      this.trafficService.getVersionTrafficInfo(this.version.servName, this.version.name)
        .subscribe((res: any) => {
          this.versionTraffic = res;
          this.cdr.detectChanges();
        });
    }
  }

  close(extra?): void {
    this.drawerRef.close(extra);
  }

  _submit(vt: VersionTrafficConfigEntity) {
    if (vt.protectEnable && (vt.maxConcurrent === '' || vt.overtime === '')) return;
    if (vt.monitorEnable && (vt.monitorInterval === '' || vt.errorTimes === '' || vt.minAvailableNum === '')) return;

    this.loading = true;
    if (vt.id > 0) {
      this.trafficService.updateVersionTrafficInfo(this.version.servName, this.version.name, vt)
        .subscribe(res => {
          this.msg.success('修改成功');
          this.close();
        }, err => {
          console.log(err);
          this.msg.error('修改失败');
          this.loading = false;
          this.cdr.detectChanges();
        });
    } else {
      this.trafficService.createVersionTrafficInfo(this.version.servName, this.version.name, vt)
        .subscribe(res => {
          this.msg.success('创建成功');
          this.close('success');
        }, err => {
          this.msg.error('创建失败');
          this.loading = false;
          this.cdr.detectChanges();
        });
    }
  }
}
