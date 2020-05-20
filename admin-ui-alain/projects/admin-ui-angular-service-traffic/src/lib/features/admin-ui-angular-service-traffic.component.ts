import { Component, OnInit, ViewChild } from '@angular/core';
import { ACTIONS } from '../entities/actions';
import { TrafficGraphComponent } from './traffic-graph/traffic-graph.component';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { AdminUiAngularServiceTrafficService } from '../services/admin-ui-angular-service-traffic.service';
import { GatewayTrafficPanelComponent } from './gateway-panel/gateway-traffic-panel.component';
import { ServiceTrafficPanelComponent } from './service-panel/service-traffic-panel.component';
import { VersionTrafficPanelComponent } from './version-panel/version-traffic-panel.component';
@Component({
  selector: 'admin-ui-angular-service-traffic-root',
  templateUrl: './admin-ui-angular-service-traffic.component.html',
  styleUrls: ['./admin-ui-angular-service-traffic.component.less'],
})
export class AdminUiAngularServiceTrafficComponent implements OnInit {

  readonly timepick = [
    { label: '过去 1m', val: '60s' },
    { label: '过去 5m', val: '300s' },
    { label: '过去 10m', val: '600s' },
    { label: '过去 30m', val: '1800s' },
    { label: '过去 1h', val: '3600s' },
    { label: '过去 3h', val: '10800s' },
    { label: '过去 6h', val: '21600s' },
  ];

  loading: boolean;

  duration = this.timepick[0].val;

  @ViewChild('graph') trafficGraph: TrafficGraphComponent;

  showingLine: any;

  linePanelVisibility = false;

  constructor(
    private msg: NzMessageService,
    private drawerService: NzDrawerService,
    private trafficService: AdminUiAngularServiceTrafficService) {
  }

  ngOnInit(): void {
    this.getTrafficGraphData();
  }

  onTimeChanged(e) {
    this.getTrafficGraphData();
  }

  refresh() {
    this.getTrafficGraphData();
  }

  getTrafficGraphData() {
    // setTimeout(() => this.trafficGraph.draw(MOCK));

    this.showLinePanel(false);

    this.loading = true;
    this.trafficService.getTrafficGraph(this.duration)
      .subscribe(res => {
        this.loading = false;
        this.trafficGraph.draw(res);
      }, err => {
        this.msg.error('获取数据失败');
        this.loading = false;
      });
  }

  addGateway() {
    this.showGatewayPanel(0);
  }

  addOutterServ() {
    // this.showGatewayPanel(0);
  }

  onGraphSelected(e) {
    switch (e.action) {
      case ACTIONS.GATEWAY:
        this.showLinePanel(false);
        const gid = e.obj.id; // 'g-123', need to remove 'g-'
        this.showGatewayPanel(gid.slice(2, gid.length));
        break;
      case ACTIONS.SERVICE:
        this.showLinePanel(false);
        this.showServicePanel(e.obj);
        break;
      case ACTIONS.VERSION:
        this.showVersionPanel(e.obj);
        break;
      case ACTIONS.LINE:
        this.showingLine = e.obj;
        this.showLinePanel(true);
        break;
    }
  }

  showGatewayPanel(id?: number): void {
    const drawerRef = this.drawerService.create<GatewayTrafficPanelComponent, { id: number }, string>({
      nzTitle: '网关配置',
      nzWidth: '400',
      nzContent: GatewayTrafficPanelComponent,
      nzContentParams: { id }
    });

    drawerRef.afterClose.subscribe(data => {
      if (typeof data === 'string') {
        // this.value = data;
      }
    });
  }

  showServicePanel(service): void {
    const drawerRef = this.drawerService.create<ServiceTrafficPanelComponent, { service: any }, string>({
      nzTitle: '服务配置',
      nzWidth: '400',
      nzContent: ServiceTrafficPanelComponent,
      nzContentParams: { service }
    });

    drawerRef.afterClose.subscribe(data => {
      if (typeof data === 'string') {
        // this.value = data;
      }
    });
  }

  showVersionPanel(version): void {
    const drawerRef = this.drawerService.create<VersionTrafficPanelComponent, { version: any }, string>({
      nzTitle: '版本配置',
      nzWidth: '400',
      nzContent: VersionTrafficPanelComponent,
      nzContentParams: { version }
    });

    drawerRef.afterClose.subscribe(data => {
      if (typeof data === 'string') {
        // this.value = data;
      }
    });
  }

  showLinePanel(show?: boolean) {
    this.linePanelVisibility = show;
  }

}
