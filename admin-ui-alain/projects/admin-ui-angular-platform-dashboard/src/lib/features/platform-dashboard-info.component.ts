import {
  Component, ViewChild, OnInit,
} from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc';
import { CacheService } from '@delon/cache';

import { PodsEntity, ZGContainer } from '../entity/platform-dashboard.entities';
import { AdminUiAngularPlatformDashboardService } from '../services/admin-ui-angular-platform-dashboard.service';
import { byteParser, cpuCountParser, percentageParser } from 'admin-ui-angular-common';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  isSameDay,
  isSameMonth,
  isSameYear,
  subDays,
  subHours,
  subMonths,
  subWeeks
} from 'date-fns';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'platform-dashboard-info',
  templateUrl: './platform-dashboard-info.component.html',
  styleUrls: ['./platform-dashboard-info.component.less']
})
export class PlatformDashboardInfoComponent implements OnInit {
  times: Date[] = [
    subDays(new Date(), 1),
    new Date()
  ];

  ranges = {
    '最近1小时': [subHours(new Date(), 1), new Date()],
    '最近1天': [subDays(new Date(), 1), new Date()],
    '最近1周': [subWeeks(new Date(), 1), new Date()],
    '最近1月': [subMonths(new Date(), 1), new Date()],
  };

  readonly _items: ZGContainer[] = [
    {
      height: '160px',
      span: 9,
      unit: {
        parser: percentageParser,
      },
      title: '内存使用率',
      sources: [{
        qstring: `sum (container_memory_working_set_bytes{container_name!="",pod_name!=""}) / sum (machine_memory_bytes{}) * 100`,
        step: '',
        opt: {}
      }],
      text: {
        type: 'avg',
        bgChart: {},
        gauge: {}
      }
    },
    {
      height: '160px',
      span: 9,
      unit: {
        parser: percentageParser,
      },
      title: 'CPU使用率',
      sources: [{
        qstring: `sum (rate (container_cpu_usage_seconds_total{container_name!="",pod_name!=""}[5m])) / sum (machine_cpu_cores{}) * 100`,
        step: '',
      }],
      text: {
        type: 'avg',
        bgChart: {},
        gauge: {}
      }
    },
    {
      height: '160px',
      span: 6,
      unit: {
        parser: percentageParser,
      },
      title: '存储使用率',
      sources: [{
        // tslint:disable-next-line:max-line-length
        qstring: `sum (container_fs_usage_bytes{device=~"^/dev/[sv]d[a-z][1-9]$"}) / sum (container_fs_limit_bytes{device=~"^/dev/[sv]d[a-z][1-9]$"}) * 100`,
        step: '',
      }],
      text: {
        type: 'avg',
        bgChart: {},
        gauge: {}
      }
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '内存用量',
      sources: [
        // {
        //   qstring: `sum (container_memory_working_set_bytes{namespace=~"^${this.namespace}$"})`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '已分配',
      sources: [],
      text: {
        type: 'avg',
      },
      _val: 0
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '内存总量',
      sources: [
        // {
        //   qstring: `sum (machine_memory_bytes{})`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: cpuCountParser,
      },
      title: 'CPU用量',
      sources: [
        // {
        //   qstring: `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${this.namespace}$"}[5m]))`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: cpuCountParser,
      },
      title: '已分配',
      sources: [],
      text: {
        type: 'avg',
      },
      _val: 0
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: cpuCountParser,
      },
      title: 'CPU总量',
      sources: [
        // {
        //   qstring: `sum (machine_cpu_cores{})`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '存储用量',
      sources: [
        // {
        //   qstring: `sum (container_fs_usage_bytes{device=~"^/dev/[sv]d[a-z][1-9]$",namespace=~"^${this.namespace}$"})`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '存储总量',
      sources: [
        // {
        //   qstring: `sum (container_fs_limit_bytes{device=~"^/dev/[sv]d[a-z][1-9]$"})`,
        //   step: '',
        // }
      ],
      text: {
        type: 'avg',
      },
      _val: 0,
    },
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
      },
      title: '服务实例 内存使用量',
      sources: [{
        qstring: `sum (container_memory_working_set_bytes{container_name!="",pod_name!=""}) by (instance)`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        decimal: '1',
        parser: cpuCountParser,
      },
      title: '服务实例 CPU使用量',
      sources: [{
        qstring: `sum (rate (container_cpu_usage_seconds_total{container_name!="",pod_name!=""}[5m])) by (instance)`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        decimal: '1',
        parser: byteParser,
      },
      title: '服务实例 网络使用量',
      sources: [{
        qstring: `sum (rate(container_network_receive_bytes_total{container_name!="",pod_name!=""}[5m])) by (instance)`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
    {
      height: '200px',
      span: 24,
      unit: {
        decimal: '1',
        parser: byteParser,
      },
      title: '服务实例 存储使用量',
      sources: [{
        qstring: `sum (container_fs_usage_bytes{device=~"^/dev/[sv]d[a-z][1-9]$",container_name!="",pod_name!=""}) by (instance)`,
        step: '',
        opt: {}
      }],
      chart: {
        useLegend: true,
        fill: false
      }
    },
  ];
  items: ZGContainer[] = [];

  get namespace() {
    return this.cache.getNone('tenantId') + '-' + this.cache.getNone('projectCode');
  }

  listLoading = false;
  loading = false;

  page: STPage = {
    front: false,
  };

  q: any = {
    pi: 1,
    ps: 10,
    name: '',
  };
  data: PodsEntity[] = [];
  totalCount: number;

  readonly columns: STColumn[] = [
    { title: '名称', render: 'name' },
    { title: '标签', render: 'label' },
    { title: '已就绪', render: 'ready' },
    { title: 'CPU请求值（核）', index: 'cpuUsage' },
    { title: 'CPU限制值（核）', index: 'cpuLimit' },
    { title: '内存请求值（字节）', index: 'memoryUsage' },
    { title: '内存限制值（字节）', index: 'memoryLimit' },
    { title: '已创建', render: 'create', },
  ];

  @ViewChild('st')
  st: STComponent;

  usedData: {
    cpuLimit: number;
    cpuTotal: number;
    cpuUsage: number;
    memoryLimit: number;
    memoryUsage: number;
    memoryTotal: number;
    storageTotal: number;
    storageUsage: number;
  };

  constructor(
    private cache: CacheService,
    private dashboardService: AdminUiAngularPlatformDashboardService) {
  }

  ngOnInit(): void {
    this.getPodData();
    this.dashboardService.getUsageData()
      .subscribe((res: any) => {
        this.usedData = res;
        this.setGraphData();
      });
  }

  setGraphData() {
    this._items[3]._val = this.usedData.memoryUsage;
    this._items[4]._val = this.usedData.memoryLimit;
    this._items[5]._val = this.usedData.memoryTotal;
    this._items[6]._val = this.usedData.cpuUsage;
    this._items[7]._val = this.usedData.cpuLimit;
    this._items[8]._val = this.usedData.cpuTotal;
    this._items[9]._val = this.usedData.storageUsage;
    this._items[10]._val = this.usedData.storageTotal;
    this.items = this._items.map(it => ({ ...it, times: this.times }));
  }

  getPodData() {
    const { pi, ps, name } = this.q;
    this.listLoading = true;
    this.dashboardService.getNodeList(pi, ps, name)
      .subscribe(res => {
        this.listLoading = false;
        this.totalCount = res.count;
        this.data = res.rows;
      }, err => {
        this.listLoading = false;
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.q.pi = e.pi;
        this.getPodData();
        break;
    }
  }

  dayDiffFormat(t: Date) {
    const today = new Date();
    if (isSameDay(t, today)) {
      return '今天';
    } else if (isSameMonth(t, today)) {
      return Math.abs(differenceInCalendarDays(t, today)) + '天';
    } else if (isSameYear(t, today)) {
      return Math.abs(differenceInCalendarMonths(t, today)) + '月';
    } else {
      return '大于一年';
    }
  }
}
