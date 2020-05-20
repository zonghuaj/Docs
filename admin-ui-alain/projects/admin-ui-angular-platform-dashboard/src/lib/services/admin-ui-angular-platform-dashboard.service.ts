import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { PodsEntity, PodsListEntity } from '../entity/platform-dashboard.entities';
import { surlWithoutProject, get } from 'admin-ui-angular-common';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularPlatformDashboardService {

  constructor(private http: _HttpClient) { }

  getUsageData(): Observable<PodsEntity> {
    return get(this.http, surlWithoutProject('dashboard/cluster/usage'));
  }

  getNodeList(
    currentPage = 1,
    pageSize = 100,
    name = ''): Observable<PodsListEntity> {
    const params = { currentPage, pageSize, name };
    return get(this.http, surlWithoutProject('dashboard/cluster/table'), params);
  }
}
