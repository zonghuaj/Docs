import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AdminUiAngularQualityGateService} from '../../services/admin-ui-angular-quality-gate.service';
import {QualityGateRule} from '../../entities/quality-gate-rule.entities';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {ModalHelper} from '@delon/theme';
import {QualityGateRulesCreateComponent} from './quality-gate-rules-create.component';
import {NzMessageService, TransferItem} from 'ng-zorro-antd';

@Component({
  selector: 'qgate-rules',
  templateUrl: './quality-gate-rules.component.html',
  styleUrls: ['./quality-gate-rules.component.less'],
  providers: [AdminUiAngularQualityGateService],
  encapsulation: ViewEncapsulation.None
})
export class QualityGateRulesComponent implements OnInit {
  metrics;

  initLoading = false;
  detailLoading = false;
  datas: QualityGateRule[] = [];
  current: QualityGateRule;

  selectableProjects: TransferItem[] = [];

  title;

  constructor(private qgService: AdminUiAngularQualityGateService,
              private msg: NzMessageService,
              private modal: ModalHelper) {
  }

  ngOnInit(): void {
    this.getQGMetrics();
    this.getSelectableProjects();

    this.getQGates();
  }

  getQGates() {
    this.qgService.getAllQualityGates().subscribe(res => {
      this.datas = res;
    });
  }

  getQGMetrics() {
    this.qgService.getQualityGateMetrics().subscribe(res => {
      this.metrics = res.metrics;
    });
  }

  getSelectableProjects() {
    this.qgService.getQualityGatePorjectList()
      .pipe(mergeMap((res: any) => of(res.rows.map(d => ({
        key: d.key,
        title: d.name
      })))))
      .subscribe(res => {
        this.selectableProjects = res;
      });
  }

  getQGateDetail() {
    this.detailLoading = true;
    this.qgService.getGualityGateDetail(this.current.id).subscribe((res: any) => {
      this.detailLoading = false;
      this.current = res;

      const projKeys = this.current.projects.map(p => p.key);
      this.selectableProjects = this.selectableProjects.map(p => {
        p.direction = projKeys.indexOf(p.key) >= 0 ? 'right' : 'left';
        return p;
      });
    }, err => {
      this.detailLoading = false;
    });
  }

  isCurrent(item) {
    return this.current && this.current.id === item.id;
  }

  onItemClicked(item) {
    if (this.detailLoading || this.isCurrent(item)) return;

    this.current = item;
    this.getQGateDetail();
  }

  add() {
    this.modal.create(QualityGateRulesCreateComponent,
      {},
      {
        modalOptions: {
          nzTitle: '新建质量门'
        }, size: 'md'
      }).subscribe(res => {
      if (res) this.getQGates();
    });
  }

  editName() {
    this.modal.create(QualityGateRulesCreateComponent,
      {qg: this.current},
      {
        modalOptions: {
          nzTitle: `修改名称 - ${this.current.name}`
        }, size: 'md'
      }).subscribe(res => {
      this.datas = [res, ...this.datas];
    });
  }

  delCurr() {
    this.qgService.deleteGualityGateRule(this.current.id).subscribe(res => {
      this.msg.success('删除成功');
      this.current = null;
      this.getQGates();
    }, err => {
      this.msg.error('删除失败');
    });
  }

  onProjTransferChange(trans) {
    this.detailLoading = true;
    const ids = trans.list.map(l => l.key);
    if (trans.from === 'left') {
      this.qgService.qgRuleBindProject(this.current.id, ids).subscribe(res => {
        this.detailLoading = false;
        // this.getQGateDetail();
      }, err => {
        this.detailLoading = false;
      });
    } else {
      this.qgService.qgRuleUnbindProject(this.current.id, ids).subscribe(res => {
        this.detailLoading = false;
        // this.getQGateDetail();
      }, err => {
        this.detailLoading = false;
      });
    }
  }
}

