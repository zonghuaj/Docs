import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc';
import { AlertEntity, AlertListEntity } from '../entities/alert.entities';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { AlertConfirmComponent } from './alert-confirm.component';
import { AdminUiAngularAlertAllService } from '../services/admin-ui-angular-alert-all.service';
@Component({
  selector: 'admin-ui-angular-alert-all-root',
  templateUrl: './admin-ui-angular-alert-all.component.html',
  styleUrls: ['./admin-ui-angular-alert-all.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminUiAngularAlertAllService]
})
export class AdminUiAngularAlertAllComponent implements OnInit {

  loading = false;

  page: STPage = {
    front: false,
  };

  q: any = {
    pi: 1,
    ps: 10,
    keyword: '',
    times: [],
    level: [],
    status: []
  };
  data: AlertData[] = [];
  totalCount: number;
  alertModal;
  readonly STATUS = ['未处理', '处理中', '已处理'];
  readonly LEVEL = { H: '高', M: '中', L: '低' };

  readonly columns: STColumn[] = [
    {
      title: '告警内容', render: 'summary', width: 400,
    },
    { title: '状态', render: 'status', },
    { title: '告警级别', render: 'level', },
    { title: '告警时间', index: 'starts_at', type: 'date' },
    { title: '负责人', index: 'claim_user' },
    { title: '操作', render: 'operations', },
  ];

  @ViewChild('st')
  st: STComponent;

  constructor(
    private alertService: AdminUiAngularAlertAllService,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalServ: NzModalService,
    public settings: SettingsService ) {
  }

  ngOnInit(): void {
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

    const { pi, ps, keyword, times, level, status } = this.q;
    this.alertService.getAllAlerts(pi, ps, keyword, times, status, level)
      .subscribe((res: AlertListEntity) => {
        this.loading = false;
        this.totalCount = res.count;
        this.data = this.transFormListData(res.rows);
        this.cdr.detectChanges();
      }, (err) => {
        this.loading = false;
        this.msg.error('获取列表失败');
      });
  }

  transFormListData(res: AlertEntity[]): AlertData[] {
    return res.map(r => ({
      ...r,
      statusText: this.STATUS[r.status],
      levelText: this.LEVEL[r.alert_level],
    }));
  }

  onDatePicked(times) {
    this.q.times = times;
  }

  showDetailConfirmModal(item: AlertData) {
    const footer: any[] = [{
      label: '关闭',
      shape: 'default',
      onClick: () => this.alertModal.destroy()
    }];

    if (item.status === 0) {
      footer.push({
        label: '认领',
        shape: 'primary',
        onClick: () => {
          this.confirmAlert(item);
        }
      });
    } else if (item.status === 1) {
      footer.push({
        label: '处理',
        shape: 'primary',
        onClick: (componentInstance) => {
          this.processAlert(item, componentInstance && componentInstance.solution);
        }
      });
    }

    this.alertModal = this.modalServ.create({
      nzTitle: `告警信息`,
      nzContent: AlertConfirmComponent,
      nzFooter: footer,
      nzComponentParams: {
        data: item,
      },
    });
  }

  confirmAlert(item: AlertData) {
    const btn = this.alertModal.nzFooter[1];
    btn.loading = true;
    btn.disabled = true;

    this.alertService.claimAlert(item.id)
      .subscribe(res => {
        this.msg.success('认领成功');
        btn.loading = false;
        btn.disabled = false;

        const idx = this.data.findIndex(d => d.id === item.id);
        this.data[idx] = {
          ...item,
          status: 1,
          statusText: this.STATUS[1]
        };

        this.reload();
        this.alertModal.destroy();
      }, err => {
        this.msg.error('认领失败');
        btn.loading = false;
        btn.disabled = false;
      });
  }

  processAlert(item: AlertData, solution: string) {
    if (!solution) return;

    const btn = this.alertModal.nzFooter[1];
    btn.loading = true;
    btn.disabled = true;

    this.alertService.closeAlert(item.id, solution)
      .subscribe(res => {
        btn.loading = false;
        btn.disabled = false;

        const idx = this.data.findIndex(d => d.id === item.id);
        this.data[idx] = {
          ...item,
          status: 2,
          statusText: this.STATUS[2],
          claim_user: this.settings.user.preferred_username,
          solution
        };

        this.reload();
        this.alertModal.destroy();
      }, err => {
        this.msg.error('认领失败');
        btn.loading = false;
        btn.disabled = false;
      });
  }

  reload() {
    this.data = Array(this.data.length)
      .fill({})
      .map((item: any, idx: number) => {
        return { ...this.data[idx] };
      });
    this.cdr.detectChanges();
  }

}

interface AlertData extends AlertEntity, STData {
  statusText: string;
  levelText: string;
}
