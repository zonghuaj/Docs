import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';

import {STChange, STColumn, STColumnBadge, STComponent, STData, STPage} from '@delon/abc';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {_HttpClient, ModalHelper, TitleService} from '@delon/theme';
import {DevopsService} from "../../devops.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-node-log-list-layout',
  templateUrl: './list.component.html',
  providers: [DevopsService]
})
export class PipelineLogListComponent implements OnInit {

  pipelineId: any;
  data: any[] = []

  badges: STColumnBadge = {
    SUCCESS: {text: '成功', color: 'success'},
    FAILURE: {text: '失败', color: 'error'},
    UNKNOWN: {text: '构建中', color: 'processing'},
    RUNNING: {text: '构建中', color: 'processing'},
    NEW: {text: '未启动', color: 'default'},
    QUEUED: {text: '队列中', color: 'default'},
    ABORTED: {text: '中止', color: 'default'},
    UNSTABLE: {text: '不稳定', color: 'warning'},
    OTHER: {text: '中止', color: 'default'}
  };
  // columns
  //TODO
  columns: STColumn[] = [
    {title: '状态', index: 'result', type: 'badge', badge: this.badges, width: 100},
    {
      title: '运行', index: 'id', width: 150, type: "link",
    },
    {title: '提交', index: 'commit', width: 100},
    {title: '消息', index: 'cause', width: 250},
    {title: '持续时间', index: 'durationInMillis', width: 250},
    {title: '完成', type: 'date', index: 'endTime', width: 250},

  ];
  total;

  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
    desc: '',
  };

  pipelineLogs: any;
  // page
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };

  @ViewChild('userSt')
  st: STComponent;

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private modal: ModalHelper,
    private message: NzMessageService,
    private http: _HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private devopsService: DevopsService,
    private titleService: TitleService
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('流水线日志');
    this.pipelineId = this.route.snapshot.paramMap.get('pipelineId');
    this.getData(this.pipelineId);
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.q.pi = e.pi;
        this.getData(this.pipelineId);
        break;
      case 'filter':
        this.getData(this.pipelineId);
        break;
    }
  }

  /**
   * get pipeline log list data
   */
  getData(pipelineId: number) {
    const {pi, ps, name, desc} = this.q;
    this.devopsService.getPipelineLog(pi, ps, pipelineId).subscribe(async (res: any) => {
      if (res.rows.stages) {
        this.pipelineLogs = [...res.rows.stages];
        this.data = [...res.rows.list];
        this.total = res.count;
        for (const re of this.data) {

          if (re.result) {
            if (!(Object.keys(this.badges)).includes(re.result)) {
              re.result = 'OTHER'
            }
          } else {
            re.result = 'ABORTED'
          }

          if (re.causes != null) {
            if (re.causes.length != 0) {
              re.cause = re.causes[0].shortDescription;
            } else {
              re.cause = '';
            }
          } else {
            re.cause = '';
          }
          re.durationInMillis = await this.formatDuring(re.durationInMillis);
          re.commit = '';
        }
        for (const re of this.pipelineLogs) {
          re.durationInMillis = `pass in ${re.durationInMillis} ms`
          switch (re.result) {
            case 'UNSTABLE':
              re.result = 'finish';
              break;
            case 'SUCCESS':
              re.result = 'finish';
              break;
            case 'FAILURE':
              re.result = 'error';
              break;
            case 'ABORTED':
              re.result = 'wait';
              break;
            case null:
              re.result = 'wait';
              break;
            case 'NOT_BUILT':
              re.result = 'finish';
              break;
          }
        }
        this.cdr.detectChanges();
      }
    })
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

  /**
   * covert ms
   * @param mss
   */
  async formatDuring(mss: any) {
    var days = Math.floor(mss / (1000 * 60 * 60 * 24));
    var hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((mss % (1000 * 60)) / 1000);
    if (days == 0) {
      if (hours == 0) {
        if (minutes == 0) {
          if (seconds < 1) {
            return "<1s"
          } else {
            return seconds + "s ";
          }
        } else {
          return minutes + "m " + seconds + "s ";
        }
      } else {
        return hours + "h " + minutes + "m " + seconds + "s ";
      }
    } else {
      return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
  }

  backToLast(){
    window.history.back();
  }

  refresh(){
    this.pipelineId = this.route.snapshot.paramMap.get('pipelineId');
    this.getData(this.pipelineId);
  }
  getLogDetail(item: any) {
    if (item.type == 'pi') {
      this.stChange(item);
    } else {
      this.router.navigateByUrl(`/devops/pipeline/log/list/${this.pipelineId}/detail/${item.click.item.id}`);
    }
  }
}
