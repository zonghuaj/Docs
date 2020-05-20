import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { GatewayConfigEntity, ServiceConfigEntity } from '../../entities/traffic-config.entites';
import { AdminUiAngularServiceTrafficService } from '../../services/admin-ui-angular-service-traffic.service';
import { CacheService } from '@delon/cache';
import { ServiceManageService, ServiceEntity } from 'admin-ui-angular-common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'traffic-service-panel',
  template: `
    <nz-spin [nzSpinning]="loading">
      <traffic-service-panel-form #f [gateways]="gateways"
                                  [service]="service"
                                  [allPorts]="appPorts"
                                  [data]="traffic"
                                  (submit)="_submit($event)"></traffic-service-panel-form>
    </nz-spin>
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
export class ServiceTrafficPanelComponent implements OnInit {
  loading = false;

  @Input() service;
  traffic;
  appPorts;

  gateways: GatewayConfigEntity[] = [];

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private msg: NzMessageService,
    private cache: CacheService,
    private serviceManService: ServiceManageService,
    private trafficService: AdminUiAngularServiceTrafficService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getGateways();

    if (this.service) {
      this.getAppPorts();
      this.getTrafficInfo();
    }
  }

  getGateways() {
    this.trafficService.getGatewayList()
      .subscribe(res => {
        this.gateways = res.rows;
        this.cdr.detectChanges();
      }, err => {
      });
  }

  getAppPorts() {
    this.serviceManService.getServiceInfo(this.service.id.replace('s-', ''))
      .subscribe((se: ServiceEntity) => {
        this.appPorts = se.appPorts;
        this.cdr.detectChanges();
      });
  }

  getTrafficInfo() {
    this.trafficService.getTrafficInfo(this.service.name)
      .subscribe((res: any) => {
        if (res.id) {
          this.traffic = res;
          this.cdr.detectChanges();
        }
      }, err => {
        this.msg.error('获取信息失败');
        this.close();
      });
  }

  close(extra?): void {
    this.drawerRef.close(extra);
  }

  _submit(se: ServiceConfigEntity) {
    se.crossOrigin = JSON.stringify(se.crossOrigin);
    se.gray = JSON.stringify(se.gray);
    se.match = JSON.stringify(se.match);
    se.name = this.service.name;
    se.serviceName = this.service.name;

    se.tenantCode = this.cache.getNone('tenantId');
    se.projectCode = this.cache.getNone('projectCode');

    this.loading = true;
    if (this.traffic) {
      this.trafficService.updateTraffic(this.service.name, se)
        .subscribe(res => {
          this.msg.success('修改成功');
          this.close('success');
        }, err => {
          this.msg.error('修改失败');
        }, () => {
          this.loading = false;
        });
    } else {
      this.trafficService.createTraffic(this.service, se)
        .subscribe(res => {
          this.loading = false;
          this.msg.success('创建成功');
          this.close();
        }, err => {
          this.loading = false;
          this.msg.error('创建失败');
        });
    }
  }
}
