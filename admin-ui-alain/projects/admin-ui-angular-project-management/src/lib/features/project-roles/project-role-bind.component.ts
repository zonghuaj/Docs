import {Component, ViewChild, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {ProjectRoleService} from './project-role.service';
import {ActivatedRoute, Router} from "@angular/router";
import {STColumn, STPage} from "@delon/abc";
import {ProjectUserService} from "./project-user.service";

@Component({
  selector: 'project-role-bind',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card nzTitle="绑定用户">
      <nz-row nzGutter="16">
        <nz-col nzSpan="12">
          <se-container labelWidth="100" col="1">
            <se label="用户名" error="请输入用户名" required>
              <nz-select
                class="width100"
                nzMode="multiple"
                nzPlaceHolder="选择用户"
                [nzMaxTagCount]="5"
                [(ngModel)]="selectedUsers">
                <nz-option *ngFor="let u of fullUserList" [nzLabel]="u.name" [nzValue]="u.id"></nz-option>
              </nz-select>
            </se>
          </se-container>
        </nz-col>
        <nz-col nzSpan="4" style="padding-top: 4px">
          <button nz-button nzType="primary"
                  (click)="bindUser()"
                  [disabled]="selectedUsers.length === 0"
                  [nzLoading]="bindLoading">添加成员
          </button>
        </nz-col>
      </nz-row>

      <nz-divider nzType="horizontal"></nz-divider>

      <st #st [data]="bindedUsers" [columns]="columns" [page]="stPage" [total]="total">
        <ng-template st-row="operations" let-i>
          <nz-popconfirm [nzTitle]="'确认删除当前成员？'" (nzOnConfirm)="unbindUser(i)">
            <a nz-popconfirm>删除</a>
          </nz-popconfirm>
        </ng-template>
      </st>
    </nz-card>
  `,
  providers: [ProjectRoleService, ProjectUserService]
})
export class ProjectRoleBindComponent implements OnInit {
  roleId: string;

  columns: STColumn[] = [
    // { title: '编号', index: 'id', width: 300, hidden: true },
    {title: '名称', index: 'username'},
    {title: '电话', index: 'phone'},
    {title: '邮箱', index: 'email'},
    {title: '操作', render: 'operations'},
  ];
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  total;

  fullUserList;
  selectedUsers = [];

  bindedUsers;

  bindLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private http: _HttpClient,
    private roleService: ProjectRoleService,
    private userService: ProjectUserService) {
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('roleId');

    this.getAllUsers();
    this.getBindedUser();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.fullUserList = res.rows.map(u => ({
        id: u.id,
        name: u.username,
      }));
    })
  }

  getBindedUser() {
    this.roleService.getBindedUser(this.roleId).subscribe(res => {
      this.bindedUsers = res.map(u => {
        try {
          u.phone = u.attributes.phoneNumber[0];
        } catch (e) {
          u.phone = '';
        }
        return u;
      });
    });
  }

  bindUser() {
    this.bindLoading = true;

    this.roleService.bindTenantUser(this.roleId, this.selectedUsers)
      .subscribe(res => {
        this.bindLoading = false;
        this.msg.success('添加成功');
        this.selectedUsers = [];
        this.getBindedUser();
      }, err => {
        this.bindLoading = false;
        this.msg.error('添加失败');
      });
  }

  unbindUser(item) {
    this.roleService.unbindTenantUser(item.id).subscribe(res => {
      this.getBindedUser();
      this.msg.success('删除成功');
    }, err => {
      this.msg.success('删除失败');
    });
  }
}
