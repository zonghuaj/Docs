import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { format } from 'date-fns';
import { post, surl, inADay, inAMonth, inAnHour } from 'admin-ui-angular-common';
@Injectable({
  providedIn: 'root'
})
export class AdminUiAngularServiceTraceService {

  constructor(private http: _HttpClient) { }
  getDuration(start: Date, end: Date): any {
    const FORMAT = inAnHour(start, end) ? 'YYYY-MM-DD HHmm' :
      inADay(start, end) ? 'YYYY-MM-DD HH' :
        inAMonth(start, end) ? 'YYYY-MM-DD' : 'YYYY-MM';

    const STEP = inAnHour(start, end) ? 'MINUTE' :
      inADay(start, end) ? 'HOUR' :
        inAMonth(start, end) ? 'DAY' : 'MONTH';

    return {
      duration: {
        start: format(start, FORMAT),
        end: format(end, FORMAT),
        step: STEP
      }
    };
  }
  getTraceList(
    serviceId: string,
    instanceId: string,
    status: string,
    endPoint: string,
    traceId: string,
    minDur: number, maxDur: number,
    startT: Date, endT: Date,
    pi: number, ps: number,
    timeType: string) {
    const condition = {
      queryDuration: this.getDuration(startT, endT).duration,
      traceState: status,
      paging: {
        pageNum: pi,
        pageSize: ps,
        needTotal: true
      },
      queryOrder: timeType,
      serviceInstanceId: instanceId,
      serviceId,
      maxTraceDuration: maxDur,
      minTraceDuration: minDur,
      endpointName: endPoint,
      traceId
    };

    this.removeInvalidField(condition,
      'serviceId', 'traceId', 'endPoint', 'endpointName',
      'maxTraceDuration', 'minTraceDuration');

    return post(this.http, surl(`apm/endpoint`), { condition })
      .pipe(switchMap((res: any) => of(res.data.traces)));
  }

  removeInvalidField(obj: any, ...fields: string[]) {
    fields.forEach(k => {
      if (!obj[k]) {
        delete obj[k];
      }
    });
  }

  getTraceDetail(traceId: string) {
    return post(this.http, surl(`apm/trace`), { traceId })
      .pipe(switchMap((res: any) => of(res.data.trace.spans)));
  }
  getTracedService(start: Date, end: Date): Observable<any> {
    const body = {
      ...this.getDuration(start, end)
    };

    return post(this.http, surl(`apm/service`), body);
  }

  getTracedInstance(serviceId: number, start: Date, end: Date): Observable<any> {
    const body = {
      serviceId: '' + serviceId,
      ...this.getDuration(start, end)
    };

    return post(this.http, surl(`apm/service/instance`), body);
  }
}
