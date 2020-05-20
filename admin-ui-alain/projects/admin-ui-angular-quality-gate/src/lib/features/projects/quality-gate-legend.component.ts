import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'qgate-legend',
  template: `
    <div nz-row style="padding: 0 12px 6px 12px; width: 280px;">
      <div class="ctr" nz-col nzSpan="12">
        <div class="tit">覆盖率</div>
        <div>
          <ul>
            <li *ngFor="let i of coverageItems" class="item">
            <span>
              <qgate-check-item-ring type="sign" [value]="i.value"></qgate-check-item-ring>
            </span>
              <span class="val ml-sm">{{i.desc}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="ctr" nz-col nzSpan="12">
        <div class="tit">代码重复率</div>
        <div>
          <ul>
            <li *ngFor="let i of duplicationItems">
            <span>
              <qgate-check-item-dot type="sign" [lvl]="i.value"></qgate-check-item-dot>
            </span>
              <span class="val ml-sm">{{i.desc}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="ctr" nz-col nzSpan="12">
        <div class="tit">代码量</div>
        <div>
          <ul>
            <li *ngFor="let i of sizeItems">
              <span class="ncloc">{{i.value}}</span>
              <span class="val ml-sm">{{i.desc}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ant-tooltip {
      max-width: 600px;
    }

    qgate-legend ul, qgate-legend li {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    qgate-legend .item {
      display: flex;
      align-items: center;
    }

    qgate-legend .val {
      line-height: 16px;
      font-size: 13px;
    }

    qgate-legend .ncloc {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 16px;
      box-sizing: border-box;
      color: #fff;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.35);
      background-color: #68aced;
    }

    qgate-legend .ctr {
      margin-top: 6px;
    }

    qgate-legend .tit {
      font-weight: 300;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class QualityGateLegendComponent {
  coverageItems = [
    {desc: '≥ 80%', value: 85},
    {desc: '70% - 80%', value: 72.5},
    {desc: '50% - 70%', value: 60},
    {desc: '30% - 50%', value: 45},
    {desc: '< 30%', value: 15},
  ];

  duplicationItems = [
    {desc: '< 3%', value: 1},
    {desc: '3% - 5%', value: 2},
    {desc: '5% - 10%', value: 3},
    {desc: '10% - 20%', value: 4},
    {desc: '> 20%', value: 5},
  ];

  sizeItems = [
    {desc: '< 1k', value: 'XS'},
    {desc: '1k - 10k', value: 'S'},
    {desc: '10k - 100k', value: 'M'},
    {desc: '100k - 500k', value: 'L'},
    {desc: '> 500k', value: 'XL'},
  ];

  constructor() {
  }
}
