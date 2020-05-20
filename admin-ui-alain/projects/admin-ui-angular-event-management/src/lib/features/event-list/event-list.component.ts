import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STComponent, STColumn, STData, STPage} from '@delon/abc';
import {EventManageService} from "../event-manage.service";
import {SFSchema} from '@delon/form';
import {EventEntity, EventListEntity, EventType} from "../event.entities";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {EventDetailComponent} from "./detail/event-detail.component";
import {MpHeaderService} from "admin-ui-angular-common";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventManageService],
})
export class EventListComponent implements OnInit {
  constructor(private http: _HttpClient,
              private modal: ModalHelper,
              private route: ActivatedRoute,
              private router: Router,
              private eventManageService: EventManageService,
              private cdr: ChangeDetectorRef,
              private msg: NzMessageService,
              private headerService: MpHeaderService,
              private cache: CacheService,

              private modalSrv: NzModalService,) {
    this.tabIndex = this.cache.getNone<number>('event-list-tab') || 0;
    if (window.addEventListener) {
      window.addEventListener("message", this.receiveMessage, false);
     } else {
       (<any>window).attachEvent("onmessage", this.receiveMessage);
    }
  }

  onTabChanged(index: number) {
    this.cache.set('event-list-tab', index);
    if(index ===0){
      window.location.hash='/event/list/alert';
    }else{
      window.location.hash='/event/list/todo';
    }

  }

  loading = false;

  page: STPage = {
    front: false,
  };

  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0
  };
  data: EventEntity[] = [];
  tododata: EventEntity[] = [];
  totalCount: number;
  readCount: number;
  modalLoading = false;
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    // {title: '编号', index: 'no'},
    {title: '通知类型', index: 'type', width: 100},
    {title: '通知来源', index: 'from'},
    {title: '通知信息', index: 'message'},
    {title: '创建时间', index: 'createAt', width: 120, type: 'date'},
    {
      title: '状态', index: 'read', format: (item: EventEntity, col: STColumn) => item.read ? '已读' : '未读', width: 100
    },
    {title: '操作', index: '', render: 'operations', width: 120},
  ];

  Todocolumns: STColumn[] = [
    {title: '来源', index: 'from',format: (item: EventEntity, col: STColumn) => item.from =='artifactory' ? '制品' : '',},
    {title: '待办信息', index: 'message',type: 'link',
    click: (p: EventEntity) => this.router.navigateByUrl(`/artifactory/version/${p.id}/stage`)},//artifactory/version/30/stage
    {title: '创建时间', index: 'createAt', width: 120, type: 'date'}
  ];

  tabIndex = 0;

  ngOnInit() {
    this.headerService.setTitle('通知列表');

    this.route.paramMap.pipe(
    switchMap((params: ParamMap) =>{
      console.info('type',params.get('type'))
      const type = params.get('type')
      if(type ==='alert'){
        // this.cache.set('event-list-tab', 0);
        console.info('alert',params.get('type'))
        this.tabIndex =0;
        this.getData();
      }else{
        this.tabIndex=1;
        this.getToDoData();
        // this.cache.set('event-list-tab', 1);
      }

      return params.get('type')
    }
    )).subscribe()
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  private getData() {
    this.loading = true;
    this.cdr.detectChanges();
    const {pi, ps} = this.q;
    this.eventManageService.getAll(pi, ps).subscribe(
      (res: EventListEntity) => {
        this.loading = false;

        this.data = this.formatData(res.rows.map(r => ({...r, read: !!r.read})));
        this.totalCount = res.count;
        this.cdr.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.msg.error('获取列表失败');
      }
    );
  }

  private getToDoData() {
    this.loading = true;
    this.cdr.detectChanges();
    const {pi, ps} = this.q;
    this.eventManageService.getToDoAll(pi, ps).subscribe(
      (res: EventListEntity) => {
        this.loading = false;

        this.tododata = this.formatData(res.rows.map(r => ({...r, read: !!r.read})));
        //this.totalCount = res.count;
        this.cdr.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.msg.error('获取列表失败');
      }
    );
  }

  formatData(array: EventEntity[]) {
    return array.map(data => {
      data.type = EventType[data.type];
      return data;
    });
  }

  showDetailModal(item: STData) {
    this.modalSrv.create({
      nzTitle: `事件详情`,
      nzContent: EventDetailComponent,
      // nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzOkLoading: this.modalLoading,
      nzComponentParams: {
        event: item
      },
      nzOnOk: (componentInstance: EventDetailComponent) => {
        // debugger;
        this.eventManageService.setRead(item.id, !item.read)
          .subscribe(result => {
            this.modalLoading = false;

            item.read = true;
            this.reload(item);

            this.eventManageService.refreshMsgImmediately();
            this.cdr.detectChanges();
          }, err => {
            this.modalLoading = false;
            this.msg.error('111');
          },);
      }
    });
  }

  reload(item: any) {
    this.data = this.data.map(d => {
      if (d.id == item.id) {
        return item;
      }
      return d;
    });
    this.cdr.detectChanges();
  }

  confirmDeleteEvent(item: EventEntity) {
    this.modalSrv.confirm({
      nzTitle: '删除消息',
      nzContent: '确定删除吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteEvent(item),
      nzCancelText: '取消',
    });
  }

  private deleteEvent(item: EventEntity) {
    this.eventManageService.deleteEvent(item.id)
      .subscribe(result => {
        this.msg.success('操作成功');
        this.getData();
      }, err => {
        this.msg.error('操作成功');
        console.log(err);
      });
  }

//window.addEventListener("message", receiveMessage, false);

private receiveMessage(event)
  {
    // alert('call');
  }
}
