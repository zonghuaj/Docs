import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

import {post, surlWithoutProject} from "admin-ui-angular-common";
import { _HttpClient } from '@delon/theme';
import { RoleService } from './role.service';
@Component({
  selector: 'app-user-list-edit',
  template: `<div class="modal-header">
              <div class="modal-title">绑定菜单</div>
            </div>
            <nz-transfer
            [nzDataSource]="list"
            [nzListStyle]="{ 'width.px': 400, 'height.px': 500 }"
            [nzTitles]="['未绑定', '已绑定']"
            (nzChange)="change($event)"
          >
          </nz-transfer>
           `,
  providers: [ RoleService ]
})
export class RoleBindMenuResourceComponent implements OnInit {
  userId = '';
  list: any[] = [];
  role: any = {};
  update: false;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient,
    private service: RoleService) {

  }

  submit() {
  }
  change(ret: any ): void {
    console.log('nzChange', ret);
    if (ret.from === 'right') {
      // do delete options
      const url = surlWithoutProject(`roles/${this.role.name}/unbindRoleMapping`);
      // const resourceIds = ret.list.map((item: any) => item.key);
      post(this.http, url, { resources: ret.list}).subscribe(result => {
        this.msgSrv.success('解绑成功');
        // this.modal.close();
      });
    } else {
      // do add options
      const url = surlWithoutProject(`roles/${this.role.name}/roleMapping`);
      // const resourceIds = ret.list.map((item: any) => item.key);
      post(this.http, url, { resources: ret.list, type: 'ui:menu'}).subscribe(result => {
        this.msgSrv.success('绑定成功');
        // this.modal.close();
      });
    }

  }
  ngOnInit(): void {

    this.service.getOwnerMenuResource(this.role.name).subscribe((data: any) => {
      this.list = data;
    });
  }
  searchChange(event) {

  }
  close() {
    this.modal.destroy();
  }
}
