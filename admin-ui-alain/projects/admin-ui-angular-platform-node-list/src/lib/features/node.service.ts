import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable, of} from 'rxjs';
import { zput, zget, surlWithoutProject } from '@app/services/services.util';

@Injectable()
export class NodeService {
  constructor(private http: _HttpClient) {
  }

  update(user:any): Observable<any[]>{
    return zput(this.http, `${surlWithoutProject('user/account')}`,user);
  }


  updatePassword(passwordInfo:any): Observable<any[]>{
    return zput(this.http, `${surlWithoutProject('user/password')}`,passwordInfo);
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

  getNodeTestInfo(url: string): Observable<any> {
    return zget(this.http, url);
  }


}
