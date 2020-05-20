import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {QualityGateRulesMatchCreateComponent} from './quality-gate-rules-condition-create.component';
import {QualityGateRule, RuleMetric, SavedRule} from '../../entities/quality-gate-rule.entities';
import {AdminUiAngularQualityGateService} from '../../services/admin-ui-angular-quality-gate.service';
import {STColumn} from "@delon/abc";
import {findMetric} from "../../quality-gate.utils";

@Component({
  selector: 'qgate-rules-condition-rules-table',
  template: `
    <button nz-button nzType="primary" type="button" (click)="add()">
      添加
    </button>
    <st *ngIf="qg && qg.conditions && qg.conditions.length > 0"
        [data]="qg.conditions" [columns]="columns"
        [page]="{front: true, show: false}">
    </st>
  `,
  styles: [],
  providers: [AdminUiAngularQualityGateService]
})
export class QualityGateRulesMatchTableComponent implements OnInit {
  @Input() metrics;
  @Input() qg: QualityGateRule;

  @Output() ruleChange$ = new EventEmitter();

  columns = [
    {
      title: '指标', index: 'metric', format: (item, col) => findMetric(item.metric, this.metrics).name
    },
    {
      title: '比较条件', index: 'op', format: (item, col) => item.op === 'LT' ? '小于' : '大于'
    },
    {title: '失败阈值', index: 'error'},
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: (item) => this.del(item)
        }
      ],
    },
  ];

  constructor(private modal: ModalHelper,
              private qgService: AdminUiAngularQualityGateService) {
  }

  ngOnInit(): void {
  }

  add() {
    this.modal.create(QualityGateRulesMatchCreateComponent,
      {metrics: this.metrics, qg: this.qg},
      {
        modalOptions: {
          nzTitle: '添加条件'
        }, size: 'md'
      }).subscribe(res => {
      if (res) this.ruleChange$.emit();
    });
  }

  del(item) {
    this.qgService.delQualityGateCondition(item.id)
      .subscribe(res => {
        this.ruleChange$.emit();
      });
  }
}
