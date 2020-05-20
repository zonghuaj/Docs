import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { surl, URL_BASE, deleteMethod, put } from 'admin-ui-angular-common';
const AUTOSCALES = 'autoscales';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularServiceAutoscalerService {
  url = `${URL_BASE}${surl(AUTOSCALES)}`;
  get tenantUrl() {
    return this.url;
  }
  constructor(private http: _HttpClient ) { }

  delete(item) {
    const url = `service/${item.serviceId}/version/${item.id}/autoscales`;
    return deleteMethod(this.http, `${surl(url)}`);
  }
  saveOrUpdateAutoscale(versionAutoscale): Observable<any> {
    return put(this.http,
      surl(`service/${versionAutoscale.serviceId}/version/${versionAutoscale.versionId}/autoscale`),
      versionAutoscale);
  }
}
