import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';

import {subMinutes} from 'date-fns';
import {Observable, zip} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {MonitorResult} from './service-monitor.entities';
import {get, put, surl, ServiceManageService} from "admin-ui-angular-common";

@Injectable()
export class ServiceMonitorService {
  constructor(
    private http: _HttpClient,
    private servManService: ServiceManageService
  ) {
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
        trigger: 'axis'
      },
      yAxis: {
        type: 'value'
      },
      series: []
    };

    return {cpuChartOpt, memChartOpt}
  }

  getPodMonitorDatas(servId: number): Observable<MonitorResult> {
    return this.servManService.getServiceInfo(servId).pipe(
      mergeMap((data: any) => get(this.http, surl(`service/${data.id}/monitor`))),
    );
  }

  getPodMonitorDataNew(servId: number): Observable<any> {
    return this.servManService.getServiceInfo(servId).pipe(
      mergeMap((data: any) => {
        const end = new Date().getTime() / 1000;
        const start = subMinutes(new Date(), 15).getTime() / 1000;
        return zip(
          this.servManService.getServiceDetailCpuUsage(data, start, end),
          this.servManService.getServiceDetailMemUsage(data, start, end),
        ).pipe(
          mergeMap(([cpuR, memR]) => this.servManService.formatServiceDetail(cpuR, memR))
        )
      })
    );
  }

  saveOrUpdateAutoscale(versionAutoscale): Observable<any> {
    return put(this.http,
      surl(`service/${versionAutoscale.serviceId}/version/${versionAutoscale.versionId}/autoscale`),
      versionAutoscale);
  }

  // sizeConvert(limit: number): string {
  //   let size = '';
  //   if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
  //     size = limit.toFixed(2) + 'B';
  //   } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
  //     size = (limit / 1024).toFixed(2) + 'KB';
  //   } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
  //     size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  //   } else { //其他转化成GB
  //     size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  //   }
  //
  //   const sizestr = size + '';
  //   const len = sizestr.indexOf('\.');
  //   const dec = sizestr.substr(len + 1, 2);
  //   if (dec == '00') {//当小数点后为00时 去掉小数部分
  //     return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  //   }
  //   return sizestr;
  // }
}
