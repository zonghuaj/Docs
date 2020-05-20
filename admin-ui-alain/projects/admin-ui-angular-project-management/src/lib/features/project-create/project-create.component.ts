import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {ProjectEntity} from "../project.entities";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectManageService} from "../project-manage.service";
import {Location} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'project-create',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card>
      <project-form #form (submit)="_submit($event)"></project-form>

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
export class ProjectCreateComponent implements OnInit {
  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private headerService: MpHeaderService,
              private projManService: ProjectManageService,
              public location: Location,
              private cdr: ChangeDetectorRef,
              private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('创建项目');
  }

  _submit(p: ProjectEntity) {
    this.loading = true;
    this.projManService.createProject(p)
      .subscribe((res: ProjectEntity) => {
        this.msg.success('项目创建成功');
        this.router.navigate([`/project/${res.projectId}/detail/info`]);
      }, err => {
        this.loading = false;
        if (err.name === 'InternalServerError') {
          this.msg.error(err.message);
        } else {
          this.msg.error('创建失败');
        }
        this.cdr.detectChanges();
      });
  }
}
