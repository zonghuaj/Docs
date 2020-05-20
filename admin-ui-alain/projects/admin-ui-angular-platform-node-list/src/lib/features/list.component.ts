import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, TemplateRef, Input} from '@angular/core';
import {Subscription} from 'rxjs';
import {STColumn, STPage, STComponent, STReq, STRes} from '@delon/abc';
import {URL_PREFIX} from '@app/services/services.util';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {NodeListEditComponent} from './edit.component';
import {ModalHelper} from '@delon/theme';
import {zdelete, zpost, surlWithoutProject} from '@app/services/services.util';
import {_HttpClient} from '@delon/theme';
import { NodeService } from './node.service';

@Component({
  selector: 'app-node-list-layout',
  templateUrl: './list.component.html',
  providers: [NodeService]
})
export class NodeListLayoutComponent implements OnInit {

  private router$: Subscription;
  url = `${URL_PREFIX}${surlWithoutProject('node')}`;
  // username = '';
  params: any = {ip: ''};
  @ViewChild('userSt')
  st: STComponent;
  req: STReq = {
    reName: {
      pi: 'pageNumber',
      ps: 'pageSize'
    },
  };
  // 定义返回的参数
  res: STRes = {
    reName: {
      total: 'data.count',
      list: 'data.rows'
    }
  };
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  columns: STColumn[] = [
    {title: 'ip', index: 'ip'},
    {title: '端口', index: 'port'},
    {title: '备注', render: 'comment'},
    {
      title: '状态', index: 'health', type: 'badge', badge: {
        'ready': {text: '准备', color: 'success'},
        'joining': {text: '上线中', color: 'processing'},
        'join_successed': {text: '运行中', color: 'processing'},
        'join_failed': {text: '上线失败', color: 'error'},
        'leaveing': {text: '下线中', color: 'processing'},
        'leave_failed': {text: '下线失败', color: 'error'},
        'leave_successed': {text: '准备', color: 'success'}
      },
    },
    {
      title: '是否共享', index: 'ifFree'
      , type: 'badge', badge: {
        0: {text: '否', color: 'default'},
        1: {text: '是', color: 'success'},
      }
    },
    {
      title: '创建时间', index: 'createDate', type: 'date', dateFormat: 'YYYY-MM-DD hh:mm:ss'
    },
    {
      title: '操作',
      width: 240,
      buttons: [
        // {
        //   text: '编辑',
        //   click: item => this.openEdit(item) ,
        // },
        // {
        //   text: '测试',
        //   click: item => this.onTest(item),
        // },
        {
          text: '上线',
          click: item => this.onJion(item, 1),
        },
        {
          text: '下线' ,
          click: item => this.onJion(item, 2),
        },
        {
          text: '删除',
          type: 'del',
          click: item => this.delete(item.id),
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
    private nodeService: NodeService,
  ) {
  }

  ngOnInit(): void {
  }

  openAdd() {
    const record: any = {update: false};
    this.modal.create(NodeListEditComponent, {record}, {size: 'md'}).subscribe(res => {
      this.st.reload();
    });
  }

  delete(nodeId) {
    zdelete(this.http, `${surlWithoutProject('node')}/${nodeId}`).subscribe(result => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }

  onLine(node, type) {
    return ['ready', 'join_failed', 'leave_successed'].includes(node.health);
  }

  offLine(node, type) {
    return ['join_successed', 'leave_failed'].includes(node.health);
  }

  onJion(node, type) {
     const url = 'nodejion';
     const objdata = {
      id: node.id,
      ip: node.ip,
      port: node.port,
      username: node.username,
      password: node.password,
      shared: node.ifFree,  //是否共享
      type: type     // 上线或者下线 1：上线。  2：下线
    }
     if ( type === 1) {
      if (['ready', 'join_failed', 'leave_successed'].includes(node.health)) {
        try {
          zpost(this.http, url, objdata).subscribe((result: any) => {
            if (result === 1) {
              this.message.success('上线申请成功');
            } else if (result === -2) {
              this.message.error('测试连接失败');
            } else {
              this.message.error('上线失败');
            }
            this.st.reload();
          });
        } catch (error) {
          console.log('list_err:', error);
        }
      } else {
        this.message.warning('当前状态不允许上线');
      }
     } else if ( type === 2 ) {
      if (['join_successed', 'leave_failed'].includes(node.health)) {
        zpost(this.http, url, objdata).subscribe(result => {

          result === 1 ? this.message.success('下线申请成功') : this.message.error('下线失败');

          this.st.reload();
        });
      } else {
        this.message.warning('当前状态不允许下线');
      }
     }
  }

  onTest(node) {
    // zget(this.http, url, {ifFree: true}).subscribe((result: any) => {
    //   console.log("result....", result);
    // });
  }
}
