import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ImageTemplate, ImageTemplateList} from '../entities/image-template.entity';
import {get, post, put, deleteMethod} from 'admin-ui-angular-common';
import {_HttpClient} from '@delon/theme';

@Injectable()
export class AdminUiAngularImageTemplateService {

  constructor(private http: _HttpClient) {
  }

  getAllTemplates(pageNumber = 1, pageSize = 10,
                  name = ''): Observable<ImageTemplateList> {
    const params = {pageNumber, pageSize, name};
    return get(this.http, tpUrl('imagesTemplates'), params);
  }

  getTemplateDetail(id): Observable<ImageTemplate> {
    return get(this.http, tpUrl(`imagesTemplates/${id}`));
  }

  createTemplate(tmpl): Observable<any> {
    return post(this.http, tpUrl('imagesTemplates'), tmpl);
  }

  editTemplate(tmpl): Observable<any> {
    return put(this.http, tpUrl(`imagesTemplates/${tmpl.id}`), tmpl);
  }

  deleteTemplate(id): Observable<any> {
    return deleteMethod(this.http, tpUrl(`imagesTemplates/${id}`));
  }
}

function tpUrl(targetPath) {
  return `pipeline/$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}

function tUrl(targetPath) {
  return `pipeline/$TENANT_ID/${targetPath}`;
}
