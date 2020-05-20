import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {CacheService} from "@delon/cache";
import {PMember} from "../project-detail/members/project-membert.entities";
import {get, surlWithoutProject} from "admin-ui-angular-common";

@Injectable()
export class ProjectUserService {
  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  getUsers(username = '', pageNumber = 0, pageSize = 999): Observable<PMember[]> {
    const params = {username, pageNumber, pageSize};
    return get(this.http, 'uma/' + surlWithoutProject('users'), params);
  }
}
