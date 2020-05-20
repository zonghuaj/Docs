import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable,} from 'rxjs';
import {surl, surlWithoutProject, get, post, put, deleteMethod} from "admin-ui-angular-common";
import {CacheService} from "@delon/cache";
import {ProjectEntity, ProjectListEntity} from "./project.entities";

@Injectable()
export class ProjectManageService {
  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  createProject(pe: ProjectEntity): Observable<ProjectEntity> {
    return post(this.http, surlWithoutProject(`project`), pe);
  }

  getAllProjects(currentPage: number = 1,
                 pageSize: number = 100,
                 projectName: string = '',
                 projectDesc: string = ''): Observable<ProjectListEntity> {
    const params = {projectName, currentPage, pageSize, projectDesc};
    return get(this.http, surlWithoutProject(`project`), params);
  }

  getProjectByCode(code: string): Observable<any> {
    return get(this.http, surlWithoutProject(`project/${code}/name`));
  }

  getProjectInfo(id: number): Observable<any> {
    return get(this.http, surlWithoutProject(`project/${id}`));
  }

  editProject(pe: ProjectEntity): Observable<any> {
    return put(this.http, surl(`project/${pe.projectId}`), pe);
  }

  deleteProject(id: number): Observable<any> {
    return deleteMethod(this.http, surlWithoutProject(`project/${id}`));
  }

  getTenantLimit(): Observable<any> {
    return get(this.http, surlWithoutProject(`resourceLimit`));
  }

  getDashboardData(): Observable<any> {
    return get(this.http, surlWithoutProject(`dashboard/tenant`));
  }
}
