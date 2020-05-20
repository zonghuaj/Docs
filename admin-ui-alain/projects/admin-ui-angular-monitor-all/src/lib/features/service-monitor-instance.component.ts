import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
import { CacheService } from '@delon/cache';
import {
  ZGContainer, ServiceEntity, VersionEntity,
  byteParser, cpuCountParser, milliSecParser, percentageParser2
} from 'admin-ui-angular-common';
import { QParams } from './admin-ui-angular-monitor-all.component';
@Component({
  selector: 'service-monitor-instance',
  template: `
    <div nz-row nzGutter="16">
      <zgrafna-container nz-col *ngFor="let d of items;first as isFirst"
                         [style.margin-top.px]="8"
                         [nzSpan]="d.span"
                         [sac]="d">
      </zgrafna-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceMonitorInstanceComponent {
  readonly _items: ZGContainer[] = [
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
      },
      title: '服务实例 内存使用量',
      sources: [{
        qstring: `sort_desc(sum (container_memory_working_set_bytes{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}) by (pod_name))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        decimal: '1',
        parser: cpuCountParser,
      },
      title: '服务实例 CPU使用量(1分钟)',
      sources: [{
        qstring: `sort_desc(sum (rate (container_cpu_usage_seconds_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
      },
      title: '服务实例 网络使用',
      sources: [{
        qstring: `sum (rate (container_network_receive_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name)`,
        step: '',
        opt: {
          // alias: '接收',
          // color: '#7EB26D'
        }
      },
      {
        qstring: `- sum (rate (container_network_transmit_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name)`,
        step: '',
        opt: {
          // alias: '发送',
          // color: '#EAB834'
        }
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      // unit: {
      //   parser: byteParser,
      // },
      title: '服务实例 QPS 操作每秒',
      sources: [{
        qstring: `round(sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$"}[5m])), 0.001)`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: percentageParser2,
      },
      title: '服务实例 成功率',
      sources: [{
        qstring: `sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$",response_code!~"5.*"}[5m])) / sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$"}[5m]))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: milliSecParser,
      },
      title: '服务实例 响应时间',
      sources: [{
        qstring: `histogram_quantile(0.90, sum(irate(istio_request_duration_seconds_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le,destination_workload))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
      },
      title: '服务实例 请求大小',
      sources: [{
        qstring: `histogram_quantile(0.90, sum(irate(istio_request_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
      },
      title: '服务实例 响应大小',
      sources: [{
        qstring: `histogram_quantile(0.90, sum(irate(istio_response_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le))`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
  ];
  items: ZGContainer[] = [];

  @Input() set params(p: QParams) {
    if (!p) return;

    this.setData(p);
  }

  constructor(
    private cache: CacheService,
    private cdr: ChangeDetectorRef) {
  }

  setData(p: QParams) {
    if (p.serv.serviceName) {
      this._items.forEach(itm => itm.span = 12);
      this._items[0].sources[0].qstring = this.getMemoryUsageStr(p.serv, p.vers);
      this._items[1].sources[0].qstring = this.getCPUUsageStr(p.serv, p.vers);
      this._items[2].sources[0].qstring = this.getTrafficStr1(p.serv, p.vers);
      this._items[2].sources[1].qstring = this.getTrafficStr2(p.serv, p.vers);
      this._items[3].sources[0].qstring = this.getQpsStr(p.serv, p.vers);
      this._items[4].sources[0].qstring = this.getSuccessRateStr(p.serv, p.vers);
      this._items[5].sources[0].qstring = this.getResTimeStr(p.serv, p.vers);
      this._items[6].sources[0].qstring = this.getReqSizeStr(p.serv, p.vers);
      this._items[7].sources[0].qstring = this.getResSizeStr(p.serv, p.vers);
    } else {
      this._items.forEach(itm => itm.span = 24);
      this._items[0].sources[0].qstring = `sort_desc(sum (container_memory_working_set_bytes{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}) by (pod_name))`;
      this._items[1].sources[0].qstring = `sort_desc(sum (rate (container_cpu_usage_seconds_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name))`;
      this._items[2].sources[0].qstring = `sum (rate (container_network_receive_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name)`;
      this._items[2].sources[1].qstring = `- sum (rate (container_network_transmit_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[5m])) by (pod_name)`;
      this._items[3].sources[0].qstring = `round(sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$"}[5m])), 0.001)`;
      this._items[4].sources[0].qstring = `sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$",response_code!~"5.*"}[5m])) / sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$"}[5m]))`;
      this._items[5].sources[0].qstring = `histogram_quantile(0.90, sum(irate(istio_request_duration_seconds_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le,destination_workload))`;
      this._items[6].sources[0].qstring = `histogram_quantile(0.90, sum(irate(istio_request_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le))`;
      this._items[7].sources[0].qstring = `histogram_quantile(0.90, sum(irate(istio_response_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"}[5m])) by (le))`;
    }
    this.items = this._items.map(it => ({ ...it, times: p.times }));
    this.cdr.detectChanges();
  }

  get namespace() {
    return this.cache.getNone('tenantId') + '-' + this.cache.getNone('projectCode');
  }

  getMemoryUsageStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,pod_name=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `sum (container_memory_working_set_bytes{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"${instance}}) by (pod_name)`;
    return str;
  }

  getCPUUsageStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,pod_name=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `sum (rate (container_cpu_usage_seconds_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"${instance}}[5m])) by (pod_name)`;
    return str;
  }

  getTrafficStr1(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,pod_name=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `sum (rate (container_network_receive_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"${instance}}[5m])) by (pod_name)`;
    return str;
  }

  getTrafficStr2(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,pod_name=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `- sum (rate (container_network_transmit_bytes_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"${instance}}[5m])) by (pod_name)`;
    return str;
  }

  getQpsStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,destination_workload=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `round(sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace="${this.namespace}"${instance}}[5m])) by (destination_workload), 0.001)`;
    return str;
  }

  getSuccessRateStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,destination_workload=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace="${this.namespace}"${instance},response_code!~"5.*"}[5m])) by (destination_workload) / sum(irate(istio_requests_total{reporter="destination",destination_workload_namespace="${this.namespace}"${instance}}[5m])) by (destination_workload)`;
    return str;
  }

  getResTimeStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,destination_workload=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `histogram_quantile(0.90, sum(irate(istio_request_duration_seconds_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"${instance}}[5m])) by (le,destination_workload))`;
    return str;
  }

  getReqSizeStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,destination_workload=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `histogram_quantile(0.90, sum(irate(istio_request_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"${instance}}[5m])) by (le,destination_workload))`;
    return str;
  }

  getResSizeStr(serv: ServiceEntity, ver: VersionEntity) {
    let instance = '';
    if (serv.serviceName) {
      let pod = '';
      if (ver.version) {
        pod = `-${ver.version}`;
      }
      instance = `,destination_workload=~"${serv.serviceName}${pod}.*"`;
    }

    const str = `histogram_quantile(0.90, sum(irate(istio_response_bytes_bucket{reporter="destination", destination_workload_namespace=~"^${this.namespace}$"${instance}}[5m])) by (le,destination_workload))`;
    return str;
  }
}

