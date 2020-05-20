import {
  Component, Input, OnChanges, SimpleChanges,
} from '@angular/core';
import {EChartOption} from 'echarts';
import {TPCallDetail} from "./topo-panel.entities";

@Component({
  selector: 'service-topo-panel-dp',
  template: `
    <service-topo-panel [title]="'调用监测'">
      <div class="subt">平均响应时长</div>
      <div class="important" *ngIf="avgResponseTime">{{(avgResponseTime | number:"0.1-2") + ' ms'}}</div>
      <div class="chart" echarts [options]="avgResponseTimeChart"></div>
      <div class="subt">平均吞吐量</div>
      <div class="important" *ngIf="avgThroughput">{{(avgThroughput | number:"0.1-2") + ' cpm'}}</div>
      <div class="chart" echarts [options]="avgThroughputChart"></div>
      <div class="subt">平均可用</div>
      <div class="important" *ngIf="avgSLA">{{(avgSLA / 100 | number:"0.1-2") + ' %'}}</div>
      <div class="chart" echarts [options]="avgSLAChart"></div>
    </service-topo-panel>
  `,
//   <ng-template #cspick>
//   <nz-radio-group [(ngModel)]="isclient" [nzSize]="'small'">
//   <label nz-radio-button nzValue="C">客户端</label>
//   <label nz-radio-button nzValue="S">服务端</label>
//   </nz-radio-group>
//   </ng-template>
  styles: [`
    ul {
      padding: 0;
      margin: 0;
    }

    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .important {
      font-weight: bold;
      color: #444;
      font-size: 1.1em;
    }

    .subt {
      font-size: 0.9em;
      color: #AFB3B0;
    }

    .chart {
      height: 60px;
    }
  `]
})
export class TopoPanelDPComponent implements OnChanges {
  isclient: any;

  @Input() datas: TPCallDetail;

  readonly color = '#00CC00';
  avgResponseTime: number;
  avgResponseTimeChart: EChartOption;

  avgThroughput: number;
  avgThroughputChart: EChartOption;

  avgSLA: number;
  avgSLAChart: EChartOption;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const datas = changes['datas'];
    if (datas && datas.currentValue) {
      this.makeDatas(<TPCallDetail>datas.currentValue);
    }
  }

  makeDatas(datas: TPCallDetail) {
    const times = datas.times;
    this.avgResponseTime = this.getAverage(datas.timeTrend);
    this.avgThroughput = this.getAverage(datas.throughputTrend);
    this.avgSLA = this.getAverage(datas.slaTrend);

    this.avgResponseTimeChart = {
      grid: {
        x: 0, y: 0, x2: 0, y2: 0
      },
      xAxis: {
        show: false,
        type: 'category',
        data: times
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [{
        symbol: "none",
        data: datas.timeTrend,
        type: 'line',
        smooth: true,
        itemStyle: {normal: {color: this.color}}
      }]
    };

    this.avgThroughputChart = {
      grid: {
        x: 0, y: 0, x2: 0, y2: 0
      },
      xAxis: {
        show: false,
        type: 'category',
        data: times
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [{
        symbol: "none",
        data: datas.throughputTrend,
        type: 'line',
        smooth: true,
        itemStyle: {normal: {color: this.color}}
      }]
    };

    this.avgSLAChart = {
      grid: {
        x: 0, y: 8, x2: 0, y2: 0
      },
      xAxis: {
        show: false,
        type: 'category',
        data: times
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [{
        data: datas.slaTrend.map((d: number) => d / 100),
        type: 'bar',
        itemStyle: {normal: {color: this.color}}
      }]
    };
  }

  getAverage(arr: number[]) {
    // we ignore value '0' here for its none sense
    const validArr = arr.filter(n => n);
    let sum = 0;
    validArr.forEach(n => sum += n);
    return sum / validArr.length;
  }
}
