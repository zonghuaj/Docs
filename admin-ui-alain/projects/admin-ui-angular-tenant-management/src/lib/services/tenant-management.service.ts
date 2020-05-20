import { Injectable } from '@angular/core';
import { surlWithoutProject, URL_BASE, deleteMethod, put, post, get } from 'admin-ui-angular-common';
import { _HttpClient } from '@delon/theme';
const TENANTS = 'tenants';
@Injectable({
  providedIn: 'root'
})
export class TenantManagementService {
  url = `${URL_BASE}${surlWithoutProject(TENANTS)}`;
  get tenantUrl() {
    return this.url;
  }
  constructor(
    private http: _HttpClient
  ) { }

  deleteTenantById(tenantId: string) {
    return deleteMethod(this.http, `${surlWithoutProject(TENANTS)}/${tenantId}`);
  }
  updateTenant(tenant, isUpdate: boolean) {
    if (!isUpdate) {
      return post(this.http, `${surlWithoutProject(TENANTS)}`, tenant);
    } else {
      return put(this.http, `${surlWithoutProject(TENANTS)}/${tenant.id}`, tenant);
    }
  }
  getFreeNodeList() {
    return get(this.http, `${surlWithoutProject('node')}`, { ifFree: true });
  }
}
