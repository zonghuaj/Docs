import {Injectable} from '@angular/core';
import {switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {PMember, Role} from "./project-membert.entities";
import {get, post, put, deleteMethod, surl, surlWithoutProject} from "admin-ui-angular-common";
import {_HttpClient} from "@delon/theme";
import {ProjectManageService} from "../../project-manage.service";

@Injectable()
export class ProjectMemberControlService {
  constructor(private http: _HttpClient,
              private projService: ProjectManageService) {
  }

  getProjectMembers(projId): Observable<PMember[]> {
    return this.projService.getProjectInfo(projId).pipe(
      switchMap((res: any) => of(res.members))
    );
  }

  queryUsers(username = '', pageNumber = 0, pageSize = 100): Observable<PMember[]> {
    if (username) {
      const params = {username, pageNumber, pageSize};
      return get(this.http, surlWithoutProject('users'), params);
    } else {
      return of([]);
    }
  }

  getRoles(pageNumber = 0, pageSize = 100): Observable<Role[]> {
    const params = {pageNumber, pageSize};
    return get(this.http, surlWithoutProject('roles'), params);
  }

  deleteMember(projectId, m: PMember): Observable<any> {
    return deleteMethod(this.http, surl(`project/${projectId}/members/${m.id}`));
  }

  addMember(projectId, param): Observable<any> {
    return post(this.http, surl(`project/${projectId}/members`), param);
  }

  editMember(projectId, m: PMember): Observable<any> {
    return put(this.http, surl(`project/${projectId}/members`), m);
  }
}
