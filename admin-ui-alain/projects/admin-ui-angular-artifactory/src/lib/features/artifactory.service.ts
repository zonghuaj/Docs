import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {deleteMethod, get, post, put} from "admin-ui-angular-common";
import {_HttpClient} from "@delon/theme";
import {StageFlowItem} from "./artifactory.entities";

function artfUrl(targetPath) {
  return `artifactory/$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}

function surl(targetPath) {
  return `artifactory/$TENANT_ID/${targetPath}`;
}

@Injectable()
export class ArtifactoryService {
  constructor(private http: _HttpClient) {
  }

  checkStageAvailable(s: StageFlowItem) {
    return s.name && s.confirmGroupId && s.deployGroupId && s.deployUrl;
  }

  createArtifactory(name: string, comment: string): Observable<any> {
    return post(this.http, artfUrl('artifactory'), {name, comment});
  }

  editArtifactory(id, name: string, comment: string): Observable<any> {
    return put(this.http, artfUrl(`artifactory/${id}`), {name, comment});
  }

  getAllArtifactorys(currentPage = 1, pageSize = 100, name = ''): Observable<any> {
    return get(this.http, artfUrl('artifactory'), {name, currentPage, pageSize});
  }

  getArtifactoryDetail(id): Observable<any> {
    return get(this.http, artfUrl(`artifactory/${id}`));
  }

  deleteArtifactory(id): Observable<any> {
    return deleteMethod(this.http, artfUrl(`artifactory/${id}`));
  }

  createArtVersion(artifactoryId: string, lastVersion: string): Observable<any> {
    return post(this.http, surl('artifactoryVersion'), {artifactoryId, lastVersion});
  }

  getAllArtVersions(currentPage = 1, pageSize = 100, name = ''): Observable<any> {
    return get(this.http, surl('artifactoryVersion'));
  }

  getArtVersionDetail(vid): Observable<any> {
    return get(this.http, surl(`artifactoryVersion/${vid}`));
  }

  deleteArtVersion(id): Observable<any> {
    return deleteMethod(this.http, surl(`artifactoryVersion/${id}`));
  }

  editArtVersion(id): Observable<any> {
    return deleteMethod(this.http, surl(`artifactory/${id}`));
  }

  editArtVersionFlows(vid, stages): Observable<any> {
    return post(this.http, artfUrl(`artifactoryVersion/${vid}/workflow`), {stages});
  }

  getWorkFlow(vid: string) {
    return get(this.http, artfUrl(`artifactoryVersion/${vid}/workflow`));
  }

  getWorkFlowInstance(vid: string) {
    return get(this.http, artfUrl(`artifactoryVersion/${vid}/workflow/instance`));
  }

  startFlowInstance(vid): Observable<any> {
    return post(this.http, artfUrl(`artifactoryVersion/${vid}/workflow/start`));
  }

  auditArtVersionFlows(vid: string,
                       stageId: number,
                       aprroveType: 'DEPLOY' | 'CONFIRM',
                       apporveResult: 'APPROVED' | 'REJECTED',
                       comment?): Observable<any> {
    const params = {stageId, aprroveType, apporveResult, comment};
    return post(this.http, artfUrl(`artifactoryVersion/${vid}/workflow/approve`), params);
  }

  saveArtifRuntimeParams(id, p): Observable<any> {
    return put(this.http, surl(`runtimeParams/${id}`), p);
  }

  updateArtifDeployParams(id, p): Observable<any> {
    return put(this.http, surl(`deployParams/${id}`), p);
  }

  createArtifDeployParams(p): Observable<any> {
    return post(this.http, surl(`deployParams`), p);
  }

  //get used artifactory flow for all stage- sprint16
  getArtifactoryFlowAvailableStages(): Observable<any> {
    return get(this.http, `artifactory/$TENANT_ID/artifact/flow/stages`, {});
    //return zMock(this.http, `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/availableStagess`, {});
  }

  // save new artifactory flow - sprint16
  postSaveNewArtifactoryFlow(obj: any): Observable<any> {
    return post<any>(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/save`, obj);
  }

  // get artifactory flow use flowid - sprint 16
  getArtifactoryFlowDataById(id: number): Observable<any> {
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/pipelines/${id}`);
  }

  // get artifactory sence use sence id - sprint 16
  getArtifactoryFlowDataThroughSenceId(id: number): Observable<any> {
    //return zMock(this.http , `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/getSencesData`);
     return get(this.http, `artifactory/$TENANT_ID/artifact/flow/scenes/?scenes=${id}`);
  }

   // get Cascader data - sprint16
   getCascaderData(dataSourceType , params): Observable<any> {
    // return zMock(this.http, `http://mock.micropaas.ies/mock/5d37bb580306d80022f212d6/example/getCascaderData`, {});
    return get(this.http, `pipeline/$TENANT_ID/project/$PROJECT_CODE/dataSource/${dataSourceType}/values?params=${params}`);
  }

  //get template list
  getAllArtifactorysTemplate(currentPage = 1, pageSize = 100, name = ''): Observable<any> {
    return get(this.http, `artifactory/$TENANT_ID/flow`, {name, currentPage, pageSize});
  }
}
