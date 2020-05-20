import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import { get, surlWithoutProject } from 'admin-ui-angular-common';

@Injectable()
export class BindGroupService {
  constructor(private http: _HttpClient) {
  }


  getAllRoles(): Observable<any[]>{
    return get(this.http, `${surlWithoutProject('roles')}`).pipe(
      switchMap((data: any[]) => this.formatRole(data))
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
}
