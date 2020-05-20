import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'qgate-project-detail-scard',
  templateUrl: 'qgate-project-detail-sumcard.component.html',
  styleUrls: ['qgate-project-detail-sumcard.component.less'],
})
export class QgateProjectDetailSumcardComponent implements OnInit {

  @Input() item: any;

  constructor() {
    // this.item = {
    //   value: 100,
    //
    // };
  }

  ngOnInit(): void {
  }

  formatValue(val) {
    const {type} = this.item._metric;
    if (type === 'INT') {
      // tslint:disable-next-line:radix
      return parseInt(val as string);
    } else if (type === 'FLOAT') {
      return Number(Number(val).toFixed(1));
    } else if (type === 'PERCENT') {
      return Number(Number(val).toFixed(1)) + '%';
    } else {
      return val;
    }
  }

  get metricName() {
    const {name} = this.item._metric;
    return name;
  }

  get desc() {
    return `${this.op} ${this.formatValue(this.item.errorThreshold)}`;
  }

  get op() {
    return this.item.comparator === 'GT' ? '大于' : '小于';
  }

}
