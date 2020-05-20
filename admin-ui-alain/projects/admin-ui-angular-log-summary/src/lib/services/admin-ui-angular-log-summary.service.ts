import { Injectable } from '@angular/core';
import { SummaryLogListEntity } from '../entities/log-summary.entities';
import { Observable, of } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
import { get } from 'admin-ui-angular-common';
import { CacheService } from '@delon/cache';

@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularLogSummaryService {
  constructor(
    private http: _HttpClient,
    private cache: CacheService
    ) {
  }
  getFullLogData(
    currentPage = 1,
    pageSize = 100,
    startDate = '',
    endDate = '',
    servername = '',
    keywords = ''): Observable<SummaryLogListEntity> {
    const tenantId = this.cache.getNone('tenantId');
    const projectCode = this.cache.getNone('projectCode');
    const body = {
      currentPage,
      pageSize,
      startDate,
      endDate,
      servername,
      keywords,
      namespace: tenantId + '-' + projectCode
    };
    return get(this.http, 'elasticsearch', body).pipe(
      switchMap((res: any) => of(this.transformData(res)))
    );
  }

  transformData(result: any): SummaryLogListEntity {
    const data = result.hits;
    const count = result.total;

    const rows = new Array(data.length)
      .fill({})
      .map((item, idx) => {
        const d = data[idx];

        return {
          timestamp: d._source['@timestamp'],
          content: d._source.log,
          service: d._source.kubernetes.labels.app,
          pod: d._source.kubernetes.pod_name
        }
      });

    return { count, rows };
  }

}
