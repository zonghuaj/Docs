import {Component, OnInit, ViewChild, ChangeDetectorRef,} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {_HttpClient, TitleService, ModalHelper} from '@delon/theme';
import {EChartOption} from 'echarts';
import {ServiceMonitorService} from './service-monitor.service';
import {MonitorResult} from './service-monitor.entities';
import {NzMessageService} from 'ng-zorro-antd';
import {of, zip} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {format} from "date-fns";
import {ServiceEntity, VersionEntity, VersionListEntity, ServiceManageService} from "admin-ui-angular-common";
import {byteParser} from "admin-ui-angular-common";
import {AutoscalerEditComponent} from "admin-ui-angular-service-autoscaler";

@Component({
  selector: 'service-console',
  templateUrl: './service-monitor.component.html',
  styleUrls: ['./service-monitor.component.less'],
  providers: [ServiceManageService, ServiceMonitorService]
})
export class ServiceMonitorComponent implements OnInit {
  servId: number;
  chartTitle = '';

  cpuChartOpt: EChartOption;
  memChartOpt: EChartOption;

  url = '';
  params: any = {name: ''};

  versions = [];

  constructor(
    private http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private service: ServiceMonitorService,
    private titleSrv: TitleService,
    private cdr: ChangeDetectorRef,
    private servManageService: ServiceManageService,
    private msg: NzMessageService,
    private modal: ModalHelper,
  ) {
  }

  ngOnInit() {
    this.titleSrv.setTitle('服务监控');
    this.servId = +this.route.parent.snapshot.paramMap.get('serviceId');

    this.getDetails();

    const initData = this.initChartData();
    this.cpuChartOpt = initData.cpuChartOpt;
    this.memChartOpt = initData.memChartOpt;

    const sid = +this.route.parent.snapshot.paramMap.get('serviceId');
    this.getVersions();
  }

