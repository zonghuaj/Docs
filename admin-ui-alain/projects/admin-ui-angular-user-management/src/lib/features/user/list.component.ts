import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';

import {STColumn, STPage, STComponent, STReq, STRes} from '@delon/abc';
import {URL_PREFIX} from '@app/services/services.util';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {UserListEditComponent} from './edit.component';
import {UserListBindGroupComponent} from './bindGroup.component';
import {ModalHelper} from '@delon/theme';
import {deleteMethod, surlWithoutProject} from 'admin-ui-angular-common';
import {_HttpClient} from '@delon/theme';
import {UserListResetPasswordComponent} from './resetPwd.component';

@Component({
  selector: 'app-list-layout',
  templateUrl: './list.component.html',
})
export class UserListLayoutComponent implements OnInit {
  private router$: Subscription;
  url = `${URL_PREFIX}uma/${surlWithoutProject('users')}`;
  // username = '';
  params: any = {username: ''};
  @ViewChild('userSt')
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
    // { title: '编号', index: 'id', width: 300, hidden: true },
    {title: '用户名', index: 'username'},
    {title: '手机号', index: 'phoneNumber'},
    {title: '姓', index: 'firstName'},
    {title: '名', index: 'lastName'},
    {title: '邮箱', index: 'email', width: 120},
    {title: '注册时间', type: 'date', index: 'createdTimestamp'},
    {
      title: '操作',
      width: 240,
      render: 'operations',
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


  isUserDisabled(i) {
    return i.level > 50;
  }

  openAdd() {
    const record: any = {update: false};
    this.modal.create(UserListEditComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  openEdit(record: any = {}) {
    record.update = true;
    this.modal.create(UserListEditComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  resetPassword(record: any = {}) {
    this.modal.create(UserListResetPasswordComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  deleteUser(user) {
    const {id, level} = user;
    deleteMethod(this.http, `uma/${surlWithoutProject('users')}/${id}?level=${level}`).subscribe(result => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }

  bindGroup(user) {
    this.modal.create(UserListBindGroupComponent, {userId: user.id}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }
}
