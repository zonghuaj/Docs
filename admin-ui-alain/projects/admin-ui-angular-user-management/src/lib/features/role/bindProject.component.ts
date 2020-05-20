import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema, SFComponent } from '@delon/form';

import {post, surlWithoutProject} from "admin-ui-angular-common";
import { _HttpClient } from '@delon/theme';
import { RoleService } from './role.service';
@Component({
  selector: 'app-user-list-edit',
  template: `<div class="modal-header">
              <div class="modal-title">绑定工程</div>
            </div>
            <nz-transfer
            [nzDataSource]="list"
            [nzTitles]="['未绑定', '已绑定']"
            (nzChange)="change($event)"
          >
          </nz-transfer>
           `,
  providers: [ RoleService ]
})
export class RoleBindProjectResourceComponent implements OnInit {
  userId = '';
  list: any[] = [];
  role: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;
  schema = {
    properties: {
      resources: {
        type: 'number',
        title: '工程资源',
        enum: [],
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
        },
        default: [],
      },
    },
  };
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
      post(this.http, url, { resources: ret.list, type: 'project:resource'}).subscribe(result => {
        this.msgSrv.success('绑定成功');
        // this.modal.close();
      });
    }

  }
  ngOnInit(): void {

    this.service.getOwnerProjectResource(this.role.name).subscribe((data: any) => {
      this.list = data;
    });
    // this.service.getProjectResource().subscribe((data: any[]) => {
    //   this.schema.properties.resources.enum = data;
    //   this.list = data;
    // });
  }
  searchChange(event) {

  }
  close() {
    this.modal.destroy();
  }
}