  initChartData(): MonitorResult {
    const cpuChartOpt = {
      height: 200,
      xAxis: {
        type: 'category',
        data: ['01:00', '23:00']
      },
      legend: {
        data: []
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        type: 'value'
      },
      series: []
    };
    const memChartOpt = {
      height: 200,
      xAxis: {
        type: 'category',
        data: ['01:00', '23:00']
      },
      legend: {
        data: []
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          let htmlStr = '';
          for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const xName = param.name;
            const seriesName = param.seriesName;
            const value = byteParser(params[i].value * 1024 * 1024);
            const color = param.color;

            if (i === 0) {
              htmlStr += `${xName}<br/>`;
            }
            htmlStr += `<div>`;
            htmlStr += `<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:${color};"></span>`;

            htmlStr += `${seriesName}: ${value}`;
            console.log(`${seriesName}: ${value}`);

            htmlStr += `</div>`;
          }
          return htmlStr;
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => byteParser(value * 1024 * 1024, 2)
        }
      },
      series: []
    };

    return {cpuChartOpt, memChartOpt};
  }

  getDetails() {
    this.chartTitle = `当前配置运行状态：`;
    zip(
      this.service.getPodMonitorDataNew(this.servId),
      this.servManageService.getServiceInfo(this.servId),
      this.servManageService.getAllVersions(this.servId)
    ).pipe(
      mergeMap(([cdata, serv, vdata]) => {
        return of(this.processChartData(cdata, serv, vdata.rows));
      })
    ).subscribe((data: MonitorResult) => {
      this.cpuChartOpt = data.cpuChartOpt;
      this.memChartOpt = data.memChartOpt;
    }, err => {
    });
    // this.service.getPodMonitorDatas(this.servId).subscribe((data: MonitorResult) => {
    //   this.cpuChartOpt = data.cpuChartOpt;
    //   this.memChartOpt = data.memChartOpt;
    // }, err => {
    // });
  }

  processChartData(result: any, serv: ServiceEntity, vdata: VersionEntity[]): MonitorResult {
    const {cpuChartOpt, memChartOpt} = this.initChartData();

    const podNames: string[] = [];

    const points = []; // for get all data points

    // find max-length timestamp
    const xdatas = result.map(p => p.cpuArray.map(h => h[0])).reduce((a, b) => a.length > b.length ? a : b);

    result.forEach((pod: any) => {
      const pname = pod.podName;
      podNames.push(pname);

      const cpuUses: number[] = [];
      const memUses: number[] = [];
      xdatas.forEach(t => {
        points.push([t, NaN]);
        if (pod.cpuArray) {
          const valid = pod.cpuArray.find(cpu => cpu[0] === t);
          if (valid) {
            cpuUses.push(Number(Number(valid[1]).toFixed(3)));
          } else {
            cpuUses.push(NaN);
          }
        }

        if (pod.memArray) {
          const valid = pod.memArray.find(cpu => cpu[0] === t);
          if (valid) {
            memUses.push(+(valid[1] / 1024 / 1024).toFixed(2));
          } else {
            memUses.push(NaN);
          }
        }
      });

      // datas
      cpuChartOpt.series.push({
        name: pname,
        data: cpuUses,
        type: 'line',
        smooth: true
      });
      memChartOpt.series.push({
        name: pname,
        data: memUses,
        type: 'line',
        smooth: true
      });
    });

    // legends
    cpuChartOpt.legend.data = podNames;
    memChartOpt.legend.data = podNames;
    // x-axis
    cpuChartOpt.xAxis.data = xdatas.map(x => format(new Date(Number(x)*1000), 'HH:mm'));
    memChartOpt.xAxis.data = xdatas.map(x => format(new Date(Number(x)*1000), 'HH:mm'));

    const cpuLimits = vdata.map(v => ({
      name: serv.serviceName + '-' + v.version + ' (cpu-limit)',
      pts: points.map(p => v.cpuLimit)
    }));
    cpuLimits.forEach(cl => {
      cpuChartOpt.series.push({
        name: cl.name,
        data: cl.pts.map(p => p),
        type: 'line',
        symbol: 'none',
        smooth: true
      });
    });
    cpuChartOpt.legend.data.splice(0, 0, ...cpuLimits.map(c => c.name));
    // cpuChartOpt.yAxis.max = vdata.map(v => v.cpuLimit / 1000).reduce((acc, cur) => acc >= cur ? acc : cur) * 1.25;

    const memLimits = vdata.map(v => ({
      name: serv.serviceName + '-' + v.version + ' (mem-limit)',
      pts: points.map(p => v.memoryLimit)
    }));
    memLimits.forEach(cl => {
      memChartOpt.series.push({
        name: cl.name,
        data: cl.pts.map(p => p),
        type: 'line',
        symbol: 'none',
        smooth: true
      });
    });
    memChartOpt.legend.data.splice(0, 0, ...memLimits.map(c => c.name));

    return {cpuChartOpt, memChartOpt};
  }

  getVersions() {
    this.servManageService.getAllVersions(this.servId)
      .subscribe((data: VersionListEntity) => {
        this.versions = [];
        data.rows.forEach(sv => {
          if (sv.autoscale && sv.autoscale !== null) {
            this.versions.push({
              serviceId: sv.serviceId,
              versionId: sv.id,
              version: sv.version,
              cpuLimit: sv.cpuLimit,
              memoryLimit: sv.memoryLimit,
              enable: sv.autoscale.enable,
              cpuPercent: sv.autoscale.cpuPercent,
              minPod: sv.autoscale.minPod,
              maxPod: sv.autoscale.maxPod,
              editable: false,
            });
          } else {
            this.versions.push({
              serviceId: sv.serviceId,
              versionId: sv.id,
              version: sv.version,
              cpuLimit: sv.cpuLimit,
              memoryLimit: sv.memoryLimit,
              enable: false,
              editable: false,
            });
          }
        });
        this.cdr.detectChanges();
      });
  }

  async applyEdit(versionAutoscaler) {
    versionAutoscaler.id = versionAutoscaler.versionId;

    const record = {
      id: versionAutoscaler.versionId,
      serviceId: versionAutoscaler.serviceId,
      cpuLimit: versionAutoscaler.cpuLimit,
      memoryLimit: versionAutoscaler.memoryLimit,
      // service:{serviceName: this.},
      autoscale: {
        enable: versionAutoscaler.enable,
        cpuPercent: versionAutoscaler.cpuPercent,
        minPod: versionAutoscaler.minPod,
        maxPod: versionAutoscaler.maxPod,
        editable: versionAutoscaler.editable,
      },
    };
    this.modal.create(AutoscalerEditComponent, {record, isEdit: true, from: 'minitor'}, {}).subscribe(res => {
      this.getVersions();
    });

    // await this.service.saveOrUpdateAutoscale(versionAutoscaler).subscribe(data => {
    //   this.msg.success(data.result);
    // }, (err) => {
    // });
  }

  formatterPercent = (value: string) => {
    if (value) {
      return value + ' %';
    } else {
      return '-';
    }
  }

  formatterNumber = (value: number) => {
    if (value) {
      return `${value} `;
    } else {
      return '-';
    }
  };
  parserPercent = (value: string) => value.replace(' %', '');
  formatterCpuLimit = (value: number) => {
    if (value) {
      return `${value} `;
    } else {
      return '-';
    }
  };
}
