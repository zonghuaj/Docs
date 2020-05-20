import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {ProjectEntity} from "../project.entities";
import {ProjectManageService} from "../project-manage.service";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'project-create',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card [nzBordered]="false">
      <project-form #form (submit)="_submit($event)"
                    [data]="project"></project-form>

      <div nz-row nzType="flex" nzJustify="center">
        <!--      <button nz-button nzType="default" type="default" class="pl-lg pr-lg"-->
        <!--              (click)="location.back()">返回-->
        <!--      </button>-->
        <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
                [nzLoading]="loading"
                (click)="form.submitForm()">提交
        </button>
      </div>
    </nz-card>
  `,
  providers: [ProjectManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectEditComponent implements OnInit {
  loading = false;

  project: ProjectEntity;

  constructor(private route: ActivatedRoute,
              private headerService: MpHeaderService,
              private projManService: ProjectManageService,
              public location: Location,
              private cdr: ChangeDetectorRef,
              private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('编辑项目');

    const sid = +this.route.parent.snapshot.paramMap.get('projectId');
    this.getProjectDetail(sid);
  }

  getProjectDetail(pid: number) {
    this.loading = true;
    this.projManService.getProjectInfo(pid)
      .subscribe((data: ProjectEntity) => {
        this.loading = false;
        this.project = data;
        this.cdr.detectChanges();
      }, error => {
        this.loading = false;
        this.msg.error('加载失败');
      });
  }

  _submit(p: ProjectEntity) {
    this.loading = true;
    this.projManService.editProject(p)
      .subscribe(res => {
        this.msg.success('提交成功');
        this.location.back();
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
  }
}
