import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {get} from "admin-ui-angular-common";

@Injectable()
export class TeamGroupService {
  constructor(private http: _HttpClient) {
  }

  getTeamGroup(pageNumber = 0, pageSize = 999) {
    const params = {pageNumber, pageSize};
    return get(this.http, `uma/${surl('groups')}`, params);
  }
}

function surl(targetPath: string) {
  // return `${TENANT_ID}/project/${PROJECT_CODE}/${targetPath}`;
  return `$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}
