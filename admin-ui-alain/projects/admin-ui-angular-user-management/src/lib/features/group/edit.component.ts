import {Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {SFSchema, SFComponent} from '@delon/form';

import {get, post, put, surlWithoutProject, surl} from 'admin-ui-angular-common';
import {_HttpClient} from '@delon/theme';

@Component({
  selector: 'app-group-list-edit',
  templateUrl: './edit.component.html',
})
export class GroupListEditComponent implements OnInit {

  record: any = {};
  update: false;
  @ViewChild('sf')
  sf: SFComponent;

  schema: SFSchema = {
    properties: {
      groupName: {type: 'string', title: '组名'},
      update: {type: 'boolean', ui: {hidden: true}},
      userIds: {
        type: 'string',
        title: '用户',
        default: this.record.userIds,
        ui: {
          widget: 'transfer',
          titles: ['未选', '已选'],
          asyncData: () =>
            get(this.http, `uma/${surl('users/enum')}`)
        },
      }
    },
    required: ['groupName'],
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,) {

  }

  save(value: any) {
    const group = value;
    if (this.record.update) {
      delete group.update;
      put(this.http, `uma/${surlWithoutProject('groups/users/bind')}`, this.sf.value).subscribe(result => {
        this.msgSrv.success('更新成功');
        this.modal.close(value);
      });
    } else {
      delete group.update;
      post(this.http, `uma/${surl('groups/users/bind')}`, group).subscribe(result => {
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
