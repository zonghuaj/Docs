import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {RollbackHis} from "./service-list.entities";
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {format} from "date-fns";
import {surl, get} from "admin-ui-angular-common";

@Injectable()
export class ServiceListService {
  constructor(private http: _HttpClient) {
  }

  getRollbackHistory(sid: number, vid: number): Observable<RollbackHis[]> {
    return get(this.http, surl(`service/${sid}/version/${vid}/record`)).pipe(
      switchMap((data: RollbackHis[]) => this.formatRollBackHistory(data))
    );
  }

  formatRollBackHistory(data: RollbackHis[]): Observable<RollbackHis[]> {
    return of(data.map(d => ({
      revision: d.revision,
      updated: format(d.updated, 'YYYY-MM-DD HH:mm:ss'),
      description: d.description,
      status: d.status
    })));
  }

  getDeployError(sid: string, vid: string) {
    return get(this.http, surl(`service/${sid}/version/${vid}/error`));
  }
}
