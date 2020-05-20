import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema, SFComponent } from '@delon/form';

import { put, surlWithoutProject } from 'admin-ui-angular-common';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-list-edit',
  templateUrl: './resetPwd.component.html',
})
export class UserListResetPasswordComponent implements OnInit {

  record: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;

  schema: SFSchema = {
    properties: {
      password: { type: 'string', title: '新密码', ui: { type: 'password', visibleIf: { update: [false] } } },
      temporary : { type: 'boolean', title: '临时密码', ui: {optionalHelp: '开启后，用户在下次登陆后需修改密码', visibleIf: { update: [false] }} },
    },
    required: ['password', 'temporary'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient) {

  }

  save(value: any) {
    const user = value;
    put(this.http, `uma/${surlWithoutProject(`users/${user.id}/reset_password`)}`, this.sf.value).subscribe(result => {
        this.msgSrv.success('重置密码成功');
        this.modal.close(value);
      });
  }
  ngOnInit(): void {
  }
  close() {
    this.modal.destroy();
  }
}
