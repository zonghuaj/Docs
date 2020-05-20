import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {MenuItem, RoleEntity, RoleListEntity} from "./project-role.entities";
import {CacheService} from "@delon/cache";
import {get, post, put, deleteMethod, surlWithoutProject} from "admin-ui-angular-common";

@Injectable()
export class ProjectRoleService {
  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  get tenantId() {
    return this.cache.getNone('tenantId');
  }

  getFullMenus(type?: string): Observable<MenuItem[]> {
    return get(this.http, `uma/menuTree/${type}`);
  }

  getRoles(type: string,
           pageNumber = 0,
           pageSize = 999,): Observable<RoleListEntity> {
    const params = {pageSize, pageNumber};
    return get(this.http, umaUrl(`${type}/roles`), params);
  }

  getTanentRoleDetail(type: string, rid: string): Observable<RoleEntity> {
    return get(this.http, umaUrl(`${type}/roles/${rid}`));
  }

  createTenantRole(role: RoleEntity) {
    return post(this.http, umaUrl(`roles`), role);
  }

  editTenantRole(role: RoleEntity) {
    return put(this.http, umaUrl(`roles/${role.id}`), role);
  }

  deleteTenantRole(role: RoleEntity): Observable<any> {
    return deleteMethod(this.http, umaUrl(`roles/${role.id}`));
  }

  bindTenantUser(roleId: string, userIds: string[]): Observable<any> {
    const params = {roleId, userIds};
    return post(this.http, umaUrl(`roleUser`), params);
  }

  unbindTenantUser(userId): Observable<any> {
    return deleteMethod(this.http, umaUrl(`roleUser/${userId}`));
  }

  getBindedUser(rid: string): Observable<any> {
    return get(this.http, umaUrl(`roleUser/${rid}`));
  }

  bindProjectUser(projectId: string, roleIds: string[], userIds: string[]) {
    const params = {roleIds, userIds};
    return post(this.http, umaUrl(`project/${projectId}/roleUser`), params);
  }

  unbindProjectUser(projectId: string, userId: string) {
    return deleteMethod(this.http, umaUrl(`project/${projectId}/roleUser/${userId}`));
  }

  editBindedProjectUser(projectId: string, roleIds: string[], userIds: string[]) {
    const params = {roleIds, userIds};
    return put(this.http, umaUrl(`project/${projectId}/roleUser`), params);
  }

  getBindedProjectUser(projectId: string) {
    return get(this.http, umaUrl(`project/${projectId}/roleUser`));
  }
}

function umaUrl(url) {
  return 'uma/' + surlWithoutProject(url);
}

