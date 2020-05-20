import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { NoticeWayItem } from '../entities/notice.entities';
import { get, put, surl} from 'admin-ui-angular-common';
@Injectable()
export class AdminUiAngularNoticeWayService {
  constructor(private http: _HttpClient) {
  }
  getNoticeWays(): Observable<NoticeWayItem[]> {
    return get(this.http, 'alert/' + surl(`mode`));
  }

  saveNoticeWay(cfg) {
    return put(this.http, 'alert/' + surl(`mode`), cfg);
  }
}
