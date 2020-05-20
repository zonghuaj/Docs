import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {STChange, STColumn} from "@delon/abc";
import {ArtifactoryService} from "../artifactory.service";
import {ArtifactoryEntity} from "../artifactory.entities";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {ArtifactoryFlowStartComponent} from "../artifactory-stage-flow/artifactory-flow-start.component";
import {ModalHelper} from "@delon/theme";

@Component({
  selector: 'artifactory-version-list',
  template: `
    <st #st [columns]="columns" [data]="datas" [loading]="loading"
        [page]="{front: false, show: false}">
      <ng-template st-row="lastVersion" let-i>
        <span class="w200px">{{i.lastVersion}}</span>
      </ng-template>
      <ng-template st-row="flows" let-i>
        <af-stage-line class="w400px" [statusList]="getVersionStages(i)"></af-stage-line>
      </ng-template>
      <ng-template st-row="time" let-i>
        <span class="w200px">{{getLastTime(i) | date:'yyyy-MM-dd HH:mm'}}</span>
      </ng-template>
      <ng-template st-row="operations" let-i>
        <span class="w200px" style="width: 215px;">
          <a (click)="auditV(i)">审批</a>
          <nz-divider nzType="vertical"></nz-divider>
          <a (click)="editV(i)">编辑流程</a>
          <nz-divider nzType="vertical"></nz-divider>
          <nz-popconfirm nzTitle="确认删除当前版本？" (nzOnConfirm)="delV(i)">
            <a nz-popconfirm style="color: red;">删除</a>
          </nz-popconfirm>
          <nz-divider nzType="vertical" *ngIf="true"></nz-divider>
          <a *ngIf="true" (click)="startFlow(i)">开启流程</a>
        </span>
      </ng-template>
    </st>
  `,
  styles: [`
    .w200px {
      display: inline-block;
      width: 200px;
    }

    .w400px {
      display: inline-block;
      width: 400px;
    }
  `],
  providers: [ArtifactoryService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtifactoryVersionListComponent implements OnInit {
  loading = false;

  q: any = {
    pi: 1,
    ps: 10,
  };

  datas: any[] = [];

  readonly columns: STColumn[] = [
    {title: '版本', render: 'lastVersion', width: 200},
    {title: '流程状态', render: 'flows', width: 400},
    {title: '流程更新时间', render: 'time', width: 200},
    {title: '操作', render: 'operations', width: 200},
  ];
  magicPortal;

  _artif: ArtifactoryEntity;

  @Input() set artif(a: ArtifactoryEntity) {
    if (!a) return;

    this._artif = a;
    this.getData();
  }

  get artif() {
    return this._artif;
  }

  @Output() versionChanged$ = new EventEmitter();

  constructor(private artifService: ArtifactoryService,
              private msg: NzMessageService,
              private router: Router,
              private modal: ModalHelper,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.magicPortal = (window as any).magicPortal;
  }

  getData() {
    this.artifService.getArtifactoryDetail(this.artif.id)
      .pipe(switchMap(res => of(res.versions)))
      .subscribe(res => {
        this.datas = res;
        this.cdr.detectChanges();
      });
  }

  auditV(item) {
    this.router.navigateByUrl(`artifactory/version/${item.id}/stage`);
  }

  editV(item) {
    this.router.navigateByUrl(`artifactory/version/${item.id}/flow-edit`);
  }

  delV(item) {
    this.artifService.deleteArtVersion(item.id).subscribe(res => {
      this.msg.success('删除成功');
      this.getData();
    }, err => {
      this.msg.error('删除失败');
    });
  }

  startFlow(v) {
    this.modal.create(ArtifactoryFlowStartComponent,
      {vid: v.id},
      {
        size: 'md',
        modalOptions: {
          nzTitle: '创建制品版本',
        }
      }).subscribe(res => {
      if (res) this.versionChanged$.emit();
    });
  }

  getVersionStages(v) {
    try {
      return v.flows.stages;
    } catch (e) {
      return [];
    }
  }

  getLastTime(i) {
    try {
      if (i.flows && i.flows.updateAt) {
        return i.flows.updateAt;
      } else {
        return i.updateAt;
      }
    } catch (e) {
      return '';
    }
  }
}
