import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {zget, surl} from "admin-ui-angular-common";
import {Observable} from "rxjs";

@Injectable()
export class ImageTemplateService {
  constructor(private http: _HttpClient) {
  }

  createTemplate(template) {
  }

  editTemplate() {
  }

  getAllTemplates(currentPage = 1, pageSize = 100): Observable<any> {
    const params = {currentPage, pageSize};
    return zget(this.http, `pipeline/${surl('imagesTemplates')}`, params);
  }

  removeTemplate() {

  }
}
