import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {CacheService} from "@delon/cache";
import {byteParser, cpuCountParser, percentageParser} from "admin-ui-angular-common";
import {ProjectManageService} from "../project-manage.service";
import {ZGContainer} from "admin-ui-angular-common";

@Component({
  selector: 'project-monitor-graph',
  template: `
    <div nz-row nzGutter="16">
      <zgrafna-container nz-col *ngFor="let d of items;first as isFirst"
                         [style.margin-top.px]="isFirst ? 0 : 8"
                         [nzSpan]="d.span"
                         [sac]="d">
      </zgrafna-container>
    </div>
  `,
  providers: [ProjectManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMonitorGraphComponent implements OnInit {
  readonly _items: ZGContainer[] = [
    {
      height: '200px',
      span: 24,
      unit: {
        parser: byteParser,
        suffix: 'ps'
      },
      title: '网络负载',
      sources: [
        {
          // qstring: 'assets/mocks/alarm/nrbt.json',
          qstring: `sum (rate (container_network_receive_bytes_total{namespace=~"^${this.namespace}$"}[5m]))`,
          step: '',
          opt: {
            alias: '接收',
            color: '#7EB26D'
          }
        },
        {
          qstring: `- sum (rate (container_network_transmit_bytes_total{namespace=~"^${this.namespace}$"}[5m]))`,
          step: '',
          opt: {
            alias: '发送',
            color: '#EAB834'
          }
        }
      ],
      chart: {
        useLegend: false,
        fill: true
      }
    },
    {
      height: '160px',
      span: 9,
      unit: {
        parser: percentageParser,
      },
      title: '内存使用率',
      sources: [{
        qstring: `sum (container_memory_working_set_bytes{namespace=~"^${this.namespace}$"}) / sum (machine_memory_bytes{}) * 100`,
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
        qstring: `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${this.namespace}$"}[5m])) / sum (machine_cpu_cores{}) * 100`,
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
        qstring: `sum (container_fs_usage_bytes{device=~"^/dev/[sv]d[a-z][1-9]$",namespace=~"^${this.namespace}$"}) / sum (container_fs_limit_bytes{device=~"^/dev/[sv]d[a-z][1-9]$"}) * 100`,
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
      sources: [{
        qstring: `sum (container_memory_working_set_bytes{namespace=~"^${this.namespace}$"})`,
        step: '',
      }],
      text: {
        type: 'avg',
      }
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
      _val: 0
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: cpuCountParser,
      },
      title: 'CPU用量',
      sources: [{
        qstring: `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${this.namespace}$"}[5m]))`,
        step: '',
      }],
      text: {
        type: 'avg',
      }
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
      _val: 0
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '存储用量',
      sources: [{
        qstring: `sum (container_fs_usage_bytes{device=~"^/dev/[sv]d[a-z][1-9]$",namespace=~"^${this.namespace}$"})`,
        step: '',
      }],
      text: {
        type: 'avg',
      }
    },
    {
      height: '100px',
      span: 3,
      unit: {
        parser: byteParser,
      },
      title: '存储总量',
      sources: [{
        qstring: `sum (container_fs_limit_bytes{device=~"^/dev/[sv]d[a-z][1-9]$",id="/"})`,
        step: '',
      }],
      text: {
        type: 'avg',
      }
    },
    {
      height: '160px',
      span: 12,
      unit: {
        parser: byteParser,
      },
      title: '内存使用',
      sources: [{
        qstring: `sum (container_memory_working_set_bytes{namespace=~"^${this.namespace}$"})`,
        step: '',
        opt: {
          alias: '内存使用',
          color: '#7EB26D'
        }
      }],
      chart: {
        useLegend: false,
        fill: false
      }
    },
    {
      height: '160px',
      span: 12,
      unit: {
        decimal: '1',
        parser: cpuCountParser,
      },
      title: 'CPU使用',
      sources: [{
        qstring: `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${this.namespace}$"}[5m])) `,
        step: '',
        opt: {
          alias: 'CPU使用',
          color: '#7EB26D'
        }
      }],
      chart: {
        useLegend: false,
        fill: false
      }
    }
  ];
  items: ZGContainer[] = [];

  _times: Date[];
  @Input() set times(ts: Date[]) {
    this._times = ts;
    if (this.usedData) {
      this.getData();
    }
  }

  get times() {
    return this._times;
  }

  usedData: {
    cpuLimit: number;
    cpuUse: number;
    memoryLimit: number;
    memoryUse: number;
  };

  constructor(private headerService: MpHeaderService,
              private pmService: ProjectManageService,
              private cache: CacheService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('资源监控');

    this.pmService.getDashboardData().subscribe(res => {
      this.usedData = res;
      this.makeRookieItem();

      this.getData();
    });
  }

  makeRookieItem() {
    let {memoryLimit, memoryUse, cpuLimit, cpuUse} = this.usedData;
    memoryLimit = memoryLimit * 1024 * 1024;
    memoryUse = memoryUse * 1024 * 1024;
    this._items[5]._val = memoryUse;
    this._items[6]._val = memoryLimit;
    this._items[8]._val = cpuUse;
    this._items[9]._val = cpuLimit;

    this._items[1].sources[0].qstring = `sum (container_memory_working_set_bytes{namespace=~"^${this.namespace}$"}) / ${memoryLimit} * 100`;
    this._items[2].sources[0].qstring = `sum (rate (container_cpu_usage_seconds_total{namespace=~"^${this.namespace}$"}[5m])) / ${cpuLimit} * 100`;
  }

  getData() {
    this.items = this._items.map(it => ({...it, times: this.times}));
    this.cdr.detectChanges();
  }

  get namespace() {
    return this.cache.getNone('tenantId') + '-.*';
  }
}
