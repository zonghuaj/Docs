import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { deleteMethod, get, post, put, surl} from 'admin-ui-angular-common';
import { AlertRuleEntity, AlertRuleListEntity } from '../entities/alert-rule.entities';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularAlertRulesService {

  constructor(private http: _HttpClient) { }


  createAlertRule(ar: AlertRuleEntity): Observable<AlertRuleEntity> {
    return post(this.http, 'alert/' + surl(`rules`), ar);
  }

  getAllAlertRules(
    pageNumber: number = 0,
    pageSize: number = 100,
    keyword: string = ''): Observable<AlertRuleListEntity> {
    pageNumber--;
    const params = { keyword, pageNumber, pageSize };
    return get(this.http, 'alert/' + surl(`rules`), params);
  }

  getAlertRuleInfo(id: number): Observable<any> {
    return get(this.http, 'alert/' + surl(`rules/${id}`));
  }

  editAlertRule(ar: AlertRuleEntity): Observable<any> {
    return put(this.http, 'alert/' + surl(`rules/${ar.id}`), ar);
  }

  toggleAlertRule(id: number, enable: boolean): Observable<any> {
    return put(this.http, 'alert/' + surl(`rules/${id}/${enable}`));
  }

  deleteAlertRule(id: number): Observable<any> {
    return deleteMethod(this.http, 'alert/' + surl(`rules/${id}`));
  }

  getUserGroup(
    pageNumber = 0,
    pageSize = 100) {
    const params = { pageNumber, pageSize };
    return get(this.http, 'uma/' + surl(`groups`), params)
      .pipe(switchMap((res: any) => of({ ...res, rows: res.rows.map(r => ({ id: r.groupId, name: r.groupName })) })));
  }
}
