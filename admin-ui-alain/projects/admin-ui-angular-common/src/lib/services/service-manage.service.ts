import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
import { Observable, of, } from 'rxjs';
import { ServiceListEntity, VersionEntity, ServiceEntity, VersionListEntity } from '../entities/service-list.entities';
import { deleteMethod, get, post, put, zrequestthru, surl } from './http.util';
import { CacheService } from '@delon/cache';

@Injectable()
export class ServiceManageService {
  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  createService(serv): Observable<ServiceEntity> {
    serv.projectCode = this.cache.getNone('projectCode'); // will remove in future versions

    return post<ServiceEntity>(this.http, surl(`service`), serv);
  }

  getAllServices(
    currentPage: number = 1,
    pageSize: number = 100,
    serviceName: string = '',
    serviceDesc: string = ''): Observable<ServiceListEntity> {
    const params = { serviceName, currentPage, pageSize, serviceDesc };
    return get<ServiceListEntity>(this.http, surl(`service`), params);
  }

  getServiceInfo(id: number): Observable<any> {
    return get<ServiceEntity>(this.http, surl(`service/${id}`));
  }

  editService(se: ServiceEntity): Observable<any> {
    return put(this.http, surl(`service/${se.id}`), se);
  }

  deleteService(id: number): Observable<any> {
    return deleteMethod(this.http, surl(`service/${id}`));
  }

  getAllVersions(
    sid: number,
    currentPage: number = 1,
    pageSize: number = 100,
    status: number = 0): Observable<VersionListEntity> {
    const params = { sid, status, currentPage, pageSize };
    return get<VersionListEntity>(this.http, surl(`service/${sid}/version`), params);
  }

  createVersion(sid: number, ve: VersionEntity): Observable<any> {
    return post(this.http, surl(`service/${sid}/version`), ve);
  }

  deleteVersion(sid: number, vid: number): Observable<any> {
    return deleteMethod(this.http, surl(`service/${sid}/version/${vid}`));
  }

  editVersion(sid: number, vid: number, newVe: VersionEntity): Observable<any> {
    return put(this.http, surl(`service/${sid}/version/${vid}`), newVe);
  }

  getVersionInfo(sid: number, vid: number): Observable<VersionEntity> {
    return get<VersionEntity>(this.http, surl(`service/${sid}/version/${vid}`));
  }

  rollBackVersion(sid: number, vid: number, info: any): Observable<any> {
    const body = { ...info };
    return get(this.http, surl(`service/${sid}/version/${vid}/rollback`), body);
  }

  deployVersion(sid: number, vid: number, desc: any): Observable<any> {
    const body = { desc };
    return get(this.http, surl(`service/${sid}/version/${vid}/release`), body);
  }

  getDeploys(dplyName: string): Observable<any> {
    const tenantId = this.cache.getNone('tenantId');
    const projectCode = this.cache.getNone('projectCode');
    const opts = {
      api: 'kubernetes',
      method: 'GET',
      path: `service/${tenantId}-${projectCode}/${dplyName}`
    };

    return zrequestthru(this.http, opts).pipe(
      switchMap((data: any) => {
        const pods = [];
        data.podList.pods.forEach(p => {
          pods.push({ objectMeta: p.objectMeta });
        });
        return of(pods);
      })
    );
  }

  scaleVersion(sid: number, vid: number, replica: any): Observable<any> {
    return get(this.http, surl(`service/${sid}/version/${vid}/scale/${replica}`));
  }

  stopVersion(sid: number, vid: number): Observable<any> {
    return get(this.http, surl(`service/${sid}/version/${vid}/stop`));
  }

  getResourceLimit() {
    return get<ServiceEntity>(this.http, surl(`checkLimit`));
  }

  getServiceDetailCpuUsage(service: any, start: number, end: number) {
    const query = `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${service.tenantCode}-${service.projectCode}$",pod_name=~"^${service.serviceName}-.*"}[5m])) by ( pod_name)`;
    const body = {
      start,
      end,
      query,
    };
    return post(this.http, surl(`monitor`), body);
  }

  getServiceDetailMemUsage(service: any, start: number, end: number) {
    const query = `sum ( container_memory_working_set_bytes{namespace=~"^${service.tenantCode}-${service.projectCode}$",pod_name=~"^${service.serviceName}-.*"})   by ( pod_name)`;
    const body = {
      start,
      end,
      query,
    };
    return post(this.http, surl(`monitor`), body);
  }

  formatServiceDetail(cpuR, memR): Observable<any> {
    const result = cpuR.data.result;
    const newR = result.map(r => {
      const podName = r.metric.pod_name;
      const cpuArray = r.values;
      const memArray = memR.data.result.find(m => m.metric.pod_name === r.metric.pod_name).values;
      return {
        podName,
        cpuArray,
        memArray,
      };
    });
    return of(newR);
  }

  getArtiVer(aid: number, vid: number): Observable<any> {
    return get(this.http, surl(`artifactory/${aid}/version/${vid}`));
  }
}
