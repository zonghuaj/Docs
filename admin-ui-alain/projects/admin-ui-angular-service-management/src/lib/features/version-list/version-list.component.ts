import {
  ChangeDetectorRef,
  Component, EventEmitter,
  Input, OnInit, Output,
  ViewChild
} from "@angular/core";
import {ServiceListService} from "../service-list/service-list.service";
import {STColumn, STData} from "@delon/abc";
import {RollBackModalComponent} from "../service-list/roll-back/roll-back-modal.component";
import {ServiceManageService, VersionEntity} from "admin-ui-angular-common";
import {InputBoolean, NzMessageService, NzModalService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {PodDetail, VersionStatus} from "../service-list/service-list.entities";
import {ErrorModalComponent} from "./error-modal.component";
import {envStr2Form} from "../service-edit/version.utils";

@Component({
  selector: 'version-list',
  templateUrl: './version-list.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceManageService, ServiceListService]
})
export class VersionListComponent implements OnInit {
  readonly STATUS_ITEMS = [
    {val: '', text: '全部', value: false, type: 'default', checked: false},
    {val: STATUS.ERROR, text: '异常', value: false, type: 'error', checked: false},
    {val: STATUS.NEW, text: '新建', value: false, type: 'default', checked: false},
    {val: STATUS.BUILDING, text: '构建中', value: false, type: 'processing', checked: false,},
    {val: STATUS.DEPLOYING, text: '启动中', value: false, type: 'processing', checked: false,},
    {val: STATUS.RUNNING, text: '运行', value: false, type: 'success', checked: false},
    {val: STATUS.STOP, text: '停止', value: false, type: 'error', checked: false},
    {val: STATUS.ERROR_BUILD, text: '构建异常', value: false, type: 'error', checked: false},
    {val: STATUS.ERROR_DEPLOY, text: '启动异常', value: false, type: 'error', checked: false},
  ];

  columns: STColumn[] = [
    // {title: '', index: 'key', type: 'checkbox'},
    {title: '版本号', index: 'version', render: 'name', width: 100},
    {title: '描述', render: 'desc'},
    {title: '实例', index: 'replica', render: 'replica', width: '10%'},
    {title: '状态', index: 'status', render: 'status', width: '15%'},
    {
      title: '更新时间', index: 'lastModifiedDate', type: 'date', width: '10%',
      sort: {
        compare: (a: any, b: any) => a - b,
      },
    },
    {title: '操作', index: '', render: 'operations', width: '30%'},
  ];

  @ViewChild('deployModal') deployModal: any;
  @ViewChild('scaleModal') scaleModal: any;
  @ViewChild('deployRemark') deployRemark: any;
  @ViewChild('replicaNum') replicaNum: any;

  private _data: VersionData[];
  @Input() set data(val: any[]) {
    this._data = this.transFormListData(val);
  }

  get data() {
    return this._data;
  }

  @Input() @InputBoolean() showDetail = false;

  @Output() dataChanged$ = new EventEmitter<any>();

  @Input() serviceId: number;

  @Input() set newestStatus(newss: VersionStatus[]) {
    if (!newss || newss.length === 0) return;

    this.processStatus(newss);
  }

  get showList() {
    return this.showDetail || this.data.length > 0;
  }

  constructor(
    private msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private servManageService: ServiceManageService,
  ) {
  }

  ngOnInit(): void {
    if (!this.showDetail) {
      this.columns.pop();
    }
    this.getResourceLimit();
  }

  transFormListData(data: VersionData[]): VersionData[] {
    return data.map((ver: VersionData, idx: number) => {
      const statusItem = this.getStatus(ver.status);
      const replicaPod = this.getReplicaPod(ver.podStatus, ver.replica);
      const podDetail = ver.podDetail;
      let expand = true;
      if (!ver.expand) {
        expand = false;
      }
      return {
        ...ver,
        idx,
        statusText: statusItem.text,
        statusType: statusItem.type,
        replicaPod: replicaPod,
        podDetail: podDetail,
        expand: expand,
      };
    });
  }

  getStatus(status: number): any {
    switch (status) {
      case STATUS.ERROR:
        return this.STATUS_ITEMS[1];
      case STATUS.NEW:
        return this.STATUS_ITEMS[2];
      case STATUS.BUILDING:
        return this.STATUS_ITEMS[3];
      case STATUS.DEPLOYING:
        return this.STATUS_ITEMS[4];
      case STATUS.RUNNING:
        return this.STATUS_ITEMS[5];
      case STATUS.STOP:
        return this.STATUS_ITEMS[6];
      case STATUS.ERROR_BUILD:
        return this.STATUS_ITEMS[7];
      case STATUS.ERROR_DEPLOY:
        return this.STATUS_ITEMS[8];
      default:
        return this.STATUS_ITEMS[1];
    }
  }

  processStatus(vs: VersionStatus[]) {
    let changed = false;
    this.data.forEach((d: VersionData, idx: number) => {
      const newS = vs.find(itm => d.id === itm.id);
      if (newS) {
        const statusItem = this.getStatus(newS.status);
        changed = this.needToRefresh(d, newS);
        this.data[idx] = {
          ...d,
          status: statusItem.val,
          statusText: statusItem.text,
          statusType: statusItem.type,
          podStatus: newS.podNum + '',
          replicaPod: this.getReplicaPod(newS.podNum, d.replica),
          podDetail: newS.podInfo,
        };
      }
    });

    if (changed) {
      // this.cdr.detectChanges();
      this.reload();
    }
    // this.cdr.detectChanges();
    // this.reload();
  }

  changeStatus(item, newStatus: STATUS) {
    const statusItem = this.getStatus(newStatus);
    this.data[item.idx] = {
      ...item,
      status: statusItem.val,
      statusText: statusItem.text,
      statusType: statusItem.type
    };
    this.reload();
  }

  reload() {
    this.data = Array(this.data.length)
      .fill({})
      .map((item: any, idx: number) => {
        return {...this.data[idx]};
      });
    // this.cdr.checkNoChanges();
    this.cdr.detectChanges();
  }

  goDetail(item: any) {
    this.router.navigate([`/service/${item.id}/info`]);
  }

  editVersion(item: any) {
    this.router.navigateByUrl(`/service/${item.serviceId}/version/${item.id}/edit`);
  }

  modalLoading = false;

  confirmDelete(item: VersionData) {
    this.modalSrv.confirm({
      nzTitle: '删除版本',
      nzContent: '一旦删除将无法恢复，确定删除当前版本吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteVersion(item),
      nzCancelText: '取消',
    });
  }

  showDeployModal(item: VersionData) {
    this.modalSrv.create({
      nzTitle: `部署版本`,
      nzContent: this.deployModal,
      // nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzOkLoading: this.modalLoading,
      nzOnOk: () => this.deployVersion(item)
    });
  }

  deployVersion(item: VersionData) {
    const desc = this.deployRemark.nativeElement.value;

    this.modalLoading = true;
    this.servManageService.deployVersion(item.serviceId, item.id, desc)
      .subscribe(result => {
        this.modalLoading = false;
        this.msg.success('部署中，请稍候');
        this.changeStatus(item, item.sourceType === 1 ?
          STATUS.BUILDING : STATUS.DEPLOYING);
      }, err => {
        this.modalLoading = false;
        this.msg.error('部署失败');
      });
  }

  showRollbackModal(item: any) {
    this.modalSrv.create({
      nzTitle: `回滚部署`,
      nzContent: RollBackModalComponent,
      // nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzOkLoading: this.modalLoading,
      nzComponentParams: {
        sid: item.serviceId,
        vid: item.id
      },
      nzOnOk: (componentInstance: RollBackModalComponent) => {
        const info = componentInstance.getRollback();
        if (info) {
          this.rollbackVersion(item, info);
        }
      }
    });
  }

  rollbackVersion(item: any, info: any) {
    this.servManageService.rollBackVersion(item.serviceId, item.id, info)
      .subscribe(result => {
        this.modalLoading = false;
        this.msg.success('部署中，请稍候');
        this.changeStatus(item, STATUS.DEPLOYING);
      }, err => {
        this.modalLoading = false;
        this.msg.error('部署失败');
      });
  }

  deleteVersion(item: VersionData) {
    this.servManageService.deleteVersion(item.serviceId, item.id)
      .subscribe(result => {
        this.msg.success('删除成功');
        this.data.splice(item.idx, 1);

        this.dataChanged$.emit('delete');
        this.reload();
      }, err => {
        this.msg.error('删除失败');
        console.log(err);
      });
  }

  showDeployErrorModal(item: any) {
    this.modalSrv.create({
      nzTitle: `错误信息`,
      nzContent: ErrorModalComponent,
      nzFooter: null,
      nzClosable: true,
      nzComponentParams: {
        sid: item.serviceId,
        vid: item.id
      },
    });
  }

  updateScaleModel: any = {};
  isScaleModelVisible: boolean = false;

  showScaleModal(item: any) {
    this.updateScaleModel = {...item};
    this.cdr.detectChanges();
    let cpuAvailed = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu;
    let memoryAvailed = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory;
    this.maxReplicaNum = cpuAvailed / this.updateScaleModel.cpuLimit >= memoryAvailed / this.updateScaleModel.memoryLimit ? Math.floor(memoryAvailed / this.updateScaleModel.memoryLimit) : Math.floor(cpuAvailed / parseFloat(this.updateScaleModel.cpuLimit));
    this.isScaleModelVisible = true;
    if (cpuAvailed / this.updateScaleModel.cpuLimit >= memoryAvailed / this.updateScaleModel.memoryLimit) {
      this.checkMsg = `受内存上限限制,该服务最大实例数为${this.maxReplicaNum}`;
    } else {
      this.checkMsg = `受cpu上限限制,该服务最大实例数为${this.maxReplicaNum}`;
    }
  }

  resourceLimit: any = {currentCpu: 0, currentMemory: 0, maxCpu: 0, maxMemory: 0}

  getResourceLimit() {
    this.servManageService.getResourceLimit().subscribe((res: any) => {
      this.resourceLimit = {...res};
      this.cdr.detectChanges();
    })
  }

  checkMsg = '';
  maxReplicaNum = 0;

  closeScale() {
    this.isScaleModelVisible = false;
    this.updateScaleModel = {};
    this.checkMsg = '';
  }


  scaleVersion() {
    const replica = this.updateScaleModel.replicaNum;
    this.modalLoading = true;
    this.servManageService.scaleVersion(this.updateScaleModel.serviceId, this.updateScaleModel.id, replica)
      .subscribe(result => {
        this.msg.success('部署中，请稍候');
        // this.changeStatus(this.updateScaleModel, this.updateScaleModel.sourceType === 1 ?
        //   STATUS.BUILDING : STATUS.DEPLOYING);
        // this.changeStatus(item, item.sourceType === 1 ?
        //   STATUS.BUILDING : STATUS.DEPLOYING);
        this.changeStatusAndReplica(this.updateScaleModel, this.updateScaleModel.sourceType === 1 ?
          STATUS.BUILDING : STATUS.DEPLOYING, replica);
        this.closeScale();
      }, err => {
        this.msg.error('伸缩失败');
        this.isScaleModelVisible = false;
      }, () => this.modalLoading = false);
  }

  confirmStopVersion(item: VersionData) {
    this.modalSrv.confirm({
      nzTitle: '停止运行',
      nzContent: '确定停止运行吗？',
      nzOkText: '停止',
      nzOkType: 'danger',
      nzOnOk: () => this.stopVersion(item),
      nzCancelText: '取消',
    });
  }

  stopVersion(item: VersionData) {
    this.servManageService.stopVersion(item.serviceId, item.id)
      .subscribe(result => {
        this.msg.success('操作成功');
        // this.data.splice(item.idx, 1);

        // this.dataChanged$.emit('delete');
        this.reload();
      }, err => {
        this.msg.error('操作成功');
        console.log(err);
      });
  }

  envParse(envStr: string) {
    try {
      return envStr2Form(envStr);
    } catch (e) {
      return '';
    }
  }

  getReplicaPod(podStatus: any, replica: any) {
    if (podStatus) {
      return `${podStatus}/${replica}`;
    }
    return `0/${replica}`;
  }

  private getPodDetail(): PodDetail[] {
    const p: PodDetail[] = [];
    for (let i = 0; i < 2; i++) {
      p.push(new PodDetail('su-0703-v1-1', 'running', 'success'))
    }
    return p;
  }

  getPodStatus(status) {
    return PodStatus[status];
  }

  needToRefresh(oldV: VersionData, newV: VersionStatus) {
    const sb = oldV.status !== newV.status;
    const pb = oldV.podStatus !== newV.podNum + '';
    const tb = this.isNewRecord(oldV.podDetail, newV.podInfo);
    return sb || pb || tb;
  }

  private isNewRecord(oldP: PodDetail[], newP: PodDetail[]) {
    if (!oldP || (oldP.length !== newP.length)) {
      return true;
    }
    newP.forEach(p => {
      return !(oldP.some(n => n.name === p.name));
    });
    return false;
  }

  private changeStatusAndReplica(item, newStatus: STATUS, replica) {
    const statusItem = this.getStatus(newStatus);
    this.data[item.idx] = {
      ...item,
      status: statusItem.val,
      statusText: statusItem.text,
      statusType: statusItem.type,
      replica: replica
    };
    this.reload();
  }
}

interface VersionData extends VersionEntity, STData {
  idx: number; // only used for ui-index
  statusText: string;
  statusType: number;
  replicaPod: string;
  expand: boolean;
}

enum STATUS {
  ERROR = 0,
  NEW = 1,
  BUILDING = 2,
  DEPLOYING = 3,
  RUNNING = 4,
  STOP = 5,
  ERROR_BUILD = -1001,
  ERROR_DEPLOY = -1002
}

enum PodStatus {
  Running = '运行中',
  Pending = '挂起',
  Failed = '未启动',
  Succeeded = '成功',
  Unknown = '未知',
}
