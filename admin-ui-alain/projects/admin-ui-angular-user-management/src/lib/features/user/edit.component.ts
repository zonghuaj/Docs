import {Component, ViewChild, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {SFSchema, SFComponent} from '@delon/form';

import {post, put, surlWithoutProject} from 'admin-ui-angular-common';
import {_HttpClient} from '@delon/theme';

@Component({
  selector: 'app-user-list-edit',
  templateUrl: './edit.component.html',
})
export class UserListEditComponent implements OnInit {

  record: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;

  schema: SFSchema = {
    properties: {
      username: {type: 'string', title: '用户名'},
      update: {type: 'boolean', ui: {hidden: true}},
      type: {type: 'string',ui: {hidden: true}  },
      password: {type: 'string', title: '密码', default: 'admin123', ui: {type: 'password', visibleIf: {update: [false]},optionalHelp:'初始密码 admin123'}},
      temporary: {
        type: 'boolean',
        title: '临时密码',
        ui: {optionalHelp: '开启后，用户在下次登陆后需修改密码', visibleIf: {update: [false]}}
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'regex',
        pattern: "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$"
      },
      firstName: {type: 'string', title: '姓'},
      lastName: {type: 'string', title: '名'},
      phoneNumber: {type: 'string', format: 'mobile', title: '手机号'},
      enabled: {type: 'boolean', title: '是否启用'},
    },
    required: ['username', 'password', 'phoneNumber', 'firstName', 'lastName', 'email'],
    ui: {
      spanLabelFixed: 150,
      grid: {span: 24},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient) {

  }

  save(value: any) {
    const user = value;
    if (user.update) {
      delete user.update;
      put(this.http, `uma/${surlWithoutProject('users')}`, this.sf.value).subscribe(result => {
        this.msgSrv.success('更新成功');
        this.modal.close(value);
      });
    } else {
      delete user.update;
      post(this.http, `uma/${surlWithoutProject('users')}`, user).subscribe(result => {
        this.msgSrv.success('保存成功');
        this.modal.close(value);
      });
    }
  }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
