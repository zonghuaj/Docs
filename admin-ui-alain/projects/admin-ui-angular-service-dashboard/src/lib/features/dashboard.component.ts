import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {WWData} from "./zwwave.component";
import {NzMessageService} from "ng-zorro-antd";
import {I18NService} from "@core";
import {DashboardService} from "./dashboard.service";
import {ZData} from "./dashboard-zlist.component";
import {AdminUiAngularAlertAllService as AlertService, AlertEntity} from "admin-ui-angular-alert-all";
import {subDays} from "date-fns";
import {ZGrafnaService} from "admin-ui-angular-common";
import {MpHeaderService} from "admin-ui-angular-common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  providers: [DashboardService, AlertService, ZGrafnaService],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  data: any = {};
  loading = true;

  usageData: WWData[] = [
    {name: 'CPU', percent: -1, desc: '-', color: '#53E69D'},
    {name: '内存', percent: -1, desc: '-', color: '#FFC36D'},
    {name: '存储', percent: -1, desc: '-', color: '#9AA9FF'}
  ];
  alertData: AlertEntity[] = [];

  servSummary: {
    "total": number;
    "running": number;
    "error": number;
    "stop": number;
  };
  servSummaryOpt;
  requestTimeTop10Opt;
  requestTop10Opt;

  cpuTop10Data: ZData[];
  memoryTop10Data: ZData[];
  qpsTop10Data: ZData[];

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private i18n: I18NService,
    private cdr: ChangeDetectorRef,
    private headerService: MpHeaderService,
    private dashboardService: DashboardService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.headerService.setTitle('仪表盘');

    const start = subDays(new Date(), 1);
    const end = new Date();
    this.dashboardService.getUsageData(start, end)
      .subscribe(res => {
        if (!res) return;
        this.usageData = res;
        this.usageData.find(d => d.name === 'CPU').color = '#53E69D';
        this.usageData.find(d => d.name === '内存').color = '#FFC36D';
        this.usageData.find(d => d.name === '存储').color = '#9AA9FF';
        this.cdr.detectChanges()
      });

    this.dashboardService.getServiceSummary()
      .subscribe((res: any) => {
        this.servSummary = res;
        this.servSummaryOpt = this.makeServSummaryOptions(res);
        this.cdr.detectChanges();
      });

    this.alertService.getAllAlerts(1, 5)
      .subscribe(res => {
        this.alertData = res.rows;
        this.cdr.detectChanges();
      });

    this.dashboardService.getRequestTop10Data()
      .subscribe(res => {
        this.requestTop10Opt = this.makeRequestTop10Opt(res);
        this.cdr.detectChanges();
      });

    this.dashboardService.getRequestTimeTop10Data()
      .subscribe(res => {
        this.requestTimeTop10Opt = this.makeRequestTimeTop10Opt(res);
        this.cdr.detectChanges();
      });

    this.dashboardService.getCPUTop10Data()
      .subscribe(res => {
        this.cpuTop10Data = this.makeZData(res);
        this.cdr.detectChanges();
      });

    this.dashboardService.getMemoryTop10Data()
      .subscribe(res => {
        this.memoryTop10Data = this.makeZData(res);
        this.cdr.detectChanges();
      });

    this.dashboardService.getQPSTop10Data()
      .subscribe(res => {
        this.qpsTop10Data = this.makeZData(res);
        this.cdr.detectChanges();
      });
  }

  private makeServSummaryOptions(data) {
    return {
      grid: {
        x: 0, y: 2, x2: 0, y2: 2
      },
      tooltip: {
        trigger: 'item',
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['运行中', '异常', '停止',]
      },
      series: [
        {
          type: 'pie',
          radius: ['80%', '100%'],
          // avoidLabelOverlap: false,
          label: {
            normal: {show: false, position: 'center'},
            emphasis: {show: false}
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          hoverAnimation: false,
          color: ['#47E497', '#FFB142', '#F3452E',],
          data: [
            {
              value: data.running,
              name: '运行中',
            },
            {value: data.error, name: '异常',},
            {value: data.stop, name: '停止',},
          ]
        }
      ]
    };
  }

  private makeRequestTimeTop10Opt(data) {
    if (data.length === 0) {
      data.push({'暂无数据': 0});
    }
    try { // do sort for desc
      data = data.sort((_d0, _d1) => {
        const d0 = Number(Object.values(_d0)[0]);
        const d1 = Number(Object.values(_d1)[0]);
        return d0 - d1;
      });
    } catch (e) {
    }

    return {
      grid: {
        x: '25%', y: 0, x2: '5%', y2: '10%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: []
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: [...data.map(d => this.slice(Object.keys(d)[0]))]
      },
      color: ['#3C90F7'],
      series: [
        {
          type: 'bar',
          data: [...data.map(d => Object.values(d)[0])]
        },
      ]
    };
  }

  private makeRequestTop10Opt(data) {
    return {
      grid: {
        x: '25%', y: 0, x2: '5%', y2: '10%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: []
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: [...data.map(d => this.slice(Object.keys(d)[0]))]
      },
      color: ['#3C90F7'],
      series: [
        {
          type: 'bar',
          data: [...data.map(d => Object.values(d)[0])]
        },
      ]
    };
  }

  private slice(str: string) {
    return str.length > 10 ? str.slice(0, 10) + '...' : str;
  }

  private makeZData(res: any): ZData[] {
    let data = res.map(d => ({
      name: Object.keys(d)[0], value: Object.values(d)[0]
    })).sort((d0, d1) => d1.value - d0.value);

    if (data.length < 10) {
      for (let i = data.length; i < 10; i++) {
        data.push({} as ZData);
      }
    } else {
      data = data.slice(0, 10);
    }

    return data;
  }
}
