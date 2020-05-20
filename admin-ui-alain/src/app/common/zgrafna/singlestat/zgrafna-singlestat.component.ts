import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from "@angular/core";
import {format} from "date-fns";
import {ZGChart, ZGData, ZGText, UnitParser} from "@app/common/zgrafna/zgrafna.entites";

@Component({
  selector: 'zgrafna-single-stat',
  template: `
    <div class="container">
      <div *ngIf="saText.bgChart" class="chart" echarts [options]="saText.bgChart"></div>
      <div *ngIf="saText.gauge" class="gauge" echarts [options]="saText.gauge"></div>
      <canvas *ngIf="saText.gauge" #cvs class="cvs" width="300" height="160"></canvas>
      <div class="text noselect">{{saText.text}}</div>
    </div>
  `,
  styleUrls: ['./zgrafna-singlestat.component.less'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZGrafnaSinglestatComponent implements AfterViewInit {
  @Input() saText: ZGText;

  @Input() set data(d: ZGData[]) {
    if (d && d.length > 0) {
      this.saText = this.makeText(d, this.saText, this.unit);
      this.cdr.detectChanges();
    }
  }

  @Input() chartOpt: ZGChart;
  @Input() unit: UnitParser;

  @ViewChild("cvs") cavs: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCanvasRing());
  }

  initCanvasRing() {
    if (!this.cavs) return;
    const r = 75;
    const w = this.cavs.nativeElement.clientWidth;
    const h = this.cavs.nativeElement.clientHeight;

    const x = w / 2;
    const y = h / 2;

    const ctx: CanvasRenderingContext2D = this.cavs.nativeElement.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.strokeStyle = "#5DE034";
    ctx.arc(x, y, r, this.getRadian(150), this.getRadian(294));
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#D67627";
    ctx.arc(x, y, r, this.getRadian(294), this.getRadian(342));
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#E71111";
    ctx.arc(x, y, r, this.getRadian(342), this.getRadian(390));
    ctx.stroke();
  }

  getRadian(angle: number) {
    return angle * Math.PI / 180;
  }

  makeText(datas: ZGData[], textOpt: ZGText, unit: UnitParser): ZGText {
    const vals = datas[0].values.map(d => +d[1]);
    let val = 0;
    switch (textOpt.type) {
      case "avg":
        val = vals.reduce((p, c) => p + c) / vals.length;
        break;
      case "max":
        val = Math.max(...vals.map(d => +d[1]));
        break;
    }

    let text = '' + val;
    if (unit) {
      text = unit.parser(val, 2, unit.suffix);
    }

    const resText: ZGText = {
      ...textOpt, text
    };

    if (textOpt.bgChart) {
      resText['bgChart'] = this.makeTextBgChart(datas);
    }
    if (textOpt.gauge) {
      resText['gauge'] = this.makeTextGauge(val / 100);
    }

    return resText;
  }

  makeTextBgChart(datas: ZGData[]) {
    const xAxisData = datas[0].values
      .map(d => format(d[0], 'mm:ss'))
      .filter(d => d === d);

    const chart = {
      grid: {x: 0, y: 0, x2: 0, y2: 0},
      xAxis: {
        show: false,
        type: 'category',
        data: [...xAxisData]
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: []
    };

    chart.series = datas.map(d => {
      const showD = d.values.map(d => +d[1]);
      return {
        symbol: 'none',
        type: 'line',
        itemStyle: {color: '#7EB26D'},
        areaStyle: {color: '#7EB26D55'},
        // areaStyle: {item: {}},
        data: [...showD]
      };
    });

    return chart;
  }

  makeTextGauge(rate) {
    const rateColor = rate <= 0.6 ? '#5DE034' : rate <= 0.8 ? '#D67627' : '#E71111'

    return {
      series: [
        {
          type: 'pie',
          radius: ['70%', '90%'],
          startAngle: 210,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {value: rate * 240, itemStyle: {normal: {color: rateColor}}},
            {value: 360 - rate * 240, itemStyle: {normal: {color: '#00000000'}}}
          ]
        }
      ]
    };
  }
}
