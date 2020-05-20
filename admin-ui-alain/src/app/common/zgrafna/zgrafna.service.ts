import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {_HttpClient} from "@delon/theme";
import {zget, zpost} from "@app/services/services.util";

@Injectable()
export class ZGrafnaService {
  constructor(private http: _HttpClient) {
  }

  requestData(source: string, times?: Date[], step = 360): Observable<any> {
    // const start = 1562816877;
    // const end = 1562838477;
    const start = times[0].getTime() / 1000;
    const end = times[1].getTime() / 1000;

    return zpost(this.http, surl('monitor'), {
      query: source,
      start, end, step
    });
  }
}

function surl(targetPath: string) {
  return `$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}
