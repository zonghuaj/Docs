import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {interval, Observable, Subject, Subscription} from 'rxjs';
import {
  DockerfileEntity,
  DockerfileListEntity,
  JenkinsConfigEntity,
  JenkinsConfigListEntity,
  JenkinsfileEntity,
  JenkinsfileListEntity,
  PipelineEntity,
  ProjectEntity,
  ProjectListEntity,
  ProjectTypeEntity,
  ProjectTypesListEntity,
} from "./devops.entities";
import {
  surlWithDockerfile,
  surlWithJenkinsConfig,
  surlWithJenkinsfile,
  surlWithPipeline, surlWithPipelineDetialLog,
  surlWithProject,
  surlWithProjectTypes,
} from "./devops.utils";
import {CacheService} from "@delon/cache";
import {surl, deleteMethod, get, post, put} from "admin-ui-angular-common";
import {mergeMap} from "rxjs/operators";

@Injectable()
export class DevopsService {

  statusSubscriber$: Subscription;
  readonly AUTO_REFRESH_INTERVAL = 8 * 1000;
  vsSubject: Subject<PipelineEntity[]>;

  constructor(private http: _HttpClient, private cache: CacheService) {
  }

  startWatchingVStatus(pageNumber: any, pageSize: any): Observable<PipelineEntity[]> {

    this.stopWatchingVStatus(); // clear previous first
    this.vsSubject = new Subject();
    this.statusSubscriber$ = interval(this.AUTO_REFRESH_INTERVAL).pipe(
      mergeMap(() => this.getPipeline(pageNumber, pageSize))
    ).subscribe((ss: PipelineEntity[]) => {
      this.vsSubject.next(ss);
    });
    return this.vsSubject.asObservable();
  }

  getPipelineMonitor(id: number): Observable<PipelineEntity[]> {
    return get<PipelineEntity[]>(this.http,
      // this service/0/ <--- is '0' useless
      surl(`service/${id}/monitor/version`));
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

  // get pipeline list
  getPipeline(pageNumber: number = 1,
              pageSize: number = 10): Observable<PipelineEntity[]> {
    const params = {pageNumber, pageSize};
    return get<PipelineEntity[]>(this.http, 'pipeline/' + surlWithPipeline(), params);
  }

  // run pipeline
  runPipeline(id: any): Observable<any> {
    return post(this.http, `pipeline/${surlWithPipeline()}/${id}/run`);
  }

  // stop pipeline
  stopPipeline(id: any): Observable<any> {
    return get(this.http, `pipeline/${surlWithPipeline()}/${id}/stop`);
  }

  //pipeLine Edit
  //get 代码仓库
  getPipeLineCodeStoe(currentPage: number = 0,
    pageSize: number = 100, type: string): Observable<any> {
      //return get(this.http, `pipeline/$TENANT_ID/ea?pageSize=${pageSize}&currentPage=${currentPage}&type=${type}`);
      return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/ea?pageSize=${pageSize}&currentPage=${currentPage}&type=${type}`);
  }

  getPipeLineCodeUrl(codeStoeId: number): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/gitlab/${codeStoeId}/projects`);
  }

  getPipeLineBarnch(codeStoeId: string, codeUrlId: number, type: string): Observable<any> {
     return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/${type}/${codeStoeId}/projects/${codeUrlId}/branch`);
  }

  getPipeLineTemps(): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelineTemplates`);
  }

  getPipeLineTempsparms(tempId: number): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelineTemplates/${tempId}`);
  }

  getPipeLineService(): Observable<any> {
    return get(this.http, `$TENANT_ID/project/$PROJECT_CODE/service`);
  }

  getPipeLineArti(currentPage: number = 0,
    pageSize: number = 100): Observable<any> {
      return get(this.http, `artifactory/$TENANT_ID/project/$PROJECT_CODE/artifactory?pageSize=${pageSize}&currentPage=${currentPage}`);
  }

  postPipeLine(obj: any): Observable<any> {
    return post<any>(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipeline`, obj);
  }

  putPipeLine(obj: any, pipeLineId: number): Observable<any> {
    return put<any>(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipeline/${pipeLineId}`, obj);
  }

  delPipeLine(pipeLineId: number): Observable<any> {
   // return deleteMethod<any>(this.http,  `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipeline/${pipeLineId}`);
   return deleteMethod<any>(this.http,  `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/${pipeLineId}`);
  }

  getPipeLineInfo(id: number): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/${id}`);
  }

 // getPipeLineSerice()

  // get pipeline logs
  getPipelineLog(pageNumber: number = 1,
                 pageSize: number = 10, pipelineId: number): Observable<PipelineEntity[]> {
    const params = {pageNumber, pageSize};
    return get<PipelineEntity[]>(this.http, 'pipeline/' + surlWithPipelineDetialLog() + `/${pipelineId}`, params);
  }

  // get pipeline logs detail
  getPipelineBuildNumberLog(pageNumber: number = 1,
                            pageSize: number = 10, pipelineId: number, buildNumber: number): Observable<PipelineEntity[]> {
    const params = {pageNumber, pageSize};
    return get<PipelineEntity[]>(this.http, 'pipeline/' + surlWithPipelineDetialLog() + `/${pipelineId}/${buildNumber}`, params);
  }

  // get pipeline logs detail
  getPipelineBuildNumberLogDetail(pipelineId: number, buildNumber: number, logId: number): Observable<PipelineEntity[]> {
    return get<PipelineEntity[]>(this.http, 'pipeline/' + surlWithPipelineDetialLog() + `/${pipelineId}/${buildNumber}/${logId}`, {});
  }


  // get pipeline logs detail test
  getPipelineBuildNumberLogDetailText(pipelineId: number, buildNumber: number, logId: number,detailId:number): Observable<PipelineEntity[]> {
    return get<PipelineEntity[]>(this.http, 'pipeline/' + surlWithPipelineDetialLog() + `/${pipelineId}/${buildNumber}/${logId}/${detailId}`, {});
  }

  //get used pipeline for all stage- sprint14
  getPipelineAvailableStages(): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/pipeline/availableStages`, {});
    //return zMock(this.http, `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/availableStagess`, {});
  }


  // get Cascader data - sprint14
  getCascaderData(dataSourceType , params): Observable<any> {
    // return zMock(this.http, `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/getCascaderData`, {});
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/dataSource/${dataSourceType}/values?params=${params}`);
  }

  // save new pipeline - sprint14
  postSaveNewPipeLine(obj: any): Observable<any> {
    return post<any>(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/save`, obj);
  }

  // get pipedata use pipelineid - sprint 14
  getPipeLineData(id: number): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/${id}`);
  }

  // get pipedata use sence id - sprint 14
  getPipeLineStageDataThroughSenceId(id: number): Observable<any> {
    //return zMock(this.http , `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/getSencesData`);
     return get(this.http, `pipeline/$TENANT_ID/develop/sences/${id}`);
  }

  // save new pipeline - sprint17
  saveNewService(obj: any): Observable<any> {
    return post<any>(this.http, `$TENANT_ID/project/$PROJECT_CODE/quickly/service`, obj);
  }
}
