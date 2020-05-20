import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { AdminUiAngularServiceTrafficService } from '../../services/admin-ui-angular-service-traffic.service';
import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'traffic-line-panel',
  templateUrl: 'line-panel.component.html',
  styleUrls: ['line-panel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinePanelComponent {
  private _data: any;
  @Input() set data(d) {
    if (!d) return;

    this._data = d;
    if (d.traffic.type === 'http' || d.traffic.type === 'grpc') {
      this.showReqDataCharts();
      this.getChartDatas();
    }
  };

  get data() {
    return this._data;
  }

  _duration;
  @Input() set duration(d) {
    if (!d) return;

    this._duration = d;
    this.getChartDatas();
  }

  get duration() {
    return this._duration;
  }

  @Output() close$ = new EventEmitter<any>();

  httpTrafficChartOption;
  httpReqTrafficMinMaxChartOption;
  httpResTimeChartOption;

  reqCount: {
    min: string,
    max: string
  } = { min: '-', max: '-' };
  reqErrCount: {
    min: string,
    max: string
  } = { min: '-', max: '-' };

  loading = false;

  tcpTrafficChartOption;
  tcpSentCount: {
    min: string,
    max: string
  } = { min: '-', max: '-' };
  tcpRecCount: {
    min: string,
    max: string
  } = { min: '-', max: '-' };

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private trafficService: AdminUiAngularServiceTrafficService) {
  }

  get isHttp() {
    return this.data.traffic.type === 'http' || this.data.traffic.type === 'grpc';
  }

  get isTcp() {
    return this.data.traffic.type === 'tcp';
  }

  showReqDataCharts() {
    const d = this.data;
    const _ok = d.traffic['successPercent'];

    this.httpTrafficChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['OK']
      },
      grid: {
        x: 5, y: 30,
        x2: 10, y2: 20
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: [d.traffic.type]
      },
      series: [
        {
          name: 'OK',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              // position: 'insideLeft'
            }
          },
          itemStyle: { color: 'green' },
          data: [_ok]
        },
      ]
    };

    if (d.traffic.type === 'http') {
      const _5xx = d.traffic['5xx'];
      const _4xx = d.traffic['4xx'];
      const _3xx = d.traffic['3xx'];
      this.httpTrafficChartOption.legend.data.push('3xx', '4xx', '5xx');
      this.httpTrafficChartOption.series.push(
        {
          name: '3xx',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
            }
          },
          itemStyle: { color: '#0088CE' },
          data: [_3xx]
        },
        {
          name: '4xx',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
            }
          },
          itemStyle: { color: '#EC7A08' },
          data: [_4xx]
        },
        {
          name: '5xx',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
            }
          },
          itemStyle: { color: '#CC0000' },
          data: [_5xx]
        }
      );
    } else {
      const _err = d.traffic['errorPercent'];
      this.httpTrafficChartOption.legend.data.push('Err');
      this.httpTrafficChartOption.series.push(
        {
          name: 'Err',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
            }
          },
          itemStyle: { color: '#CC0000' },
          data: [_err]
        },
      );
    }

    this.cdr.detectChanges();
  }

  getChartDatas() {
    if (!this.duration || !this.data) return;

    this.loading = true;
    const d = { ...this.data };
    delete d.source;
    delete d.target;

    const duration = this.duration.replace(/s/g, '');

    this.trafficService.getLinePanelData(duration, d)
      .subscribe(res => {
        this.loading = false;
        if (this.data.traffic.type === 'tcp') {
          this.showTcpTrafficCharts(res);
        } else {
          this.showReqResCharts(res);
        }
        this.cdr.detectChanges();
      }, err => {
        this.loading = false;
        this.msg.error('获取数据失败');
      });
  }

  showReqResCharts(data) {
    this.reqCount = {
      min: data.request.requestCount.min,
      max: data.request.requestCount.max,
    };
    this.reqErrCount = {
      min: data.request.requestErrorCount.min,
      max: data.request.requestErrorCount.max,
    };

    const reqData = data.request.requestCount.data;
    const reqErrData = data.request.requestErrorCount.data;
    this.httpReqTrafficMinMaxChartOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['每秒请求', '错误请求']
      },
      grid: {
        x: 5, y: 30,
        x2: 0, y2: 5
      },
      xAxis: {
        show: false,
        type: 'category',
        data: [...reqData.map(d => format(d[0] * 1000, 'HH:mm'))]
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [{
        name: '每秒请求',
        type: 'line',
        itemStyle: { color: '#0088CE' },
        data: [...reqData.map(d => +d[1])]
      }, {
        name: '错误请求',
        type: 'line',
        itemStyle: { color: '#CC0000' },
        data: [...reqErrData.map(d => +d[1])]
      },]
    };

    const dataAvg = data.response['avg'].matrix[0].values;
    const dataMed = data.response['0.5'].matrix[0].values;
    const data95 = data.response['0.95'].matrix[0].values;
    const data99 = data.response['0.99'].matrix[0].values;
    this.httpResTimeChartOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['平均值', '中值', '95', '99']
      },
      grid: {
        x: 5, y: 20,
        x2: 0, y2: 0
      },
      xAxis: {
        show: false,
        type: 'category',
        data: [...dataAvg.map(d => format(d[0] * 1000, 'HH:mm'))]
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          name: '平均值',
          type: 'line',
          itemStyle: { color: '#999' },
          data: [...dataAvg.map(d => (+d[1]) * 1000)]
        },
        {
          name: '中值',
          type: 'line',
          itemStyle: { color: 'green' },
          data: [...dataMed.map(d => (+d[1]) * 1000)]
        },
        {
          name: '95',
          type: 'line',
          itemStyle: { color: '#0088CE' },
          data: [...data95.map(d => (+d[1]) * 1000)]
        },
        {
          name: '99',
          type: 'line',
          itemStyle: { color: '#F79F4B' },
          data: [...data99.map(d => (+d[1]) * 1000)]
        },
      ]
    };
  }

  showTcpTrafficCharts(data) {
    this.tcpRecCount = {
      min: Math.min(...data.received.map(d => +d[1])) + '',
      max: Math.max(...data.received.map(d => +d[1])) + '',
    };
    this.tcpSentCount = {
      min: Math.min(...data.sent.map(d => +d[1])) + '',
      max: Math.max(...data.sent.map(d => +d[1])) + '',
    };

    const recData = data.received;
    const sentData = data.sent;
    this.tcpTrafficChartOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['发送', '接收']
      },
      grid: {
        x: 5, y: 30,
        x2: 0, y2: 5
      },
      xAxis: {
        show: false,
        type: 'category',
        data: [...recData.map(d => format(d[0] * 1000, 'HH:mm'))]
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [{
        name: '发送',
        type: 'line',
        itemStyle: { color: '#0088CE' },
        data: [...sentData.map(d => +d[1])]
      }, {
        name: '接收',
        type: 'line',
        itemStyle: { color: 'green' },
        data: [...recData.map(d => +d[1])]
      },]
    };
  }

  close() {
    this.close$.emit();
  }
}
