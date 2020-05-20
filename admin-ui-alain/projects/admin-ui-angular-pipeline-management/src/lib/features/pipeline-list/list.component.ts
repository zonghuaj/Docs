import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, TemplateRef, Input, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {STColumn, STPage, STComponent, STReq, STRes, STData, STColumnBadge, STColumnTag, STChange} from '@delon/abc';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {ModalHelper, _HttpClient} from '@delon/theme';
import {DevopsService} from "../../devops.service";

@Component({
  selector: 'app-node-list-layout',
  templateUrl: './list.component.html',
  providers: [DevopsService]
})
export class PipelineListComponent implements OnInit, OnDestroy {

  loading = false;
  params: any = {name: ''};
  data: any[] = []
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
    desc: '',
  };

  @ViewChild('userSt')
  st: STComponent;
  status = true
  // page
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  badges: STColumnBadge = {
    SUCCESS: {text: '成功', color: 'success'},
    FAILURE: {text: '失败', color: 'error'},
    RUNNING: {text: '构建中', color: 'processing'},
    NEW: {text: '未启动', color: 'default'},
    QUEUED: {text: '队列中', color: 'default'},
    ABORTED: {text: '中止', color: 'warning'},
    UNSTABLE: {text: '不稳定', color: 'warning'},

  };

  // columns
  columns: STColumn[] = [
    {
      title: '流水线名称', index: 'name', width: 150,
      // type: "link",
      //click: item => this.redirectToJenkins(item)
    },
    {title: '状态', index: 'status', type: 'badge', badge: this.badges, width: 100},
    {title: '执行序号', index: 'lastVersion', width: 100},
    {title: '消息', index: 'message', width: 250},
    {
      title: '操作',
      width: 240,
      buttons: [
        {
          text: '启动',
          click: item => this.runPipeline(item),
          iif: record => record.status != 'RUNNING'
        },
        {
          text: '停止',
          click: item => this.stopPipeline(item),
          iif: record => record.status == 'RUNNING'
        },
        // {
        //   text: '查看服务',
        //   pop: true,
        //   popTitle: '该功能不在本次迭代交付'
        //   // click: item => this.delete(item.id),
        // },
        {
          text: '查看日志',
          click: item => this.redirectToJenkinsLogs(item),
        },
        {
          text: '删除',
          click: item => this.confirmDelete(item),
        },
        {
          text: '编辑',
          click: item => this.redirectToPipeLineEdit(item),
        },
      ],
    },
  ];
  record: any = {};

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private modal: ModalHelper,
    private message: NzMessageService,
    private http: _HttpClient,
    private devopsService: DevopsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.watchPipeline();
  }

  ngOnDestroy(): void {
    this.watchPipeline();
    this.devopsService.stopWatchingVStatus();
  }

  /**
   * when st change update page info
   * @param e
   */
  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.q.pi = e.pi;
        this.watchPipeline();
        break;
      case 'filter':
        this.watchPipeline();
        break;
    }
  }

  /**
   *  monitor pipeline status change
   * @param id
   */
  watchPipeline() {
    this.loading = true;
    this.getData();
    this.devopsService.startWatchingVStatus(this.st.pi, this.st.ps)
      .subscribe((vss: any) => {
        this.st.total = vss.count;
        this.data = [...vss.rows];
        this.cdr.detectChanges();
        this.loading = false;
      });
  }

  /**
   * redirect to jenkins pipeline page
   * @param item
   */
  private redirectToJenkins(item) {
    window.open(item.jenkinsObj.url + `/job/${item.tenantCode}-${item.projectCode}/job/${item.name}`)
  }

  /**
   * get pipeline list data
   */
  getData() {
    const {pi, ps, name, desc} = this.q;
    this.devopsService.getPipeline(pi, ps).subscribe((res: any) => {
      this.st.total = res.count;
      this.data = [...res.rows];
      this.loading = false;
      // this.cdr.detectChanges();
    });
  }

  /**
   * redirect ot jenkins last version log page
   * @param item
   */
  private redirectToJenkinsLogs(item) {
    this.router.navigateByUrl(`/devops/pipeline/log/list/${item.id}`);
  }

  private redirectToPipeLineEdit(item) {
    // console.log("redirectToPipeLineEdit:", item);
    this.router.navigateByUrl('/devops/pipeline/list/edit?id=' + item.id);
  }

  private delPipeLine(item: any) {
    this.loading = true;
    this.devopsService.delPipeLine(item.id).subscribe( result => {
      this.msg.success('删除成功');
    }, err => {
      this.msg.error('删除失败');
      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.modalSrv.confirm({
      nzTitle: '确认',
      nzContent: '你确定要删除这个阶段吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.delPipeLine(item),
      nzCancelText: '取消',
    });
  }

  /**
   * run pipeline
   * @param id
   */
  runPipeline(item: any) {
    this.devopsService.runPipeline(item.id).subscribe(result => {
      this.msg.success('启动中，请稍候');
    }, err => {
      this.msg.error('部署失败');
    });
  }

  /**
   * stop pipeline
   * @param item
   */
  private stopPipeline(item: STData) {
    this.devopsService.stopPipeline(item.id).subscribe(result => {
      this.msg.success('停止中，请稍候');
    }, err => {
      this.msg.error('停止失败');
    });
    return undefined;
  }
}
