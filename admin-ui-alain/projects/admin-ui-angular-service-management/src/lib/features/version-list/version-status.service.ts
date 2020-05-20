import {Injectable} from "@angular/core";
import {interval, Observable, Subject, Subscription} from "rxjs";
import {VersionStatus} from "../service-list/service-list.entities";
import {_HttpClient} from "@delon/theme";
import {mergeMap} from "rxjs/operators";
import {get, surl} from 'admin-ui-angular-common';

@Injectable()
export class VersionStatusService {
  statusSubscriber$: Subscription;
  readonly AUTO_REFRESH_INTERVAL = 8 * 1000;

  vsSubject: Subject<VersionStatus[]>;

  constructor(private http: _HttpClient) {
  }

  startWatchingVStatus(id: number): Observable<VersionStatus[]> {
    if (!id) return; // do nothing if there is no id

    this.stopWatchingVStatus(); // clear previous first

    this.vsSubject = new Subject();
    this.statusSubscriber$ = interval(this.AUTO_REFRESH_INTERVAL).pipe(
      mergeMap(() => this.getServiceVersionMonitor(id))
    ).subscribe((ss: VersionStatus[]) => {
      this.vsSubject.next(ss);
    });

    return this.vsSubject.asObservable();
  }

  stopWatchingVStatus() {
    if (this.vsSubject) {
      this.vsSubject.complete();
      this.vsSubject = null;
    }

    if (this.statusSubscriber$) {
      this.statusSubscriber$.unsubscribe();
      this.statusSubscriber$ = null;
    }
  }

  getStatus(idArr: number[]): Observable<VersionStatus[]> {
    const ids = idArr.join(',');
    return get<VersionStatus[]>(this.http,
      // this service/0/ <--- is '0' useless
      surl(`service/0/version/${ids}/resource/status`));
  }

  getServiceVersionMonitor(id: number): Observable<VersionStatus[]> {
    return get<VersionStatus[]>(this.http,
      // this service/0/ <--- is '0' useless
      surl(`service/${id}/monitor/version`));
  }
}
