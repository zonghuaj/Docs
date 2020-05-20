import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import {NzMessageService, NzModalRef} from "ng-zorro-antd";
import {PlatformIntegrationService} from "./platform-integration.service";
import {STColumn} from "@delon/abc";
import {SettingsService} from "@delon/theme";
import {ProjectManageService} from "../project-manage.service";
import {of, zip} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'platform-integration-dist',
  template: `
    <div nz-row>
      <nz-select [(ngModel)]="proj" style="width: 300px;">
        <nz-option *ngFor="let p of avaliableProjects" [nzValue]="p" [nzLabel]="p"></nz-option>
      </nz-select>
      <button class="ml-md" nz-button nzType="primary" type="button"
              [disabled]="!proj"
              (click)="distributeProj(proj)"
              [nzLoading]="submitLoading">分配
      </button>
    </div>

    <nz-divider nzType="horizontal"></nz-divider>

    <st #st [columns]="columns" [data]="datas" [ps]="q.ps" [pi]="q.pi"
        [total]="totalCount" [page]="{front: false, show: false}">
      <ng-template st-row="operations" let-i>
        <nz-popconfirm [nzTitle]="'确认删除当前项目？'" (nzOnConfirm)="del(i)">
          <a nz-popconfirm style="color: rgba(212, 48, 48, 1)">删除</a>
        </nz-popconfirm>
      </ng-template>
    </st>
  `,
  providers: [PlatformIntegrationService, ProjectManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformIntegrationDistributionComponent implements OnInit {
  datas: { name: string }[];
  readonly columns: STColumn[] = [
    {title: '项目名称', index: 'name',},
    {title: '操作', render: 'operations'},
  ];

  proj: string;

  q: any = {
    pi: 1,
    ps: 10,
  };
  totalCount: number;

  projects = [];

  get avaliableProjects() {
    return this.projects.reduce((p, c) => {
      if (!this.datas.filter(d => d.name === c).length) p.push(c);
      return p;
    }, []);
  }

  submitLoading = false;

  @Input() item: any;

  constructor(private piService: PlatformIntegrationService,
              private pmService: ProjectManageService,
              private modal: NzModalRef,
              private msg: NzMessageService,
              private settingService: SettingsService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getDistributedProjs();
  }

  getDistributedProjs() {
    zip(
      this.pmService.getAllProjects().pipe(switchMap(res => of(res.rows.map(p => p.projectCode)))),
      this.piService.getPlatformDetail(this.item.id).pipe(switchMap(res => {
        if (!res.projectCode) res.projectCode = [];
        return of(res.projectCode.map(p => ({name: p})))
      })),
    ).subscribe(([projs, disps]) => {
      this.projects = projs;
      this.datas = disps;
      this.cdr.detectChanges();
    }, err => {
      console.error(err);
    });
  }

  distributeProj(proj) {
    this.submitLoading = true;
    this.piService.distributeProj(this.item.id, [proj]).subscribe(res => {
      this.proj = null;
      this.submitLoading = false;
      this.msg.success('分配成功');
      this.getDistributedProjs();
    }, err => {
      this.submitLoading = false;
      this.msg.error('分配失败，请检查集成平台连接情况');
      this.cdr.detectChanges();
    });
  }

  del(itm) {
    this.piService.removeProjectFromPlatform(this.item.id, itm.name).subscribe(res => {
      this.msg.success('删除成功');
      this.getDistributedProjs();
    }, err => {
      if (err && err.code === -1) {
        this.msg.error(err.message);
      } else {
        this.msg.error('删除失败');
      }
    });
  }
}
