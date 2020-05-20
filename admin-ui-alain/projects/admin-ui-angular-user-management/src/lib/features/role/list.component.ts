import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';

import {STColumn, STPage, STComponent, STReq, STRes} from '@delon/abc';
import {URL_PREFIX} from '@app/services/services.util';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {RoleListEditComponent} from './edit.component';
import {ModalHelper} from '@delon/theme';
import {deleteMethod, surlWithoutProject} from 'admin-ui-angular-common';
import {_HttpClient} from '@delon/theme';
import {RoleBindProjectResourceComponent} from './bindProject.component';
import {RoleBindAPIResourceComponent} from './bindApi.component';
import {RoleBindMenuResourceComponent} from './bindMenu.component';

@Component({
  selector: 'app-role-list-layout',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card>
      <nz-row class="mb-md">
        <button nz-button (click)="openAdd()" [nzType]="'primary'">
          <i nz-icon nzType="plus"></i>
          <span>新建</span>
        </button>
      </nz-row>
      <st #groupsSt [data]="url" [columns]="columns" [req]="req" [res]="res" [page]="stPage"></st>
    </nz-card>
  `,
})
export class RoleListLayoutComponent implements OnInit {
  private router$: Subscription;
  url = `${URL_PREFIX}${surlWithoutProject('roles')}`;
  // username = '';
  params: any = {username: ''};
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
      // total: 'data.count',
      list: 'data'
    }
  };
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  columns: STColumn[] = [
    // { title: '编号', index: 'id', width: 300, hidden: true },
    {title: '名称', index: 'name'},
    {
      title: '操作',
      width: 240,
      buttons: [
        // {
        //   text: '编辑',
        //   click: item => this.openEdit(item) ,
        // },
        // {
        //   text: '删除',
        //   type: 'del',
        //   click: item => this.delete(item.id),
        // },
        {
          text: '绑定工程',
          click: item => this.bindProject(item),
        },
        {
          text: '绑定API',
          click: item => this.bindAPI(item),
        },
        {
          text: '绑定菜单',
          click: item => this.bindMenu(item),
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
    const record: any = {update : false};
    this.modal.create(RoleListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      this.st.reload();
    });
  }

  openEdit(record: any = {}) {
    record.update = true;
    this.modal.create(RoleListEditComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  bindProject(record: any = {}) {
    this.modal.create(RoleBindProjectResourceComponent, {role: record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  bindAPI(record: any = {}) {
    this.modal.create(RoleBindAPIResourceComponent, {role: record}, {size: 'lg'}).subscribe(res => {
      this.st.reload();
    });
  }

  bindMenu(record: any = {}) {
    this.modal.create(RoleBindMenuResourceComponent, {role: record}, {size: 'lg'}).subscribe(res => {
      this.st.reload();
    });
  }

  delete(userId) {
    deleteMethod(this.http, `${surlWithoutProject('users')}/${userId}`).subscribe(result => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }
}
