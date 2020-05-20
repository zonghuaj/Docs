import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {
  DockerfileEntity,
  DockerfileListEntity,
  JenkinsfileListEntity,
  JenkinsfileEntity,
  JenkinsConfigListEntity,
  JenkinsConfigEntity,
  ProjectTypeEntity,
  ProjectEntity,
  ProjectListEntity,
  ProjectTypesListEntity,
} from "./platform.entities";
import {
  surlWithDockerfile,
  surlWithJenkinsfile,
  surlWithJenkinsConfig,
  surlWithProjectTypes,
  surlWithProject,
} from "./platform.utils";
import {get, post, put, deleteMethod} from "admin-ui-angular-common";

import {CacheService} from "@delon/cache";

@Injectable()
export class PlatformManageService {
  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  // get data
  getDockerfiles(currentPage: number = 1,
                 pageSize: number = 100, projectType: string): Observable<DockerfileListEntity> {
    const params = {currentPage, pageSize, projectType};
    return get<DockerfileListEntity>(this.http, surlWithDockerfile(), params);
  }

  // insert date
  postDockerfiles(newDockerfile: DockerfileEntity): Observable<DockerfileListEntity> {
    return post<DockerfileListEntity>(this.http, surlWithDockerfile(), newDockerfile);
  }

  putDockerfiles(newDockerfile: DockerfileEntity): Observable<DockerfileListEntity> {
    return put(this.http, surlWithDockerfile() + '/' + newDockerfile.dockerfileId, newDockerfile);
  }

  delDockerfiles(dockerfileId: number): Observable<DockerfileListEntity> {
    return deleteMethod(this.http, surlWithDockerfile() + '/' + dockerfileId);
  }

  //---------------------------------------------------------------------------------
  // get data
  getJenkinsfiles(currentPage: number = 1,
                  pageSize: number = 100, projectType: string): Observable<JenkinsfileListEntity> {
    const params = {currentPage, pageSize, projectType};
    return get<JenkinsfileListEntity>(this.http, surlWithJenkinsfile(), params);
  }

  // insert date
  postJenkinsfiles(newJenkinsfile: JenkinsfileEntity): Observable<JenkinsfileListEntity> {
    return post<JenkinsfileListEntity>(this.http, surlWithJenkinsfile(), newJenkinsfile);
  }

  putJenkinsfiles(newJenkinsfile: JenkinsfileEntity): Observable<JenkinsfileListEntity> {
    return put(this.http, surlWithJenkinsfile() + '/' + newJenkinsfile.deploymentId, newJenkinsfile);
  }

  delJenkinsfiles(deploymentId: number): Observable<JenkinsfileListEntity> {
    return deleteMethod(this.http, surlWithJenkinsfile() + '/' + deploymentId);
  }

  // get data
  getJenkinsConfig(currentPage: number = 1,
                   pageSize: number = 100): Observable<JenkinsConfigListEntity> {
    const params = {currentPage, pageSize};
    return get<JenkinsConfigListEntity>(this.http, surlWithJenkinsConfig(), params);
  }

  putJenkinsConfig(newJenkinsConfig: JenkinsConfigEntity): Observable<JenkinsConfigListEntity> {
    return put(this.http, surlWithJenkinsConfig() + '/' + newJenkinsConfig.jenkinsConfigId, newJenkinsConfig);
  }

  delJenkinsConfig(jenkinsConfigId: number): Observable<JenkinsConfigListEntity> {
    return deleteMethod(this.http, surlWithJenkinsConfig() + '/' + jenkinsConfigId);
  }

  // get data
  getProjectTypes(currentPage: number = 1,
                  pageSize: number = 100): Observable<ProjectTypesListEntity> {
    const params = {currentPage, pageSize};
    return get<ProjectTypesListEntity>(this.http, surlWithProjectTypes(), params);
  }

  postProjectTypes(newProjectType: ProjectTypeEntity): Observable<ProjectTypesListEntity> {
    return post<ProjectTypesListEntity>(this.http, surlWithProjectTypes(), newProjectType);
  }

  putProjectTypes(newProjectType: ProjectTypeEntity): Observable<ProjectTypesListEntity> {
    return put(this.http, surlWithProjectTypes() + '/' + newProjectType.id, newProjectType);
  }

  delProjectTypes(id: number): Observable<ProjectTypesListEntity> {
    return deleteMethod(this.http, surlWithProjectTypes() + '/' + id);
  }

  // get data
  getProject(currentPage: number = 1,
             pageSize: number = 100): Observable<ProjectListEntity> {
    const params = {currentPage, pageSize};
    return get<ProjectListEntity>(this.http, surlWithProject(), params);
  }

  putProject(newProject: ProjectEntity): Observable<ProjectListEntity> {
    return put(this.http, surlWithProject() + '/' + newProject.projectId, newProject);
  }

}
