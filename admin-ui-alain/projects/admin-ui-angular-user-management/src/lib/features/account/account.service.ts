import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable, of} from 'rxjs';
import {put, surlWithoutProject} from "admin-ui-angular-common";

@Injectable()
export class AccountService {
  constructor(private http: _HttpClient) {
  }

  update(user:any): Observable<any[]>{
    return put(this.http, `${surlWithoutProject('user/account')}`,user);
  }

  updatePassword(passwordInfo:any): Observable<any[]>{
    return put(this.http, `${surlWithoutProject('user/password')}`,passwordInfo);
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
