import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {STChange, STColumn, STComponent, STData, STPage} from "@delon/abc";
import {ProjectEntity, ProjectListEntity} from "../project.entities";
import {ProjectManageService} from "../project-manage.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styles: [],
  providers: [ProjectManageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  loading = false;

  page: STPage = {
    front: false,
  };

  q: any = {
    pi: 1,
    ps: 10,
    name: '',
    desc: ''
  };
  data: ProjData[] = [];
  totalCount: number;

  readonly columns: STColumn[] = [
    {
      title: '标识', index: 'projectCode', width: 100,
      type: 'link',
      click: (p: ProjectEntity) => this.router.navigateByUrl(`/project/${p.projectId}/detail/info`)
    },
    {title: '名称', index: 'projectName', width: 100},
    {title: '详细描述', index: 'serviceDesc', render: 'desc', width: 240},
    {
      title: '创建时间', index: 'createDate', type: 'date',
      sort: {
        compare: (a: any, b: any) => a.lastModifiedDate - b.lastModifiedDate,
      },
    },
    {title: '用量信息（已使用/全量）', render: 'configure'},
  ];

  @ViewChild('st')
  st: STComponent;

  constructor(private headerService: MpHeaderService,
              private projectManService: ProjectManageService,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              public router: Router,) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('项目列表');

    this.getData();
  }

  submitFilter() {
    this.getData();
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.q.pi = e.pi;
        this.getData();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  getData() {
    this.loading = true;
    this.cdr.detectChanges();

    const {pi, ps, name, desc} = this.q;
    this.projectManService.getAllProjects(pi, ps, name, desc)
      .subscribe((res: ProjectListEntity) => {
        this.loading = false;
        this.totalCount = res.count;
        this.data = this.transFormListData(res.rows);
        this.cdr.detectChanges();
      }, (err) => {
        this.loading = false;
        this.msg.error('获取列表失败');
      });
  }

  transFormListData(res: ProjectEntity[]): ProjData[] {
    return res;
  }
}

interface ProjData extends ProjectEntity, STData {
}
