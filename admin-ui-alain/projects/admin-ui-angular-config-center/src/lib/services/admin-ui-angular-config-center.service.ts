import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { get, post } from 'admin-ui-angular-common';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularConfigCenterService {

  constructor(private http: _HttpClient) { }
  // get config map list
  getCofigMapList(
    currentPage: number = 1,
    pageSize: number = 100, name: string): Observable<JSON> {
    const params = { currentPage, pageSize, name };
    return get<JSON>(this.http, getConfigListUrl(), params);
  }

  // del config map
  delCofigMap(name: string): Observable<JSON> {
    const params = { name };
    return get<JSON>(this.http, delConfigMapUrl(), params);
  }

  // update config map
  updateConfigMap(json: any): Observable<JSON> {
    return post<JSON>(this.http, updateConfigMapUrl(), json);
  }

  // create config map
  createConfigMap(json: any): Observable<JSON> {
    return post<JSON>(this.http, createConfigMapUrl(), json);
  }
}

export function getConfigListUrl() {
  return `$TENANT_ID/project/$PROJECT_CODE/configMap`;
}

export function delConfigMapUrl() {
  return `$TENANT_ID/project/$PROJECT_CODE/delConfigMap`;
}

export function updateConfigMapUrl() {
  return `$TENANT_ID/project/$PROJECT_CODE/updateConfigMap`;
}

export function createConfigMapUrl() {
  return `$TENANT_ID/project/$PROJECT_CODE/createConfigMap`;
}
