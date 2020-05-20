import {
  Component, Input, OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ServiceTopoService} from "./service-topo.service";
import {TopoGraphComponent} from "./topo-graph/topo-graph.component";
import {ACTIONS} from "./actions";
import {TPNodeDetail, TPNode, TPCallDetail} from "./topo-panel/topo-panel.entities";
import {NzMessageService} from "ng-zorro-antd";
import {subDays} from "date-fns";

@Component({
  selector: 'service-topo',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('200ms ease-in', style({opacity: '1'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({opacity: '0'}))
      ])
    ])
  ],
  templateUrl: './service-topo.component.html',
  styleUrls: ['./service-topo.component.less'],
  providers: [ServiceTopoService]
})
export class ServiceTopoComponent implements OnInit {
  panelExpanded: boolean = true;

  times: Date[] = [
    new Date(subDays(new Date(), 1)),
    new Date()
  ];
  q = {
    startTime: this.times[0],
    endTime: this.times[1]
  };

  loading = false;
  nodata = true;

  @ViewChild('topograph') topograph: TopoGraphComponent;
  topoData: any; // holding all information, sla/latency/...

  allServices: TPNode[] = [];
  showingDetail: TPNodeDetail;
  showingDPChartData: TPCallDetail;

  panelShowing: ACTIONS;

  constructor(private topoService: ServiceTopoService,
              private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;

    const {startTime, endTime} = this.q;
    this.topoService.getFullTopoData(startTime, endTime)
      .subscribe((data: any) => {
        if (data[0].nodes.length === 0) {
          this.nodata = true;
          this.topograph.draw({nodes: [], calls: []});
          return;
        }

        this.nodata = false;
        const topo = data[0];
        this.topograph.draw(topo);
        this.allServices = this.makeAllServices(topo);

        this.topoData = data[1];
        this.loading = false;
      }, (err) => {
        this.loading = false;
        this.msg.error('获取信息失败');
      });
  }

  refresh() {
    this.getData();
  }

  makeAllServices(topo: any): TPNode[] {
    const sall = {};
    topo.nodes.forEach((nd: any) => {
      if (sall[nd.type]) {
        sall[nd.type] += 1;
      } else {
        sall[nd.type] = 1;
      }
    });

    const servs: TPNode[] = [];
    Object.keys(sall).forEach(k => {
      const s = {name: k, count: sall[k]};
      servs.push(s);
    });

    return servs;
  }

  onDatePicked(event) {
    this.q.startTime = event[0];
    this.q.endTime = event[1];

    this.getData();
  }

  togglePanel() {
    this.panelExpanded = !this.panelExpanded;
  }

  getValue(key: string, id: string): string {
    let value = null;
    try {
      value = this.topoData[key].values.find(d => d.id === id);
    } catch (e) {
    }

    return value;
  }

  onTopGraphItemSelect(item) {
    this.panelShowing = item.action;

    switch (item.action) {
      case ACTIONS.SET_NODE:
        this.makeNodeDetail(item);
        break;
      case ACTIONS.SET_NODE_LINE:
        this.makeNodeLine(item);
        break;
      default:
        break;
    }
  }

  makeNodeDetail(item: any) {
    this.showingDetail = {
      name: item.name,
      type: item.type,
      sla: item.sla,
      cpm: item.cpm,
      latency: item.latency
    };
  }

  makeNodeLine(item: any) {
    const {startTime, endTime} = this.q;

    this.topoService.getCallDetail(startTime, endTime, item).subscribe((data: any) => {
      this.showingDPChartData = data;
    });
  }
}
