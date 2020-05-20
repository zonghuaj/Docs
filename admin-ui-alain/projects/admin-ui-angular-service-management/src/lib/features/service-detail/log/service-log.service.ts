import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable, of} from 'rxjs';
import {Log, Replicas} from './log.entities';
import {mergeMap, switchMap} from 'rxjs/operators';
import {zrequestthru, ServiceManageService} from "admin-ui-angular-common";
import {CacheService} from "@delon/cache";

@Injectable()
export class ServLogService {
  constructor(private http: _HttpClient,
              private servManService: ServiceManageService,
              private cache: CacheService,) {
  }

  getServiceLog(pod: string, container: string): Observable<Log[]> {
    const tenantId = this.cache.getNone('tenantId');
    const projectCode = this.cache.getNone('projectCode');
    const opts = {
      api: 'kubernetes',
      method: 'GET',
      path: `log/${tenantId}-${projectCode}/${pod}/${container}`,
      data: {
        "logFilePosition": "end",
        // "offsetFrom": "2000000000",
        // "offsetTo": "2000000010",
        "previous": "false",
        "referenceLineNum": "0",
        "referenceTimestamp": "newest"
      }
    };
    return zrequestthru(this.http, opts).pipe(
      switchMap((result: any) => of(result.logs)),
      switchMap((logs: any) => of(this.processLogData(logs)))
    );
  }

  processLogData(logs: Log[]): Log[] {
    return logs.map((l: Log) => ({
      timestamp: l.timestamp,
      content: l.content,
      time: new Date(l.timestamp)
    }));
  }

  getReplicas(sname: string): Observable<Replicas> {
    return this.servManService.getDeploys(sname).pipe(
      mergeMap((pods: any) => {
        return this.getContainers(pods[0].objectMeta.name);
      })
    );
  }

  getContainers(podName: string): Observable<Replicas> {
    const opts = {
      api: 'kubernetes',
      method: 'GET',
      path: `log/source/${this.cache.getNone('tenantId')}-${this.cache.getNone('projectCode')}/${podName}/pod`,
    };

    return zrequestthru<Replicas>(this.http, opts);
  }
}
