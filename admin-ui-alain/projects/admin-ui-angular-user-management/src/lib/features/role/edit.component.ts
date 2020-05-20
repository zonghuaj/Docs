import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema, SFComponent } from '@delon/form';

import {post, put, surlWithoutProject} from 'admin-ui-angular-common';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-group-list-edit',
  template: `<div class="modal-header">
            <div class="modal-title">角色编辑</div>
            </div>
            <sf #sf mode="edit" [schema]="schema" [formData]="record" button="none">
              <div class="modal-footer">
                <button nz-button type="button" (click)="close()">关闭</button>
                <button nz-button type="submit" [nzType]="'primary'" (click)="save(sf.value)" [disabled]="!sf.valid">保存</button>
              </div>
            </sf>
            `,
})
export class RoleListEditComponent implements OnInit {

  record: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;

  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '组名' },
      update: { type: 'boolean', ui: { hidden: true } },
      // password: { type: 'string', title: '密码', ui: { type: 'password', visibleIf: { update: [false] } } },
      // email: { type: 'string', title: '邮箱', format: 'email', ui: { uiEmailSuffixes: ['accenture.com'] } },
      // firstName: { type: 'string', title: '姓' },
      // lastName: { type: 'string', title: '名' },
      // enabled: { type: 'boolean', title: '是否启用' },
    },
    required: ['name'],
    // ui: {
    //   spanLabelFixed: 150,
    //   grid: { span: 24 },
    // },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient) {

  }

  save(value: any) {
    const group = value;
    if ( group.update ) {
      delete group.update;
      put(this.http, `${surlWithoutProject('roles')}`, this.sf.value).subscribe(result => {
        this.msgSrv.success('更新成功');
        this.modal.close(value);
      });
    } else {
      delete group.update;
      post(this.http, `${surlWithoutProject('roles')}`, group).subscribe(result => {
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
