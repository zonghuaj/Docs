import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {get, post, surl} from "admin-ui-angular-common";
import {Observable} from "rxjs";

@Injectable()
export class PipelineTemplateService {
  constructor(private http: _HttpClient) {
  }

  createTemplate(template): Observable<any> {
    return post(this.http, `pipeline/${surl('pipelineTemplates')}`, template);
  }

  editTemplate() {
  }

  getAllTemplates(pageNumber = 1, pageSize = 10,
                  name = '',
                  isGenerateImage: boolean | string = '',
                  isDeploy: boolean | string = '') {
    const param = {pageNumber, pageSize, name, isGenerateImage, isDeploy};
    return get(this.http, `pipeline/${surl('pipelineTemplates')}`, param);
  }

  removeTemplate() {

  }
}
