import {Component, Input, OnInit} from '@angular/core';
import {IndexMetric} from '../../../entities/quality-gate.entities';
import {getCoverageLvl, getDupLvl, getLvlRating} from "../../../quality-gate.utils";

@Component({
  selector: 'qgate-project-detail-index',
  template: `
    <div class="item-wrapper" *ngIf="item">
      <div *ngIf="item.metric === 'duplicated_lines_density' && !extra" class="dup-ring">
        <qgate-check-item-dot [lvl]="dupRating" [type]="'lg'"></qgate-check-item-dot>
      </div>
      <div *ngIf="item.metric === 'coverage' && !extra" class="dup-ring">
        <qgate-check-item-ring [value]="covRating" [type]="'lg'"></qgate-check-item-ring>
      </div>

      <div class="index">
        <div class="measure-number">
          <a>{{value}}</a>
        </div>
        <div class="measure-label">
          <svg *ngIf="item.metric === 'bugs'" height="16" version="1.1" viewBox="0 0 16 16" width="16"
               xml:space="preserve"
               xmlns:xlink="http://www.w3.org/1999/xlink"
               style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 1.41421;"><path d="M11 9h1.3l.5.8.8-.5-.8-1.3H11v-.3l2-2.3V3h-1v2l-1 1.2V5c-.1-.8-.7-1.5-1.4-1.9L11 1.8l-.7-.7-1.8 1.6-1.8-1.6-.7.7 1.5 1.3C6.7 3.5 6.1 4.2 6 5v1.1L5 5V3H4v2.3l2 2.3V8H4.2l-.7 1.2.8.5.4-.7H6v.3l-2 1.9V14h1v-2.4l1-1C6 12 7.1 13 8.4 13h.8c.7 0 1.4-.3 1.8-.9.3-.4.3-.9.2-1.4l.9.9V14h1v-2.8l-2-1.9V9zm-2 2H8V6h1v5z" style="fill: currentcolor;"></path></svg>
          <svg *ngIf="item.metric === 'vulnerabilities'" height="16" version="1.1" viewBox="0 0 16 16" width="16"
               xml:space="preserve"
               xmlns:xlink="http://www.w3.org/1999/xlink"
               style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 1.41421;"><path d="M10.8 5H6V3.9a2.28 2.28 0 0 1 2-2.5 2.22 2.22 0 0 1 1.8 1.2.48.48 0 0 0 .7.2.48.48 0 0 0 .2-.7A3 3 0 0 0 8 .4a3.34 3.34 0 0 0-3 3.5v1.2a2.16 2.16 0 0 0-2 2.1v4.4a2.22 2.22 0 0 0 2.2 2.2h5.6a2.22 2.22 0 0 0 2.2-2.2V7.2A2.22 2.22 0 0 0 10.8 5zm-2.2 5.5v1.2H7.4v-1.2a1.66 1.66 0 0 1-1.1-1.6A1.75 1.75 0 0 1 8 7.2a1.71 1.71 0 0 1 .6 3.3z" style="fill: currentcolor;"></path></svg>
          <svg *ngIf="item.metric === 'code_smells'" class="little-spacer-right vertical-bottom" height="16"
               version="1.1"
               viewBox="0 0 16 16" width="16" xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink"
               style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 1.41421;"><path d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm-.5 5.5h.9v.9h-.9v-.9zm-3.8.2c-.1 0-.2-.1-.2-.2 0-.4.1-1.2.6-2S5.3 4.2 5.6 4c.2 0 .3 0 .3.1l1.3 2.3c0 .1 0 .2-.1.2-.1.2-.2.3-.3.5-.1.2-.2.4-.2.5 0 .1-.1.2-.2.2l-2.7-.1zM9.9 12c-.3.2-1.1.5-2 .5-.9 0-1.7-.3-2-.5-.1 0-.1-.2-.1-.3l1.3-2.3c0-.1.1-.1.2-.1.2.1.3.1.5.1s.4 0 .5-.1c.1 0 .2 0 .2.1l1.3 2.3c.2.2.2.3.1.3zm2.5-4.1L9.7 8c-.1 0-.2-.1-.2-.2 0-.2-.1-.4-.2-.5 0-.1-.2-.3-.3-.4-.1 0-.1-.1-.1-.2l1.3-2.3c.1-.1.2-.1.3-.1.3.2 1 .7 1.5 1.5s.6 1.6.6 2c0 0-.1.1-.2.1z" style="fill: currentcolor;"></path></svg>

          <span class="measure-label-text">{{desc}}</span>
        </div>
        <div *ngIf="item.metric === 'new_duplicated_lines_density' && extra" class="measure-label-text">
          <label class="strong-val" *ngIf="itemValid"><a>{{formatNum(extra.value)}}</a> 行新代码发现重复</label>
          <label *ngIf="!itemValid">代码重复率（新）</label>
        </div>
        <div *ngIf="item.metric === 'new_coverage' && extra" class="measure-label-text">
          <label class="strong-val" *ngIf="itemValid"><a>{{formatNum(extra.value)}}</a> 行新代码已被覆盖</label>
          <label *ngIf="!itemValid">代码覆盖率（新）</label>
        </div>
      </div>

      <div *ngIf="isRatingSign" style="height: 60px">
        <qg-sign-rating [lvl]="ratingVal"></qg-sign-rating>
      </div>
    </div>
  `,
  styleUrls: ['./qgate-project-detail-index.component.less'],
})
export class QgateProjectDetailIndexComponent implements OnInit {
  @Input() item: IndexMetric = {} as IndexMetric;
  @Input() extra: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  get desc() {
    if (!this.item) return '';

    switch (this.item.metric) {
      case 'bugs':
        return 'Bugs';
      case 'new_bugs':
        return 'Bugs（新）';
      case 'vulnerabilities':
        return '代码漏洞';
      case 'new_vulnerabilities':
        return '代码漏洞（新）';
      case 'code_smells':
        return '代码异味';
      case 'new_code_smells':
        return '代码异味（新）';
      case 'coverage':
        return '覆盖率';
      case 'duplicated_lines_density':
        return '代码重复';
      case 'sqale_index':
        return '技术债';
      case 'new_technical_debt':
        return '技术债（新）';
      case 'tests':
        return '单元测试';
      case 'duplicated_blocks':
        return '重复代码块';
      default:
        return '';
    }
  }

