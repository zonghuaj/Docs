import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {_HttpClient} from "@delon/theme";
import {mergeMap, switchMap} from "rxjs/operators";
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  format,
} from "date-fns";
import {TPCallDetail} from "./topo-panel/topo-panel.entities";
import {isNumber} from "util";
import {inADay, inAMonth, inAnHour} from "./topo-time.utils";
import {post, surl} from 'admin-ui-angular-common';

@Injectable()
export class ServiceTopoService {
  constructor(private http: _HttpClient) {
  }

  getDuration(start: Date, end: Date): any {
    const FORMAT = inAnHour(start, end) ? 'YYYY-MM-DD HHmm' :
      inADay(start, end) ? 'YYYY-MM-DD HH' :
        inAMonth(start, end) ? 'YYYY-MM-DD' : 'YYYY-MM';

    const STEP = inAnHour(start, end) ? 'MINUTE' :
      inADay(start, end) ? 'HOUR' :
        inAMonth(start, end) ? 'DAY' : 'MONTH';

    return {
      "duration": {
        "start": format(start, FORMAT),
        "end": format(end, FORMAT),
        "step": STEP
      }
    };
  }

  getTopo(start: Date, end: Date): Observable<any> {
    const body = this.getDuration(start, end);

    // return this.http.get('/assets/mocks/topo.json');
    return post(this.http, surl('apm/topology'), body);
  }

  getTopoData(start: Date, end: Date, ids: any): Observable<any> {
    const body = {
      ...ids,
      ...this.getDuration(start, end)
    };

    // return this.http.get('/assets/mocks/topodata.json');
    return post(this.http, surl('apm/topology/data'), body);
  }

  getFullTopoData(start: Date, end: Date): Observable<any> {
    return this.getTopo(start, end)
      .pipe(mergeMap((res: any) => {
        const tp = res.data.topo;
        const ids = this.getFullIds(tp);
        return this.getTopoData(start, end, ids)
          .pipe(switchMap((tpData: any) => {
            return of(this.combineTopoData(tp, tpData.data));
          }));
      }));
  }

  getFullIds(topo: any) {
    const ids: string[] = [];
    const idsC: string[] = [];
    const idsS: string[] = [];
    topo.nodes.forEach((nd: any) => {
      ids.push(nd.id);
    });
    topo.calls.forEach((cls: any) => {
      const id = cls.id;
      if (cls.detectPoint === 'CLIENT') {
        idsC.push(id);
      }
      if (cls.detectPoint === 'SERVER') {
        idsS.push(id);
      }
    });

    return {ids, idsC, idsS};
  }

  combineTopoData(tp: any, tpData: any) {
    tp.nodes.forEach((nd: any) => {
      nd.sla = this.getSla(this.findValue(tpData.sla.values, nd.id));
      nd.cpm = this.findValue(tpData.nodeCpm.values, nd.id);
      nd.latency = this.findValue(tpData.nodeLatency.values, nd.id);
    });

    tp.calls.forEach((cl: any) => {
      if (cl.detectPoint === 'SERVER') {
        cl.cpm = this.findValue(tpData.cpmS.values, cl.id);
        cl.latency = this.findValue(tpData.latencyS.values, cl.id);
      } else if (cl.detectPoint === 'CLIENT') {
        cl.cpm = this.findValue(tpData.cpmC.values, cl.id);
        cl.latency = this.findValue(tpData.latencyC.values, cl.id);
      }
    });

    return [tp, tpData];
  }

  findValue(arr: any, id: any) {
    const item = arr.find(item => item.id === id);
    return item ? item.value : null;
  }

  getSla(sla: any) {
    return isNumber(sla) ? sla / 100 : sla;
  }

  getCallDetail(start: Date, end: Date, call: any) {
    const body = {
      id: call.id,
      ...this.getDuration(start, end)
    };

    // const api = call.detectPoint === 'SERVER' ? '/assets/mocks/call_s.json' : '/assets/mocks/call_c.json';
    // return this.http.get(api, body).pipe(
    //   switchMap((res: any) => of(this.makeCallDetail(start, end, res.data)))
    // );

    const api = call.detectPoint === 'SERVER' ? 'apm/line/server' : 'apm/line/client';
    return post(this.http, surl(api), body).pipe(
      switchMap((res: any) => of(this.makeCallDetail(start, end, res.data)))
    );
  }

  makeCallDetail(start: Date, end: Date, data: any): TPCallDetail {
    const timeTrend = this.getChartData(data.getResponseTimeTrend.values);
    const throughputTrend = this.getChartData(data.getThroughputTrend.values);
    const slaTrend = this.getChartData(data.getSLATrend.values);

    const length = timeTrend.length;
    const times = this.getChartTime(start, end, length);

    return {times, timeTrend, throughputTrend, slaTrend};
  }

  getChartTime(start: Date, end: Date, max: number): string[] {
    const times = [];
    let t: Date = start;
    let count = 0; // max to length

    const FORMAT = inAnHour(start, end) ? 'HH:mm' :
      inADay(start, end) ? 'MM-DD HH' :
        inAMonth(start, end) ? 'YYYY-MM-DD' : 'YYYY-MM';
    const ADD_TIME = inAnHour(start, end) ? addMinutes :
      inADay(start, end) ? addHours :
        inAMonth(start, end) ? addDays : addMonths;

    // while (!isSameTime(t, end) && count < max) {
    while (count < max) {
      times.push(format(t, FORMAT));
      t = ADD_TIME(t, 1);
      count++;
    }

    return times;
  }

  getChartData(values: any) {
    const vals = [];
    values.forEach(v => {
      vals.push(v.value);
    });
    return vals;
  }
}
