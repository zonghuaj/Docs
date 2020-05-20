import {Component, Input, OnInit} from '@angular/core';
import {
  getCoverageLvl,
  getDupLvl, getLvlRating,
  getNCLoCLvl,
} from '../../../quality-gate.utils';

@Component({
  selector: 'qgate-lastcheck-item',
  templateUrl: './qcheck-lastcheck-item.component.html',
  styleUrls: ['./qcheck-lastcheck-item.component.less'],
})
export class QGateLastCheckItemComponent {

  @Input() item: QualityCheckItem;

  get layout() {
    const {metric} = this.item;
    switch (metric) {
      case 'bugs':
      case 'vulnerabilities':
      case 'code_smells':
      case 'ncloc':
        return 'right';
      case 'coverage':
      case 'duplicated_lines_density':
      default:
        return 'left';
    }
  }

  get desc() {
    const {metric} = this.item;
    switch (metric) {
      case 'bugs':
        return 'Bugs';
      case 'vulnerabilities':
        return '漏洞';
      case 'code_smells':
        return '代码异味';
      case 'coverage':
        return '覆盖率';
      case 'duplicated_lines_density':
        return '重复';
      case 'ncloc':
        try {
          return this.item.value.split('=')[0];
        } catch (e) {
          return 'UNKNOWN';
        }
      default:
        return '';
    }
  }

  get isRatingSign() {
    return ['bugs', 'vulnerabilities', 'code_smells'].indexOf(this.item.metric) >= 0;
  }

  get ratingLvl() {
    const value = this.value;
    const metric = this.item.metric;
    const rating = this.item.rating;
    switch (metric) {
      case 'bugs':
      case 'vulnerabilities':
      case 'code_smells':
        return getLvlRating(rating);
      case 'coverage':
        return getCoverageLvl(+value);
      case 'duplicated_lines_density':
        return getDupLvl(+value);
      case 'ncloc':
        return getNCLoCLvl(value);
      default:
        return -1;
    }
  }

  get ratingVal() {
    const lvl = this.ratingLvl;
    switch (lvl) {
      case 1:
        return 'A';
      case 2:
        return 'B';
      case 3:
        return 'C';
      case 4:
        return 'D';
      case 5:
        return 'E';
      default:
        return '';
    }
  }

  get nclocVal() {
    const lvl = this.ratingLvl;
    switch (lvl) {
      case 1:
        return 'XS';
      case 2:
        return 'S';
      case 3:
        return 'M';
      case 4:
        return 'L';
      case 5:
        return 'XL';
      default:
        return '';
    }
  }

  get value() {
    if (this.item.metric === 'ncloc' && this.item.value) {
      return this.item.value.split('=')[1];
    } else {
      return this.item.value || 'N/A';
    }
  }

  constructor() {
  }
}

export interface QualityCheckItem {
  metric: string;
  value: string;
  rating?: string; // this is used for xxx_rating
  component?: string;
  bestValue?: boolean;
}
