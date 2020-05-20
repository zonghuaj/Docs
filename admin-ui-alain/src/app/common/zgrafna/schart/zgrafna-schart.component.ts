import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {format} from "date-fns";
import {ZGChart, ZGData, UnitParser} from "@app/common/zgrafna/zgrafna.entites";

@Component({
  selector: 'zgrafna-schart',
  template: `
    <div class="charts" echarts [options]="options">
    </div>
  `,
  styles: [`
    .charts {
      height: 100%;
    }
  `],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZGrafnaSchartComponent implements OnInit {
  options;

  @Input() set data(d: ZGData[]) {
    if (d && d.length > 0) {
      this.options = this.makeChartOptions(d, this.chartOpt, this.unit);
      this.cdr.detectChanges();
    }
  }

  @Input() chartOpt: ZGChart;
  @Input() unit: UnitParser;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  makeChartOptions(datas: ZGData[], chartOpt: ZGChart, unit: UnitParser) {
    // bug#5455:
    // find max count of data array items
    const mostI = datas.map(d => d.values.length).reduce((max, x, i, arr) => x > arr[max] ? i : max, 0);
    const mostTimes = datas[mostI].values.map(d => d[0]);

    // const _data = JSON.parse(JSON.stringify(datas)); // for backup?
    // try {
    // do insert NaN to empty slot
    datas.forEach(d => {
      mostTimes.forEach((t, ti) => {
        if (!d.values[ti] || d.values[ti][0] !== t) {
          d.values.splice(ti, 0, {t, NaN});
        }
      });
    });
    // } catch (e) {
    // datas = _data; // restore if any error occured
    // }

    const xAxisData = datas[mostI].values
    // .map(d => d[0]);
      .map(d => format(+d[0] * 1000, 'HH:mm'));
    // .filter((d, i) => datas[0].values.indexOf(d) === i);

    const chart = {
      grid: {},
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        // axisLabel: {
        //   formatter: (val) => {
        //     // console.log(val);
        //     // console.log(format(val, 'mm:ss'));
        //     return format(val, 'mm:ss');
        //     // return val;
        //   }
        // },
        data: [...xAxisData]
      },
      yAxis: {
        type: 'value',
      },
      series: []
    };

    if (unit) {
      const parser = unit.parser;
      const suffix = unit.suffix;
      chart.yAxis['axisLabel'] = {
        formatter: (value) => {
          const decimal = unit.decimal ? +unit.decimal : 0;
          return parser(value, decimal, suffix);
        }
      };

      chart.tooltip['formatter'] = function (params, ticket, callback) {
        let htmlStr = '';
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const xName = param.name;
          const seriesName = param.seriesName;
          const value = parser(params[i].value, 2, suffix);
          const color = param.color;

          if (i === 0) {
            htmlStr += `${xName}<br/>`;
          }
          htmlStr += `<div>`;
          htmlStr += `<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:${color};"></span>`;

          htmlStr += `${seriesName}: ${value}`;

          htmlStr += `</div>`;
        }
        return htmlStr;
      }
    }

    if (chartOpt.useLegend) {
      const legend = {} as any;
      legend.data = datas.map(d => d.opt.alias || d.metric.pod_name || d.metric.destination_workload || d.metric.instance);
      if (legend.data.length > 4) {
        legend.type = 'scroll';
        legend.orient = 'vertical';
        legend.right = 10;

        chart.grid = {...chart.grid, x2: 300};
      }
      chart['legend'] = legend;
    } else {
      chart.grid = {...chart.grid, y: 10};
    }

    chart.series = datas.map(d => {
      const showD = d.values.map(d => +d[1]);
      const seriesD = {
        name: d.opt.alias || d.metric.pod_name || d.metric.destination_workload || d.metric.instance,
        symbol: 'none',
        type: 'line',
        // itemStyle: {color: '#7EB26D'},
        // areaStyle: {color: '#7EB26D55'},
        // areaStyle: {item: {}},
        data: [...showD]
      };

      if (d.opt.color) {
        seriesD['itemStyle'] = {color: d.opt.color};
      }

      if (chartOpt.fill) {
        seriesD['areaStyle'] = {item: {}};
      }

      return seriesD;
    });

    return chart;
  }
}
