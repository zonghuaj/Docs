import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {of} from "rxjs";
import {CacheService} from "@delon/cache";
import {mergeMap, switchMap} from "rxjs/operators";
import {WWData} from "./zwwave.component";
import {byteParser} from "admin-ui-angular-common";
import {get, post, surl} from "admin-ui-angular-common";
import {format, subDays} from "date-fns";
import {ZGrafnaService} from "admin-ui-angular-common";

@Injectable()
export class DashboardService {
  constructor(private http: _HttpClient,
              private cache: CacheService,
              private monitorService: ZGrafnaService) {
  }

  public getUsageData(start: Date, end: Date) {
    // return of(MOCK_USG).pipe(
    const body = {
      start: start.getTime() / 1000,
      end: end.getTime() / 1000
    };
    return post(this.http, surl('dashboard/resource'), body).pipe(
      mergeMap((res: any) => {
        try {
          const datas: WWData[] = [];
          const cpuUsage = this.accu(this.getAvg(res.cpuUse));
          const cpuTotal = this.getAvg(res.cpuTotal);
          const memUsage = this.accu(this.getAvg(res.memoryUse));
          const memTotal = byteParser(this.getAvg(res.memoryTotal));
          const fsUsage = this.accu(this.getAvg(res.storageUse));
          const fsTotal = byteParser(this.getAvg(res.storageTotal));

          datas.push({name: 'CPU', percent: cpuUsage, desc: cpuTotal + '核'});
          datas.push({name: '内存', percent: memUsage, desc: memTotal});
          datas.push({name: '存储', percent: fsUsage, desc: fsTotal});
          return of(datas);
        } catch (e) {
          return of(null);
        }
      })
    );
  }

  private getAvg(datas: any) {
    const values = datas.data.result[0].values;
    let count = 0;
    const sum = values.map(v => {
      const res = +v[1];
      if (isNaN(res)) {
        return 0;
      } else {
        count++;
        return res;
      }
    }).reduce((c, p) => c + p);
    return this.accu(sum / count);
  }

  private accu(d, fd = 2) {
    return Number(d.toFixed(fd));
  }

  public getServiceSummary() {
    return get(this.http, surl('dashboard/service'));
  }

  public getRequestTop10Data() {
    const params = {
      "condition": {
        "queryDuration": {
          "start": "2019-08-06 17",
          "end": "2019-08-07 17",
          "step": "HOUR"
        },
        "traceState": "ALL",
        "paging": {"pageNum": 1, "pageSize": 10, "needTotal": true},
        "queryOrder": "BY_DURATION",
        "serviceInstanceId": ""
      }
    };
    params.condition.queryDuration.start = format(subDays(new Date(), 1), 'YYYY-MM-DD HH');
    params.condition.queryDuration.end = format(new Date(), 'YYYY-MM-DD HH');

    return post(this.http, surl(`apm/endpoint`), params).pipe(
      switchMap((res: any) => of(res.data.traces.data.map(d => ({
        [d.endpointNames[0]]: d.duration
      }))))
    );
  }

  public getRequestTimeTop10Data() {
    const params = {
      "condition": {
        "queryDuration": {
          "start": "2019-08-06 17",
          "end": "2019-08-07 17",
          "step": "HOUR"
        },
        "traceState": "ALL",
        "paging": {"pageNum": 1, "pageSize": 10, "needTotal": true},
        "queryOrder": "BY_DURATION",
        "serviceInstanceId": ""
      }
    };
    params.condition.queryDuration.start = format(subDays(new Date(), 1), 'YYYY-MM-DD HH');
    params.condition.queryDuration.end = format(new Date(), 'YYYY-MM-DD HH');

    return post(this.http, surl(`apm/endpoint`), params).pipe(
      switchMap((res: any) => of(res.data.traces.data.map(d => ({
        [d.endpointNames[0]]: d.duration
      }))))
    );
  }

  public getCPUTop10Data() {
    const end = new Date();
    // const start = subDays(end, 1);
    const start = new Date();
    const step = 1;

    const CPU_Q = `topk(10,(sum by (pod_name)(rate(container_cpu_usage_seconds_total{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}[1d])) / (sum by (pod_name)(container_spec_cpu_quota{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}/100000))))`;
    return this.monitorService.requestData(CPU_Q, [start, end], step).pipe(
      mergeMap(res => {
          try {
            return of(res.data.result.map(d => ({[d.metric.pod_name]: d.values[0][1]})));
          } catch (e) {
            return of({});
          }
        }
      ));
  }

  public getMemoryTop10Data() {
    const end = new Date();
    // const start = subDays(end, 1);
    const start = new Date();
    const step = 1;

    const CPU_Q = `topk(10,sum(container_memory_rss{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}) by(pod_name) / sum(container_spec_memory_limit_bytes{image!="",name=~"^k8s_.*",namespace=~"^${this.namespace}$"}) by(pod_name) )`;
    return this.monitorService.requestData(CPU_Q, [start, end], step).pipe(
      mergeMap(res => {
          try {
            return of(res.data.result.map(d => ({[d.metric.pod_name]: d.values[0][1]})));
          } catch (e) {
            return of({});
          }
        }
      ));
  }

  public getQPSTop10Data() {
    const end = new Date();
    // const start = subDays(end, 1);
    const start = new Date();
    const step = 1;

    const QPS_Q = `topk(10,round(sum by (destination_workload)(irate(istio_requests_total{reporter="destination",destination_workload_namespace=~"^${this.namespace}$"}[5m])), 0.001))`;
    return this.monitorService.requestData(QPS_Q, [start, end], step).pipe(
      mergeMap(res => {
        try {
          return of(res.data.result.map(d => ({[d.metric.destination_workload]: d.values[0][1]})))
        } catch (e) {
          return of({});
        }
      })
    );
  }

  get namespace() {
    return this.cache.getNone('tenantId') + '-' + this.cache.getNone('projectCode');
  }
}
