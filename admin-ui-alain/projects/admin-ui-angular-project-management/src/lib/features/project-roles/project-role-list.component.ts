import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {STColumn, STPage, STChange} from '@delon/abc';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {ModalHelper} from '@delon/theme';
import {_HttpClient} from '@delon/theme';
import {RoleEntity, RoleListEntity} from "./project-role.entities";
import {ProjectRoleService} from "./project-role.service";
import {Router} from "@angular/router";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'project-role-list',
  templateUrl: './project-role-list.component.html',
  providers: [ProjectRoleService]
})
export class ProjectRoleListComponent implements OnInit {
  tpi = 1; // tenant page index
  ppi = 1; // project page index
  ptotal: number; // project total
  ttotal: number; // tenant total

  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  tcolumns: STColumn[] = [
    {title: '角色名称', width: 200, index: 'name'},
    {title: '角色说明', index: 'desc'},
    {title: '操作', width: 300, render: 'operations'},
  ];
  pcolumns: STColumn[] = [
    {title: '角色名称', width: 200, index: 'name'},
    {title: '角色说明', index: 'desc'},
    {title: '操作', width: 300, render: 'operations'},
  ];

  tabIndex = 0;

  proles: RoleEntity[];
  troles: RoleEntity[];

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private modal: ModalHelper,
    private message: NzMessageService,
    private http: _HttpClient,
    private router: Router,
    private roleService: ProjectRoleService,
    private cache: CacheService,
  ) {
    this.tabIndex = this.cache.getNone<number>('project-role-list-tab') || 0;
  }

  onTabChanged(index: number) {
    this.cache.set('project-role-list-tab', index);
  }

  isRoleDisabled(r) {
    return r.level > 50;
  }

  ngOnInit(): void {
    this.getTenantRoles();
    this.getProjectRoles();
  }

  getTenantRoles() {
    this.roleService.getRoles('tenant-console', this.tpi).subscribe(res => {
      this.ttotal = res.count;
      this.troles = res.rows;
    });
  }

  getProjectRoles() {
    this.roleService.getRoles('project-console', this.ppi).subscribe((res: RoleListEntity) => {
      this.ptotal = res.count;
      this.proles = res.rows;
    });
  }

  tstChange(e: STChange) {
    if (e.type === 'pi') {
      this.tpi = e.pi;
      this.getTenantRoles();
    }
  }

  pstChange(e: STChange) {
    if (e.type === 'pi') {
      this.ppi = e.pi;
      this.getProjectRoles();
    }
  }

  addRole(type) {
    this.router.navigateByUrl(`project/role/add?type=${type}`);
  }

  editRole(item: RoleEntity) {
    this.router.navigateByUrl(`project/role/${item.id}/edit?type=${item.type}`);
  }

  deleteRole(type: 'p' | 't', item: RoleEntity) {
    this.roleService.deleteTenantRole(item).subscribe(res => {
      this.message.success('删除成功');
      if (type === 'p') {
        this.getProjectRoles();
      } else {
        this.getTenantRoles();
      }
    }, err => {
      this.message.error('删除失败');
    });
  }

  bindUser(item: RoleEntity) {
    this.router.navigateByUrl(`project/role/${item.id}/bind`);
  }
}
