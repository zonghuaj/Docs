import {Component, OnInit} from '@angular/core';
import {STChange, STColumn} from '@delon/abc';
import {AdminUiAngularQualityGateService} from '../../services/admin-ui-angular-quality-gate.service';
import {QGateProject} from '../../entities/quality-gate.entities';
import {ModalHelper} from '@delon/theme';
import {QGateCreateModalComponent} from './qgate-create-modal.component';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'admin-ui-angular-quality-gate-root',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card [nzExtra]="addT" [nzTitle]="titleT">

      <ng-template #titleT>
        <span>代码检查工程</span>
        <span class="ml-sm" [nzTitle]="legendT" nzPlacement="topLeft" nzPlacement="rightTop" nz-tooltip>
          <i nz-icon nzType="question-circle" nzTheme="outline"></i>
        </span>
      </ng-template>

      <ng-template #legendT>
        <qgate-legend></qgate-legend>
      </ng-template>
      
      <form nz-form [nzLayout]="'inline'" class="search__form">
        <div nz-row nzGutter="16">
          <div nz-col nzSpan="6">
            <nz-form-item>
              <nz-form-label>工程名称</nz-form-label>
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

      <st #st [columns]="columns" [data]="datas" [loading]="loading" (change)="stChange($event)" [ps]="q.ps" [pi]="q.pi"
          [total]="totalCount" [page]="{front: false}">
        <ng-template st-row="name" let-i>
          <a class="names" [routerLink]="'/quality-gate/project/' + i.key"
             [queryParams]="{lastCheckedDate: i.analysisDate}">{{i.name}}</a>
        </ng-template>

        <ng-template st-row="lastCheck" let-i>
          <qgate-lastcheck-list [items]="i.info"></qgate-lastcheck-list>
        </ng-template>

        <ng-template st-row="status" let-i>
          <label *ngIf="hadChecked(i)" [ngClass]="{
              'status-success': checkPassed(i),
              'status-failed': !checkPassed(i)
              }">{{checkPassed(i) ? '通过' : '失败'}}</label>
        </ng-template>

        <ng-template st-row="operations" let-i>
          <a (click)="edit(i)">修改门禁</a>
          <nz-divider nzType="vertical"></nz-divider>
          <nz-popconfirm [nzTitle]="'确认删除当前模板？'" (nzOnConfirm)="del(i)">
            <a style="color: #f5222d" nz-popconfirm>删除</a>
          </nz-popconfirm>
        </ng-template>
      </st>

      <ng-template #addT>
        <button *ngIf="getQGates" nz-button type="button" class="ml-sm" nzType="primary" (click)="add()">
          创建
        </button>
      </ng-template>
    </nz-card>
  `,
  styles: [`
    .status-success {
      padding: 6px 10px;
      color: #fff;
      background: #00D700;
      font-size: 12px;
      border-radius: 4px;
    }

    .status-failed {
      padding: 6px 10px;
      color: #fff;
      background: #aa0000;
      font-size: 12px;
      border-radius: 4px;
    }

    .names {
      display: inline-block;
      width: 120px;
      white-space: normal;
      overflow: hidden;
      word-break: break-all;
    }
  `],
  providers: [AdminUiAngularQualityGateService]
})
// list component
export class AdminUiAngularQualityGateComponent implements OnInit {
  loading = false;
  totalCount: number;
  q: any = {
    pi: 1,
    ps: 10,
    name: '',
  };
  datas: QGateProject[] = [];
  qgates: any[];

  readonly columns: STColumn[] = [
    {title: '工程名称', render: 'name', width: 120},
    {title: '质量门', render: 'status', width: 100},
    {title: '最后检查结果', render: 'lastCheck'},
    {title: '最后检查时间', index: 'analysisDate', type: 'date', width: 200},
    {title: '操作', render: 'operations'},
  ];

  constructor(private modalHelper: ModalHelper,
              private router: Router,
              private msg: NzMessageService,
              private qgateService: AdminUiAngularQualityGateService) {
  }

  ngOnInit(): void {
    this.getQGates();
    this.getData();
  }

  getQGates() {
    this.qgateService.getAllQualityGates().subscribe(res => {
      this.qgates = res;
    });
  }

  getData() {
    this.loading = true;
    const {pi, ps, name} = this.q;
    this.qgateService.getQualityGatePorjectList(pi, ps, name)
      .subscribe((res: any) => {
        this.loading = false;
        this.totalCount = res.count;
        this.datas = res.rows;
      }, err => {
        this.loading = false;
      });
  }

  stChange(e: STChange) {
    if (e.type === 'pi') {
      this.q.pi = e.pi;
      this.getData();
    }
  }

  del(item) {
    this.qgateService.deleteQualityGateProject(item.key)
      .subscribe((res: any) => {
        this.msg.success('删除成功');
        this.getData();
      }, err => {
        this.msg.error('删除失败');
      });
  }

  add() {
    this.modalHelper.create(QGateCreateModalComponent, {qgates: this.qgates},
      {
        size: 'md',
        modalOptions: {
          nzTitle: '新建检查工程',
        }
      }).subscribe(res => {
      if (res) this.getData();
    });
  }

  edit(item) {
    this.modalHelper.create(QGateCreateModalComponent,
      {
        qgates: this.qgates,
        project: item
      },
      {
        size: 'md',
        modalOptions: {
          nzTitle: '修改质量门禁',
        }
      }).subscribe(res => {
      if (res) this.getData();
    });
  }

  hadChecked(item) {
    try {
      return !!item.info.find(i => i.metric === 'alert_status');
    } catch (e) {
      return false;
    }
  }

  checkPassed(item) {
    try {
      return item.info.find(i => i.metric === 'alert_status').value === 'OK';
    } catch (e) {
      return false;
    }
  }
}
