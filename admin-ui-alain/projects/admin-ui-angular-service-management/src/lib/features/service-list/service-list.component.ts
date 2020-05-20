import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {STComponent, STColumn, STData, STChange, STPage} from '@delon/abc';
import {Router} from '@angular/router';
import {AppMenuService} from '@cds/framework';
import {ServiceListEntity, VersionStatus} from './service-list.entities';
import {ServiceEntity, ServiceManageService} from "admin-ui-angular-common";
import {ServiceListService} from './service-list.service';
import {VersionStatusService} from '../version-list/version-status.service';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceManageService, ServiceListService, VersionStatusService],
})
export class ServiceListComponent implements OnInit, OnDestroy {
  loading = false;

  page: STPage = {
    front: false,
  };

  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
    desc: '',
  };
  data: ServData[] = [];
  totalCount: number;

  readonly columns: STColumn[] = [
    {title: '名称', index: 'serviceName', render: 'name', width: 100},
    {title: '详细描述', render: 'desc'},
    {title: '端口', render: 'ports'},
    {title: '路由', index: 'route', render: 'route'},
    {
      title: '更新时间',
      index: 'lastModifiedDate',
      type: 'date',
      sort: {
        compare: (a: any, b: any) => a.lastModifiedDate - b.lastModifiedDate,
      },
    },
    // {title: '操作', index: '', render: 'operations'},
  ];

  @ViewChild('st')
  st: STComponent;

  newestStatusList: VersionStatus[];

  constructor(
    private msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private appMenuService: AppMenuService,
    private servManageService: ServiceManageService,
    private vsStatusService: VersionStatusService,
  ) {
  }

  ngOnInit() {
    this.getData();

    this.appMenuService.setCurrentNavigation('service');
  }

  ngOnDestroy(): void {
    this.vsStatusService.stopWatchingVStatus();
  }

  getData() {
    this.loading = true;
    this.cdr.detectChanges();

    const {pi, ps, name, desc} = this.q;
    this.servManageService.getAllServices(pi, ps, name, desc)
      .subscribe(
        (res: ServiceListEntity) => {
          this.loading = false;
          this.totalCount = res.count;
          this.data = this.transFormListData(res.rows);
          this.cdr.detectChanges();

          // const vidss = this.data
          //   .map(d => d.versions)
          //   .map(vs => vs.map(v => v.id));
          // this.watchVersionStatus([].concat(...vidss));
        },
        err => {
          this.loading = false;
          this.msg.error('获取列表失败');
        },
      );
  }

  // watchVersionStatus(ids: number[]) {
  //   this.vsStatusService.startWatchingVStatus(ids)
  //     .subscribe((vss: VersionStatus[]) => {
  //       this.newestStatusList = vss;
  //       this.cdr.detectChanges();
  //     });
  // }

  transFormListData(data: ServiceEntity[]): ServData[] {
    return data.map((se: ServiceEntity, idx: number) => ({
      ...se,
      idx,
      route: se.routerHost + se.routerPrefix,
    }));
  }

  reload() {
    this.data = Array(this.data.length)
      .fill({})
      .map((item: any, idx: number) => {
        return {...this.data[idx]};
      });
    this.cdr.detectChanges();
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

  goDetail(item: any) {
    this.router.navigate([`/service/${item.id}/detail/info`]);
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }

  formatRoute(route: string): string {
    return route === 'NANA' || route === 'NA' ? '-' : route;
  }
}

interface ServData extends ServiceEntity, STData {
  idx: number; // only used for ui-index
  route: string;
}
