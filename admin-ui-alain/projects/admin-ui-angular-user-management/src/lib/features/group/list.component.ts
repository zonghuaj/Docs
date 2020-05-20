import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';

import {STColumn, STPage, STComponent, STReq, STRes} from '@delon/abc';
import {URL_BASE  as URL_PREFIX, get, deleteMethod, surlWithoutProject, surl} from 'admin-ui-angular-common';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {GroupListEditComponent} from './edit.component';
import {ModalHelper} from '@delon/theme';
import {_HttpClient} from '@delon/theme';

@Component({
  selector: 'app-group-list-layout',
  templateUrl: './list.component.html',
})
export class GroupListLayoutComponent implements OnInit {
  url = `${URL_PREFIX}uma/${surl('groups')}`;
  params: any = {groupName: ''};
  @ViewChild('groupsSt')
  st: STComponent;
  req: STReq = {
    reName: {
      pi: 'pageNumber',
      ps: 'pageSize'
    },
  };
  // 定义返回的参数
  res: STRes = {
    reName: {
      total: 'data.count',
      list: 'data.rows'
    }
  };
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  columns: STColumn[] = [
    {title: '组名', index: 'groupName'},
    // {title: '访问路径', index: 'path'},
    {
      title: '操作',
      width: 120,
      buttons: [
        {
          text: '编辑',
          click: item => this.openEdit(item),
        },
        {
          text: '删除',
          type: 'del',
          click: item => this.delete(item.groupId),
        },
      ],
    },
  ];
  record: any = {};

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private modal: ModalHelper,
    private message: NzMessageService,
    private http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
  }

  openAdd() {
    const record: any = {update: false};
    this.modal.create(GroupListEditComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  openEdit(record: any = {}) {
    get(this.http, `uma/${surlWithoutProject('groups/members')}/${record.groupId}`).subscribe((result: any) => {
      record.userIds = result.rows;
      record.update = true;
      this.modal.create(GroupListEditComponent, {record}, {size: 'md'}).subscribe(res => {
        this.st.reload();
      });
    });
  }

  delete(groupId) {
    deleteMethod(this.http, `uma/${surl('groups')}/${groupId}`).subscribe(result => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }
}
