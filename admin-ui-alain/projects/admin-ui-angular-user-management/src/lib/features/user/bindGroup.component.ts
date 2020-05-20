import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFComponent } from '@delon/form';

import { post, surlWithoutProject } from 'admin-ui-angular-common';
import { _HttpClient } from '@delon/theme';
import { BindGroupService } from './bindGroup.service';

@Component({
  selector: 'app-user-list-edit',
  templateUrl: './bindGroup.component.html',
  providers: [ BindGroupService ]
})
export class UserListBindGroupComponent implements OnInit {
  userId = '';

  record: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;
  schema = {
    properties: {
      roles: {
        type: 'number',
        title: '角色',
        enum: [],
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
          // asyncData: () =>
          //   zget(this.http, `${surlWithoutProject('groups/all')}`),
        },
        default: [],
      },
    },
  };

  
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient,
    private service: BindGroupService) {

  }

  submit() {
      const url = surlWithoutProject(`users/${this.userId}/roleMapping`);
      const roleIds = this.sf.value.roles;
      post(this.http, url, {roles: this.sf.value.roles}).subscribe(result => {
        this.msgSrv.success('绑定成功');
        this.modal.close();
      });
  }
  ngOnInit(): void {
    // const url = surlWithoutProject(`users/${this.userId}/groups`);
    // zget(this.http, url).subscribe((data: any ) => {
    //   const dataList = [];
    //   data.rows.forEach((element: any) => {
    //     dataList.push(element.id);
    //   });
     
    // });

    this.service.getUserRoles(this.userId).subscribe((data: any) => {
      this.schema.properties.roles.default = data;
      this.sf.refreshSchema();
    });
    this.service.getAllRoles().subscribe((data: any[]) => {
      this.schema.properties.roles.enum = data;
      this.sf.refreshSchema();
    });
  }
  searchChange(event){

  }
  close() {
    this.modal.destroy();
  }
}
