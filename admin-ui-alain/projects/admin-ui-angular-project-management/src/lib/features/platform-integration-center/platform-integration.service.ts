import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {PlatformConfigItem, PlatformIntegrationListEntity} from "./platform-integration.entity";
import {_HttpClient} from "@delon/theme";
import {get, post, put, deleteMethod, surlWithoutProject} from "admin-ui-angular-common";

@Injectable()
export class PlatformIntegrationService {
  constructor(private http: _HttpClient) {
  }

  getAllSupportedPlatforms(): Observable<any> {
    return get(this.http, 'pipeline/' + surlWithoutProject('eat/types'));
  }

  getIntegratedList(type: string,
                    currentPage: number = 1,
                    pageSize: number = 100,): Observable<PlatformIntegrationListEntity> {
    const params = {type, currentPage, pageSize};
    return get(this.http, 'pipeline/' + surlWithoutProject('ea'), params);
  }

  createPlatform(type, config): Observable<any> {
    const param = {type, config};
    return post(this.http, 'pipeline/' + surlWithoutProject('ea'), param);
  }

  testPlatform(item): Observable<any> {
    return get(this.http, 'pipeline/' + surlWithoutProject(`ea/${item.id}/test`));
  }

  deletePlatform(item): Observable<any> {
    return deleteMethod(this.http, 'pipeline/' + surlWithoutProject(`ea/${item.id}`));
  }

  getPlatformDetail(id): Observable<PlatformConfigItem> {
    return get(this.http, 'pipeline/' + surlWithoutProject(`ea/${id}`));
  }

  removeProjectFromPlatform(id, projectCode: string) {
    const params = {id, projectCode};
    return post(this.http,'pipeline/' +  surlWithoutProject(`ea/deleteProject`), params);
  }

  distributeProj(id, projectCode: string[]): Observable<any> {
    const params = {id, projectCode};
    return post(this.http, 'pipeline/' + surlWithoutProject(`ea/bind`), params);
  }

  editPlatform(type, config) {
    const param = {type, config};
    return put(this.http, 'pipeline/' + surlWithoutProject(`ea/${config.id}`), param);
  }
}
