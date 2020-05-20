import {
  Component,
  OnInit,
} from '@angular/core';
import {ActivatedRoute, ActivationEnd, Router} from "@angular/router";
import {ArtifactoryService} from "../artifactory.service";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'artifactory-detail-container',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card>
      <nz-card-tab>
        <nz-tabset nzSize="large" [nzSelectedIndex]="pos">
          <nz-tab *ngFor="let i of tabs" [nzTitle]="i.tab" (nzClick)="to(i)"></nz-tab>
        </nz-tabset>
      </nz-card-tab>
      <router-outlet></router-outlet>
    </nz-card>
  `,
  providers: [ArtifactoryService]
})
export class ArtifactoryDetailContainerComponent implements OnInit {
  private router$: Subscription;
  tabs: any[] = [
    {
      key: 'info',
      tab: '制品信息',
    },
    {
      key: 'runtime',
      tab: '运行配置',
    },
    {
      key: 'deploy',
      tab: '部署配置',
    },
  ];

  artId;
  pos = 0;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.artId = this.route.snapshot.paramMap.get('aid');

    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe((e) => {
        this.setActive();
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
    this.router.navigateByUrl(`/artifactory/${this.artId}/${item.key}`);
  }
}
