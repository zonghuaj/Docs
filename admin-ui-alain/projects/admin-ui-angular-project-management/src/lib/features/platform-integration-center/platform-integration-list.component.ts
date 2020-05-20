import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from "@angular/core";
import {PlatformEntity, PlatformItemEntity} from "./platform-integration.entity";
import {NzMessageService} from "ng-zorro-antd";
import {PlatformIntegrationService} from "./platform-integration.service";
import {STChange, STColumn} from "@delon/abc";
import {ModalHelper} from "@delon/theme";
import {PlatformIntegrationTestComponent} from "./platform-integration-test.component";
import {PlatformIntegrationEditComponent} from "./platform-integration-edit.component";
import {PlatformIntegrationDistributionComponent} from "./platform-integration-dist.component";

@Component({
  selector: 'platform-integration-list',
  template: `
    <nz-card [nzTitle]="title" [nzExtra]="extra">
      <st #st [columns]="columns" [data]="datas" (change)="stChange($event)" [ps]="q.ps" [pi]="q.pi"
          [total]="totalCount" [page]="{front: false}">
        <ng-template st-row="operations" let-i>
          <a (click)="test(i)" style="color: rgba(42, 130, 228, 1)">测试</a>
          <nz-divider nzType="vertical"></nz-divider>
          <a (click)="distribute(i)" style="color: rgba(9, 187, 7, 1)">分配</a>
          <nz-divider nzType="vertical"></nz-divider>
          <span nz-tooltip *ngIf="hasChildren(i)" nzTitle="请先删除已分配的资源">
            <a disabled>编辑</a>
          </span>
          <a *ngIf="!hasChildren(i)" (click)="edit(i)" style="color: rgba(9, 187, 7, 1)">编辑</a>
          <nz-divider nzType="vertical"></nz-divider>
          <span nz-tooltip *ngIf="hasChildren(i)" nzTitle="请先删除已分配的资源">
            <a disabled>删除</a>
          </span>
          <nz-popconfirm *ngIf="!hasChildren(i)" [nzTitle]="'确认删除当前集成？'" (nzOnConfirm)="del(i)">
            <a nz-popconfirm style="color: rgba(212, 48, 48, 1)">删除</a>
          </nz-popconfirm>
        </ng-template>
      </st>
    </nz-card>

    <ng-template #extra>
      <button nz-button nzType="default" type="button" (click)="onBack$.emit()">返回</button>
      <button nz-button nzType="primary" type="button" (click)="add()">添加</button>
    </ng-template>
  `,
  providers: [PlatformIntegrationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformIntegrationListComponent implements OnInit {
  title = '集成列表';

  @Input() platform: PlatformEntity;

  datas: PlatformItemEntity[];
  readonly columns: STColumn[] = [
    {title: '地址', index: 'url',},
    {title: '备注', index: 'desc'},
    {title: '操作', render: 'operations'},
  ];

  q: any = {
    pi: 1,
    ps: 10,
  };
  totalCount: number;

  @Output() onBack$ = new EventEmitter();

  constructor(private piService: PlatformIntegrationService,
              private modal: ModalHelper,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.title = `${this.platform.name} 集成列表`;
    this.getDatas();
  }

  getDatas() {
    const {pi, ps} = this.q;
    this.piService.getIntegratedList(this.platform.type, pi, ps).subscribe(res => {
      this.datas = res.rows;
      this.totalCount = res.count;
      this.cdr.detectChanges();
    });
  }

  stChange(e: STChange) {
    if (e.type === 'pi') {
      this.q.pi = e.pi;
      this.getDatas();
    }
  }

  test(item) {
    this.modal.create(PlatformIntegrationTestComponent, {item},
      {
        size: 'sm',
        modalOptions: {
          nzTitle: `${this.platform.name} - 测试连接`,
          nzClosable: true,
        }
      })
      .subscribe(res => {
      });
  }

  edit(item) {
    this.modal.create(PlatformIntegrationEditComponent,
      {item: {id: item.id, ...item.config}, platform: this.platform},
      {
        modalOptions: {nzTitle: `${this.platform.name} - 编辑集成`}
      })
      .subscribe(res => {
        if (res) this.getDatas();
      });
  }

  add() {
    this.modal.create(PlatformIntegrationEditComponent,
      {platform: this.platform},
      {
        modalOptions: {nzTitle: `${this.platform.name} - 新建集成`},
      })
      .subscribe(res => {
        if (res) this.getDatas();
      });
  }

  distribute(item) {
    this.modal.create(PlatformIntegrationDistributionComponent,
      {item, platform: this.platform},
      {
        modalOptions: {
          nzTitle: `${this.platform.name} - 分配资源`,
          nzOnCancel: () => {
            this.getDatas();
          }
        }
      })
      .subscribe(res => {
        this.getDatas();
      });
  }

  del(item) {
    this.piService.deletePlatform(item).subscribe(res => {
      this.msg.success('删除成功');
      this.getDatas();
    }, err => {
      if (err && err.code === -1) {
        this.msg.error(err.message);
      } else {
        this.msg.error('删除失败');
      }
    });
  }

  hasChildren(item) {
    return item.projectCode && item.projectCode.length > 0;
  }
}
