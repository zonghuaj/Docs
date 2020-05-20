import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {_HttpClient, TitleService} from "@delon/theme";
import {Log, Replicas} from './log.entities';
import {ServLogService} from './service-log.service';
import {interval, Subscription} from 'rxjs';
import {mergeMap, startWith} from "rxjs/internal/operators";
import {ServiceManageService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'service-console',
  templateUrl: './service-log.component.html',
  styleUrls: ['./service-log.component.less'],
  providers: [ServLogService, ServiceManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceLogComponent implements OnInit, OnDestroy {
  servId: number;
  servName: string;

  replicas = {containerNames: [], podNames: []};
  selectedReplica = {pod: '', container: ''};
  logs: Log[] = [];
  isAutoLoading = false;
  isRequesting = false;
  logSubscriber$: Subscription;

  readonly AUTO_REFRESH_INTERVAL = 5 * 1000;

  poderr = false;

  constructor(
    private http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private titleSrv: TitleService,
    private logServ: ServLogService,
    private msg: NzMessageService,
    private servManService: ServiceManageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.titleSrv.setTitle('日志信息');
    this.servId = +this.route.parent.snapshot.paramMap.get('serviceId');

    this.servManService.getServiceInfo(this.servId)
      .subscribe(data => {
        this.servName = data.serviceName;
        this.getDeployPods();
      });
  }

  getDeployPods() {
    this.servManService.getDeploys(this.servName).subscribe((pods: any[]) => {
      this.replicas.podNames = pods.map(p => p.objectMeta.name);
      this.selectedReplica.pod = this.replicas.podNames[0];
      this.onPodSelected(this.selectedReplica.pod);
      this.cdr.detectChanges();
    }, err => {
      this.poderr = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.disableAutoLoading();
  }

  toggleAutoLoading(force?: boolean) {
    this.isAutoLoading = force || !this.isAutoLoading;

    if (this.isAutoLoading) {
      this.getLogs();
    } else {
      this.disableAutoLoading();
    }

    this.cdr.detectChanges();
  }

  getLogs() {
    this.logSubscriber$ = interval(this.AUTO_REFRESH_INTERVAL).pipe(
      startWith(0),
      mergeMap(() => {
        this.isRequesting = true;
        return this.logServ.getServiceLog(this.selectedReplica.pod, this.selectedReplica.container);
      })
    ).subscribe((l: Log[]) => {
      this.isRequesting = false;
      this.addLogs(l);
    });
  }

  onPodSelected(e) {
    this.isRequesting = true;
    this.clearLog();
    this.logServ.getContainers(e)
      .subscribe((rps: Replicas) => {
        this.replicas.containerNames = rps.containerNames;
        this.selectedReplica.container = this.replicas.containerNames[0];
        this.toggleAutoLoading(true);
      }, err => {
        this.poderr = true;
        this.cdr.detectChanges();
      });
  }

  addLogs(newLogs: Log[]) {
    if (this.logs.length > 0) {
      let addon: Log[] = [];
      const lastTime = this.logs[this.logs.length - 1].time;
      newLogs.forEach((l: Log) => {
        if (l.time > lastTime) addon.push(l);
      });

      if (addon.length > 0) {
        this.logs = [...this.logs, ...addon];
      }
    } else {
      this.logs = [...newLogs];
    }

    this.cdr.detectChanges();
  }

  clearLog() {
    this.logs = [];
    this.toggleAutoLoading();
  }

  disableAutoLoading() {
    if (this.logSubscriber$) {
      this.logSubscriber$.unsubscribe();
    }
  }

  downloadLog() {
    const fullLogText = this.getLogsText(this.logs);

    const fname = `log-${new Date().getTime()}-${this.selectedReplica.pod}.txt`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fullLogText));
    element.setAttribute('download', fname);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getLogsText(arr: Log[]) {
    let str = '';
    arr.forEach((f: Log) => {
      str += f.content;
      str += '\n';
    });
    str = str.slice(0, str.length - 2);

    return str;
  }

  goLogsDetail() {
    this.router.navigate(['/service/log-summary'], {
      queryParams: {
        name: this.servName,
      }
    });


    // this.router.navigate([`/service/log-summary?name=${this.servName}`]);
  }
}
