import {Component, OnInit, OnDestroy, Injector} from '@angular/core';
import {Router, ActivatedRoute, ActivationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {MpHeaderService} from "admin-ui-angular-common";

@Component({
  selector: 'service-detail-container',
  templateUrl: './service-detail-container.component.html',
  styleUrls: ['./service-detail-container.component.less']
})
export class ServiceDetailContainerComponent implements OnInit, OnDestroy {
  private router$: Subscription;
  tabs: any[] = [
    {
      key: 'info',
      tab: '配置信息',
    },
    {
      key: 'monitor',
      tab: '监控',
    },
    {
      key: 'log',
      tab: '日志',
    },
    // {
    //   key: 'console',
    //   tab: '控制台',
    // },
    // {
    //   key: 'api',
    //   tab: 'API',
    // },
  ];

  pos = 0;

  servId: string;

  showTab = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private headerService: MpHeaderService) {
  }

  ngOnInit(): void {
    this.servId = this.route.snapshot.paramMap.get('serviceId');
    this.headerService.setTitle('服务详情');

    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe((e) => {
        this.setActive()
      });
    this.setActive();
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
  }

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) this.pos = idx;
  }

  to(item: any) {
    this.router.navigateByUrl(`/service/${this.servId}/detail/${item.key}`);
  }
}
