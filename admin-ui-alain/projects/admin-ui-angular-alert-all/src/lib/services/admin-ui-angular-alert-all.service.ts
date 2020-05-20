import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { deleteMethod, get, put, surl, surlWithoutProject } from 'admin-ui-angular-common';
import { format } from 'date-fns';
import { AlertListEntity } from '../entities/alert.entities';
@Injectable()
export class AdminUiAngularAlertAllService {

  constructor(
    private http: _HttpClient) {
  }

  getAllAlerts(
    pageNum: number = 1,
    take: number = 100,
    kwd: string = '',
    times: Date[] = [],
    status: string[] = [],
    alertLevel: string[] = []): Observable<AlertListEntity> {
    let startsAt = '';
    let endsAt = '';
    if (times.length > 0) {
      startsAt = '' + format(times[0], 'YYYY-MM-DD HH:mm:ss');
      endsAt = '' + format(times[1], 'YYYY-MM-DD HH:mm:ss');
    }

    const stsStr = status.map(s => `&status[]=${s}`).join('');
    const alStr = alertLevel.map(s => `&alertLevel[]=${s}`).join('');
    const purl = `?kwd=${kwd}&pageNum=${pageNum}&take=${take}&startsAt=${startsAt}&endsAt=${endsAt}${stsStr}${alStr}`;

    return get(this.http, 'alert/' + surlWithoutProject(`events/alerts`) + purl);
  }

  claimAlert(id: number) {
    const params = {};
    return put(this.http, 'alert/' + surlWithoutProject(`events/alerts/${id}/claim`), params);
  }

  closeAlert(id: number, solution: string) {
    const params = { solution };
    return put(this.http, 'alert/' + surlWithoutProject(`events/alerts/${id}`), params);
  }

  getAlertRuleInfo(id: number): Observable<any> {
    return get(this.http, surl(`AlertRule/${id}`));
  }

  deleteAlertRule(id: number): Observable<any> {
    return deleteMethod(this.http, surl(`AlertRule/${id}`));
  }
}
