import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {TitleService} from "@delon/theme";
import {ProjectEntity} from "../../project.entities";
import {ProjectManageService} from "../../project-manage.service";

@Component({
  selector: 'project-info',
  templateUrl: './project-info.component.html',
  providers: [ProjectManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectInfoComponent implements OnInit {
  project: ProjectEntity;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private projManService: ProjectManageService) {
  }

  ngOnInit() {
    this.titleSrv.setTitle('项目详情');
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
      }, error => this.msg.error('加载失败'));
  }

  confirmDelete() {
    this.modalSrv.confirm({
      nzTitle: '删除服务',
      nzContent: '一旦删除将无法恢复，确定删除当前服务吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteProject(),
      nzCancelText: '取消',
    });
  }

  deleteProject() {
    this.projManService.deleteProject(this.project.projectId)
      .subscribe(() => {
        this.router.navigateByUrl('/project/all');
      }, (err) => {
        this.msg.error('删除失败');
      });
  }

  get editUrl() {
    return `/project/${this.project.projectId}/edit`;
  }
}