  get isRatingSign() {
    return [
      'bugs', 'vulnerabilities', 'new_bugs', 'new_vulnerabilities', 'sqale_index', 'new_technical_debt'
    ].indexOf(this.item.metric) >= 0;
  }

  get value() {
    try {
      let val = this.item.value as any;
      const type = this.item._metric.type;
      if (type === 'PERCENT') {
        val = Number(Number(val).toFixed(1)) + '%';
      } else if (type === 'INT') {
        val = parseInt(val);
      } else if (type === 'WORK_DUR') {
        val = this.convertDurTime(val);
      }

      return val;
    } catch (e) {
      return '—';
    }
  }

  convertDurTime(time) {
    if (time > 60) {
      const hour = time / 60;
      if (hour > 8) {
        return `${Math.ceil(hour / 8)}d`
      } else {
        return `${Math.ceil(hour)}h`
      }
    }
    return `${time}min`
  }

  formatNum(val) {
    const v = Number(val);
    if (v > 1000 && v < 1000000) {
      return Number((val / 1000).toFixed(1)) + 'k';
    } else if (v >= 1000000) {
      return Number((val / 1000000).toFixed(1)) + 'm'
    } else {
      return v;
    }
  }

  get ratingVal() {
    return getLvlRating(this.extra.value);
  }

  get dupRating() {
    return getDupLvl(this.item.value);
  }

  get covRating() {
    return getCoverageLvl(this.item.value);
  }

  get itemValid() {
    return !!this.item.value;
  }
}
