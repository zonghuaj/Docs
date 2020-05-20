import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {STColumn, STData, STPage} from "@delon/abc";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {PMember, Role} from "./project-membert.entities";
import {ProjectMemberControlService} from "./project-member-control.service";
import {MpHeaderService} from "admin-ui-angular-common";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {ProjectMemberEditComponent} from "./project-member-edit.component";
import {ActivatedRoute} from "@angular/router";
import {ProjectUserService} from "../../project-roles/project-user.service";
import {RoleListEntity} from "../../project-roles/project-role.entities";
import {ProjectRoleService} from "../../project-roles/project-role.service";
import {CacheService} from "@delon/cache";
import {ProjectEntity} from "../../project.entities";
import {ProjectManageService} from "../../project-manage.service";

@Component({
  selector: 'project-detail-container',
  templateUrl: './project-member-control.component.html',
  styles: [``],
  providers: [ProjectMemberControlService, ProjectUserService, ProjectRoleService, ProjectManageService]
})
export class ProjectMemberControlComponent implements OnInit, OnDestroy {
  projectCode;
  form: FormGroup;

  // searchChange$ = new BehaviorSubject('');
  // userLoading: boolean;
  // possibleUsers: PMember[] = [];
  // fullUsers: PMember[] = [];
  fullUsers: { id: string, name: string }[] = [];
  selectRoles: Role[] = [];

  addLoading = false;
  loading = false;

  page: STPage = {
    front: false,
    show: false,
  };

  q: any = {
    pi: 1,
    ps: 10,
    name: '',
    desc: ''
  };
  data: PMemberData[] = [];
  totalCount: number;

  readonly columns: STColumn[] = [
    {title: '用户名', index: 'username', width: 120},
    {title: '角色', index: 'rolesString', width: '60%'},
    {title: '操作', render: 'operations'},
  ];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private headerService: MpHeaderService,
              private roleService: ProjectRoleService,
              private msg: NzMessageService,
              private modalService: NzModalService,
              private cache: CacheService,
              private userService: ProjectUserService,
              private projManService: ProjectManageService
  ) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('项目成员管理');
    this.projectCode = this.cache.getNone('projectCode');


    this.form = this.fb.group({
      users: [[], []],
      roles: [[], []],
    });

    const pid = +this.route.parent.snapshot.paramMap.get('projectId');
    this.projManService.getProjectInfo(pid)
      .subscribe((data: ProjectEntity) => {
        this.projectCode = data.projectCode;

        this.getAllUsers();
        this.getSelectRoles();
        this.getProjectMembers();
      }, error => this.msg.error('加载失败'));

    // this.searchChange$.asObservable().pipe(
    //   debounceTime(1000),
    //   switchMap(res => this.getUserList(res))
    // ).subscribe(res => {
    //   this.userLoading = false;
    //   this.possibleUsers = res;
    //
    //   this.fullUsers = [...this.fullUsers, ...this.possibleUsers];
    // }, err => {
    //   this.userLoading = false;
    // });
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.fullUsers = res.rows.map(u => ({
        id: u.id,
        name: u.username,
      }));
    })
  }

  ngOnDestroy(): void {
    this.fullUsers = null;
  }

  get users() {
    return this.form.controls.users;
  }

  get roles() {
    return this.form.controls.roles;
  }

  // onUserOpenChanged(open: boolean) {
  //   this.userLoading = false;
  //   this.possibleUsers = [];
  // }
  //
  // onUserTyped(tpd: string) {
  //   if (!tpd || tpd.length <= 1) return;
  //
  //   this.userLoading = true;
  //   this.possibleUsers = [];
  //   this.searchChange$.next(tpd);
  // }
  //
  // getUserList(uname: string): Observable<PMember[]> {
  //   return this.pmcService.queryUsers(uname).pipe(switchMap((res: any) => of(res.rows)));
  // }

  getProjectMembers() {
    this.roleService.getBindedProjectUser(this.projectCode).subscribe((res: any[]) => {
      this.data = res.map(d => ({
        ...d,
        rolesString: d.roles.map(_d => _d.roleName).join(',')
      }));
    });

    // this.pmcService.getProjectMembers(this.projectCode)
    //   .subscribe((res: PMember[]) => {
    //     this.data = res.map(d => ({
    //       ...d,
    //       rolesString: d.roles.map(_d => _d.name).join(',')
    //     }));
    //   });
  }

  getSelectRoles() {
    this.roleService.getRoles('project-console')
      .pipe(switchMap((res: RoleListEntity) => of(res.rows.map(r => ({id: r.id, name: r.name})))))
      .subscribe((res: Role[]) => this.selectRoles = res);
  }

  resetAddMemberField() {
    this.users.setValue([]);
    this.roles.setValue([]);
  }

  addMember() {
    // const users = this.form.value.users.map(mid => {
    //   const user = this.fullUsers.find(u => !!u && u.id === mid);
    //   return {
    //     id: user.id,
    //     username: user.name,
    //   };
    // });
    // const roles = this.form.value.roles.map(rid => {
    //   const role = this.selectRoles.find(r => r.id === rid);
    //   return {
    //     id: role.id,
    //     name: role.name,
    //   }
    // });
    // const param = {users, roles};
    // this.pmcService.addMember(this.projectCode, param).subscribe(res => {
    //   this.msg.success('添加成功');
    //   this.resetAddMemberField();
    //   this.getProjectMembers();
    // }, err => {
    //   this.msg.error('添加失败');
    // });

    this.addLoading = true;
    this.roleService.bindProjectUser(this.projectCode,
      this.form.value.roles,
      this.form.value.users)
      .subscribe(res => {
        this.addLoading = false;
        this.msg.success('添加成功');
        this.resetAddMemberField();
        this.getProjectMembers();
      }, err => {
        this.addLoading = false;
        this.msg.error('添加失败');
      });
  }

  deleteMember(m: PMember) {
    const uid = m.id;
    this.roleService.unbindProjectUser(this.projectCode, uid).subscribe(res => {
      this.msg.success('删除成功！');
      this.getProjectMembers();
    }, err => {
      this.msg.error('删除失败！');
    });
    // this.pmcService.deleteMember(this.projectCode, m).subscribe(res => {
    //   this.msg.success('删除成功！');
    //   this.getProjectMembers();
    // }, err => {
    //   this.msg.error('删除失败！');
    // });
  }

  showEditModal(m: PMember) {
    this.modalService.create({
      nzTitle: '编辑成员',
      nzContent: ProjectMemberEditComponent,
      nzComponentParams: {
        member: m,
        roles: this.selectRoles
      },
      nzOnOk: (componentInstance: any) => {
        this.editMember(componentInstance!.member);
      }
    });
  }

  editMember(m: PMember) {
    const rids = m.roles.map(r => r.roleId);
    const uids = [m.id];
    this.roleService.editBindedProjectUser(this.projectCode, rids, uids).subscribe(res => {
      this.msg.success('修改成功！');
      this.getProjectMembers();
    }, err => {
      this.msg.error('修改失败！');
    });

    // this.pmcService.editMember(this.projectCode, m).subscribe(res => {
    //   this.msg.success('修改成功！');
    //   this.getProjectMembers();
    // }, err => {
    //   this.msg.error('修改失败！');
    // });
  }
}

interface PMemberData extends PMember, STData {
  rolesString: string;
}
