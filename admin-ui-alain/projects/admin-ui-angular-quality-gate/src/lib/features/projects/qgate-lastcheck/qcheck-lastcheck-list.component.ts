import {Component, Input, OnInit} from '@angular/core';
import {QualityCheckItem} from './qcheck-lastcheck-item.component';

@Component({
  selector: 'qgate-lastcheck-list',
  template: `
    <div class="item-list">
      <qgate-lastcheck-item class="item" *ngFor="let q of qitems" [item]="q"></qgate-lastcheck-item>
    </div>
  `,
  styleUrls: ['./qcheck-lastcheck-list.component.less'],
})
export class QGateLastCheckListComponent implements OnInit {
  @Input() items: QualityCheckItem[] = [];
  qitems: QualityCheckItem[] = [];

  constructor() {
  }

  ngOnInit(): void {
    if (this.items.length > 0) {
      this.makeItems();
    }
  }

  makeItems() {
    this.qitems = [
      {
        metric: 'bugs',
        value: this.getMetric('bugs').value,
        rating: this.getMetric('reliability_rating').value
      },
      {
        metric: 'vulnerabilities',
        value: this.getMetric('vulnerabilities').value,
        rating: this.getMetric('security_rating').value,
      },
      {
        metric: 'code_smells', value: this.getMetric('code_smells').value,
        rating: this.getMetric('sqale_rating').value,
      },
      {metric: 'coverage', value: this.getMetric('coverage').value},
      {metric: 'duplicated_lines_density', value: this.getMetric('duplicated_lines_density').value},
      {metric: 'ncloc', value: this.getMetric('ncloc_language_distribution').value},
    ];
  }

  getMetric(key): QualityCheckItem {
    return this.items.find(i => i.metric === key) || {} as QualityCheckItem;
  }
}
