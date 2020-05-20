import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {PMonitorEntity} from "./project-monitor.entities";
import {_HttpClient} from "@delon/theme";
import {surlWithoutProject, post} from "admin-ui-angular-common";

@Injectable()
export class ProjectMonitorService {
  constructor(private http: _HttpClient) {
  }

  getPMonitorData(type, isRemaining, operator, value, times: Date[]): Observable<PMonitorEntity[]> {
    const start = times[0].getTime() / 1000;
    const end = times[1].getTime() / 1000;

    // isRemaining = isRemaining === 'T' ? true : isRemaining === 'F' ? false : '';
    const params = {
      duration: {start, end},
      filter: {type, isRemaining, operator, value}
    };
    return post(this.http, surlWithoutProject('dashboard/project'), params);
  }
}
