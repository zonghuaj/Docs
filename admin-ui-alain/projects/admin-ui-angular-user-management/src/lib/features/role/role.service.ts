import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import { get, surlWithoutProject } from 'admin-ui-angular-common';

@Injectable()
export class RoleService {
  constructor(private http: _HttpClient) {
  }

  getRoles(): Observable<any[]>{
    return get(this.http, `${surlWithoutProject('roles')}`,{type: 'urn:project'}).pipe(
      switchMap((data: any[]) => this.formatRole(data))
    );
  }
  getOwnerMenuResource(roleName: string): Observable<any[]>{
    const url = surlWithoutProject(`roles/${roleName}/roleMapping`);
    return get(this.http, `${url}`, { type: 'ui:menu'}).pipe(
      switchMap((data: any) => this.formatResource(data.rows))
    );
  }
  getOwnerAPIResource(roleName: string): Observable<any[]>{
    const url = surlWithoutProject(`roles/${roleName}/roleMapping`);
    return get(this.http, `${url}`, { type: 'urn:api'}).pipe(
      switchMap((data: any) => this.formatResource(data.rows))
    );
  }
  getOwnerProjectResource(roleName: string): Observable<any[]>{
    const url = surlWithoutProject(`roles/${roleName}/roleMapping`);
    return get(this.http, `${url}`, { type: 'project:resource'}).pipe(
      switchMap((data: any) => this.formatResource(data.rows))
    );
  }

  getUserRoles(userId: string): Observable<any[]>{
    const url = surlWithoutProject(`users/${userId}/roles`);
    return get(this.http, `${url}`).pipe(
      switchMap((data: any[]) => this.formatUserRoleIds(data))
    );
  }

  formatRole(data: any[]): Observable<any[]>{
    return of(data.map(d => ({
      title: d.name,
      value: d.name,
    })));
  }
  formatUserRoleIds(data: any[]): Observable<any[]>{
    return of(data.map(d => (d.name)));
  }

  formatResource(data: any[]): Observable<any[]>{
    return of(data.map(d => ({
      title: d.displayName,
      key: d._id,
      name: d.name,
      policyId: d.policyId,
      direction: d.isSelect ? 'right' : 'left' ,
    })));
  }
}
