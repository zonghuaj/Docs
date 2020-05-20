import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { get, surl, put, post, deleteMethod } from 'admin-ui-angular-common';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularServiceTrafficService {

  constructor(
    private http: _HttpClient) {
  }

  getGatewayList(): Observable<any> {
    const body = { pageSize: 100, currentPage: 1 };
    return get(this.http, surl(`gateway`), body);
  }

  getGatewayInfo(id) {
    return get(this.http, surl(`gateway/${id}`));
  }

  updateGateway(gateway) {
    return put(this.http, surl(`gateway/${gateway.id}`), gateway);
  }

  deleteGateway(id) {
    return deleteMethod(this.http, surl(`gateway/${id}`));
  }

  createGateway(gateway) {
    return post(this.http, surl(`gateway`), gateway);
  }

  createTraffic(service, traffic) {
    return post(this.http, surl(`service/${service.name}/traffic`), traffic);
  }

  updateTraffic(sname, traffic) {
    return put(this.http, surl(`service/${sname}/traffic/${traffic.id}`), traffic);
  }

  getTrafficInfo(sname) {
    return get(this.http, surl(`service/${sname}/resource/traffic`));
  }

  getTrafficGraph(duration) {
    // return this._http.get('assets/mocks/traffic.json');
    return get(this.http, surl(`dependencies`), { duration });
  }

  getLinePanelData(duration, data) {
    // return post(this.http, surl(`dependencies/line?duration=${duration}`), data);
    return post(this.http, surl(`dependencies/line?duration=${duration}`), data);
  }

  getVersionTrafficInfo(servName, versionName) {
    return get(this.http, surl(`service/${servName}/version/${versionName}/resource/traffic/name`));
  }

  createVersionTrafficInfo(servName, versionName, traffic) {
    return post(this.http, surl(`service/${servName}/version/${versionName}/traffic`), traffic);
  }

  updateVersionTrafficInfo(servName, versionName, traffic) {
    return put(this.http, surl(`service/${servName}/version/${versionName}/traffic/${traffic.id}`), traffic);
  }

  deleteVersionTrafficInfo(servName, versionName, traffic) {
    return deleteMethod(this.http, surl(`service/${servName}/version/${versionName}/traffic/${traffic.id}`));
  }

}
