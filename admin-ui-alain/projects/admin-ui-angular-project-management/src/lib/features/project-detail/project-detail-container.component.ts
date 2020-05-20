import {Component, OnInit, OnDestroy, Injector} from '@angular/core';
import {Router, ActivatedRoute, ActivationEnd} from '@angular/router';
import {filter, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {MpHeaderService} from "admin-ui-angular-common";

@Component({
  selector: 'project-detail-container',
  templateUrl: './project-detail-container.component.html',
  styleUrls: ['./project-detail-container.component.less']
})
export class ProjectDetailContainerComponent implements OnInit, OnDestroy {
  private router$: Subscription;
  tabs: any[] = [
    {
      key: 'info',
      tab: '项目信息',
    },
    {
      key: 'members',
      tab: '成员管理',
    },
  ];

  pos = 0;

  projId: string;

  showTab = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private headerService: MpHeaderService) {
  }

  ngOnInit(): void {
    this.projId = this.route.snapshot.paramMap.get('projectId');
    this.headerService.setTitle('工程详情');

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
    this.router.navigateByUrl(`/project/${this.projId}/detail/${item.key}`);
  }
}
