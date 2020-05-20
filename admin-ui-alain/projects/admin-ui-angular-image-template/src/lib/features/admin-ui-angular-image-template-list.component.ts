import {Component, OnInit} from '@angular/core';
import {STChange, STColumn} from '@delon/abc';
import {AdminUiAngularImageTemplateService} from '../services/admin-ui-angular-image-template.service';
import {Router} from '@angular/router';
import {ImageTemplate, ImageTemplateList} from '../entities/image-template.entity';

@Component({
  selector: 'admin-ui-angular-image-template-root',
  template: `
    <nz-card nzTitle="镜像模板列表" [nzExtra]="addT">
      <form nz-form [nzLayout]="'inline'" class="search__form">
        <div nz-row nzGutter="16">
          <div nz-col nzSpan="6">
            <nz-form-item>
              <nz-form-label>名称</nz-form-label>
              <nz-form-control>
                <input nz-input [ngModelOptions]="{standalone: true}" [(ngModel)]="q.name" name="name"
                       placeholder="要查询的名称">
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="10">
            <button nz-button type="button" nzType="primary" [nzLoading]="loading" (click)="getData()">
              <i nz-icon nzType="search" nzTheme="outline"></i>查询
            </button>
          </div>
        </div>
      </form>

      <ng-template #addT>
        <button nz-button type="button" class="ml-sm" nzType="primary" (click)="add()">
          添加
        </button>
      </ng-template>
      <st #st [columns]="columns" [data]="datas" [loading]="loading" (change)="stChange($event)" [ps]="q.ps" [pi]="q.pi"
          [total]="totalCount" [page]="{front: false}">
        <ng-template st-row="operations" let-i>
          <span nz-tooltip *ngIf="i.isSystem" nzTitle="系统模板不能编辑">
            <a disabled>编辑</a>
          </span>
          <a *ngIf="!i.isSystem" (click)="edit(i)">编辑</a>
          <nz-divider nzType="vertical"></nz-divider>
          <span nz-tooltip *ngIf="i.isSystem" nzTitle="系统模板不能删除">
            <a disabled>删除</a>
          </span>
          <nz-popconfirm *ngIf="!i.isSystem" [nzTitle]="'确认删除当前模板？'" (nzOnConfirm)="del(i)">
            <a nz-popconfirm style="color: rgba(212, 48, 48, 1)">删除</a>
          </nz-popconfirm>
        </ng-template>
      </st>
    </nz-card>
  `,
  styles: [],
  providers: [AdminUiAngularImageTemplateService]
})
export class AdminUiAngularImageTemplateListComponent implements OnInit {
  loading = false;
  totalCount: number;
  q: any = {
    pi: 1,
    ps: 10,
    name: '',
  };
  datas: ImageTemplate[] = [];

  readonly columns: STColumn[] = [
    {title: '模板名称', index: 'name'},
    {title: '描述', index: 'description'},
    {title: '操作', render: 'operations'},
  ];

  constructor(private router: Router,
              private itService: AdminUiAngularImageTemplateService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    const {pi, ps, name} = this.q;
    this.itService.getAllTemplates(pi, ps, name)
      .subscribe((res: any) => {
        this.loading = false;
        this.totalCount = res.count;
        this.datas = res.rows;
      });
  }

  stChange(e: STChange) {
    if (e.type === 'pi') {
      this.q.pi = e.pi;
      this.getData();
    }
  }

  add() {
    this.router.navigateByUrl('/image-template/create');
  }

  edit(i) {
    this.router.navigateByUrl(`/image-template/${i.id}/edit`);
  }

  del(i) {
    this.itService.deleteTemplate(i.id).subscribe(res => {
      this.getData();
    });
  }
}

