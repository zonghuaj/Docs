import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {
  NzMessageService,
  NzTreeComponent,
  NzTreeNode,
  NzTreeNodeOptions
} from 'ng-zorro-antd';

import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ProjectRoleService} from './project-role.service';
import {MenuItem, RoleEntity} from "./project-role.entities";
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CacheService} from '@delon/cache';

@Component({
  selector: 'project-role-bind-menu',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card [nzTitle]="title" [nzLoading]="loading">
      <se-container labelWidth="100" col="1">
        <se label="角色名称" error="请输入角色名" required>
          <input style="width: 300px;margin-left: 16px" nz-input placeholder="请输入角色名" [(ngModel)]="role.name">
        </se>
        <se label="角色说明" error="请输入角色说明">
          <input style="width: 300px;margin-left: 16px" nz-input placeholder="请输入角色说明" [(ngModel)]="role.desc">
        </se>
        <se label="选择菜单" error="请选择菜单" required>
          <nz-tree
            #nzTreeComponent
            [nzData]="nodes"
            nzCheckable
            [nzCheckedKeys]="checkedKeys">
          </nz-tree>
        </se>
      </se-container>

      <div nz-row nzType="flex" nzJustify="center">
        <button nz-button nzType="default" type="default" class="pl-lg pr-lg"
                (click)="location.back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                [disabled]="disableSubmit"
                [nzLoading]="submitLoading"
                (click)="submit()">提交
        </button>
      </div>
    </nz-card>
  `,
  providers: [ProjectRoleService]
})
export class ProjectRoleEditComponent implements OnInit {
  title = '角色信息';

  @ViewChild('nzTreeComponent')
  nzTreeComponent: NzTreeComponent;

  checkedKeys = [];

  nodes: NzTreeNodeOptions[] = [];

  role: RoleEntity = {name: '', menus: []} as RoleEntity;
  type; // 'project-console' || 'tenant-console'
  submitLoading = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private roleService: ProjectRoleService,
    public location: Location,
    private cache: CacheService,
    private msg: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];

      this.loading = true;
      this.roleService.getFullMenus(this.type)
      // in case returned value is not Array
        .pipe(switchMap(res => of(res instanceof Array ? res : [res])))
        .subscribe((res: any) => {
          this.nodes = this.transformTreeNode(res);
          this.initMenuDatas();
        });
    });
  }

  initMenuDatas() {
    const roleId = this.route.snapshot.paramMap.get('roleId');
    if (roleId) {
      this.roleService.getTanentRoleDetail(this.type, roleId).subscribe(res => {
        this.loading = false;
        this.role = res;
        this.checkedKeys = [...this.checkedKeys, ...res.menus];
        this.title = '编辑角色 - ' + this.role.name;
      }, err => {
        this.loading = false;
        this.msg.error('获取信息失败');
      });
    } else {
      this.loading = false; // stop loading when create role
      this.role = {
        name: '',
        tenantCode: this.cache.getNone('tenantId'),
        type: this.type,
        menus: []
      };
      this.title = '创建角色' + (this.type === 'project-console' ? '（项目）' : '');
    }
  }

  transformTreeNode(menus: MenuItem[]): NzTreeNodeOptions[] {
    return menus.map(m => {
      const node: NzTreeNodeOptions = {key: m.id, title: m.name || 'undefined'};
      if (DISABLED_MENUS.indexOf(m.id) >= 0) {
        node.disabled = true;
        this.checkedKeys.push(m.id);
      }
      if (m.children && m.children.length > 0) {
        node.children = this.transformTreeNode(m.children);
      } else {
        node.isLeaf = true;
      }
      return node;
    });
  }

  get disableSubmit() {
    return this.role.name.length === 0 && this.role.menus.length === 0;
  }

  submit() {
    this.role.menus = this.getCheckedNodeKeys(this.nzTreeComponent.getCheckedNodeList());

    this.submitLoading = true;
    if (this.role.id) { // is edit
      this.roleService.editTenantRole(this.role).subscribe(res => {
        this.submitLoading = false;
        this.msg.success('修改成功');
        this.location.back();
      }, err => {
        this.submitLoading = false;
        this.msg.error('修改失败');
      });
    } else { // is create
      this.roleService.createTenantRole(this.role).subscribe(res => {
        this.submitLoading = false;
        this.msg.success('创建成功');
        this.location.back();
      }, err => {
        this.submitLoading = false;
        this.msg.error('创建失败');
      });
    }
  }

  getCheckedNodeKeys(nodes: NzTreeNode[]) {
    return nodes.map(n => {
      if (n.children && n.children.length > 0) {
        return this.getCheckedNodeKeys(n.children);
      } else {
        return [n.key];
      }
    }).reduce((c, p) => [...c, ...p], []);
  }
}

const DISABLED_MENUS = [
  'service-dashboard', 'project-dashboard', 'platform-dashboard'
];
