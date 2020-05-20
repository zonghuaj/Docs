import { AlertRuleEntity, AlertRuleListEntity } from '../entities/alert-rule.entities';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AdminUiAngularAlertRulesService } from '../services/admin-ui-angular-alert-rules.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'admin-ui-angular-alert-rules-root',
  templateUrl: './admin-ui-angular-alert-rules.component.html',
  styleUrls: ['./admin-ui-angular-alert-rules.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUiAngularAlertRulesComponent implements OnInit {

  loading = false;

  readonly LEVEL = {
    H: '高', M: '中', L: '低'
  };

  page: STPage = {
    front: false,
    zeroIndexed: true
  };

  q: any = {
    pi: 1,
    ps: 10,
    name: '',
    desc: ''
  };
  data: AlertRule[] = [];
  totalCount: number;

  readonly columns: STColumn[] = [
    { title: '名称', index: 'name', width: 160, },
    { title: '规则', render: 'description', width: 300 },
    { title: '告警等级', index: 'levelText', },
    { title: '状态', render: 'enable', },
    { title: '操作', render: 'operations', },
  ];

  @ViewChild('st')
  st: STComponent;

  constructor(
    private alertRuleService: AdminUiAngularAlertRulesService,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef) {
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

    const { pi, ps, keyword } = this.q;
    this.alertRuleService.getAllAlertRules(pi, ps, keyword)
      .subscribe((res: AlertRuleListEntity) => {
        this.loading = false;
        this.totalCount = res.count;
        this.data = this.transFormListData(res.rows);
        this.cdr.detectChanges();
      }, () => {
        this.loading = false;
        this.msg.error('获取列表失败');
      });
  }

  transFormListData(res: AlertRuleEntity[]): AlertRule[] {
    return res.map(ar => ({
      ...ar,
      levelText: this.LEVEL[ar.level]
    }));
  }

  reload() {
    this.data = Array(this.data.length)
      .fill({})
      .map((item: any, idx: number) => {
        return { ...this.data[idx] };
      });
    this.cdr.detectChanges();
  }

  getEditUrl(id) {
    return `/alert/rule/${id}/edit`;
  }

  deleteRule(item: AlertRule) {
    this.alertRuleService.deleteAlertRule(item.id)
      .subscribe(res => {
        this.msg.success('删除成功');
        this.getData();
      }, err => {
        this.msg.success('删除失败');
      });
  }

  toggleStatus(item: AlertRule) {
    this.alertRuleService.toggleAlertRule(item.id, !item.enable)
      .subscribe(res => {
        this.msg.success('操作成功');
        this.getData();
      }, err => {
        this.msg.error('操作失败');
      });
  }

}

interface AlertRule extends AlertRuleEntity, STData {
  levelText: string;
}
