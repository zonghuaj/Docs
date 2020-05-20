import { Component, OnInit } from '@angular/core';
import { subDays, subHours, subMonths, subWeeks } from 'date-fns';
import { CacheService } from '@delon/cache';
import { ServiceEntity, VersionEntity, ProjectManageService, ProjectEntity } from 'admin-ui-angular-common';

export interface QParams {
  times: Date[];
  serv: ServiceEntity;
  vers: VersionEntity;
  _project: ProjectEntity;
}

@Component({
  selector: 'admin-ui-angular-monitor-all-root',
  templateUrl: './admin-ui-angular-monitor-all.component.html',
  styleUrls: ['./admin-ui-angular-monitor-all.component.less'],
})
export class AdminUiAngularMonitorAllComponent implements OnInit {

  tabIndex = 0;
  fakeTimeout;
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

  selectedS = {} as ServiceEntity;
  selectedV = {} as VersionEntity;

  q: QParams;

  fakeLoading = false;

  project: ProjectEntity;

  constructor(
    private pmService: ProjectManageService,
    private cache: CacheService) {
  }

  ngOnInit(): void {
    this.pmService.getProjectByCode(this.cache.getNone('projectCode'))
      .subscribe(res => {
        this.project = res;
        this.submit();
      });

  }

  onServiceSelect(serv) {
    this.selectedS = serv;
  }

  onVersionSelect(vers) {
    this.selectedV = vers;
  }

  submit() {
    this.q = {
      times: this.times,
      serv: this.selectedS,
      vers: this.selectedV,
      _project: this.project
    };

    this.setFakeLoading();
  }

  onTabChanged() {
    this.setFakeLoading();
  }

  setFakeLoading() {
    if (this.fakeTimeout) clearTimeout(this.fakeTimeout);

    this.fakeLoading = true;
    this.fakeTimeout = setTimeout(() => this.fakeLoading = false, 3000);
  }

  get namespace() {
    return this.cache.getNone('tenantId') + '-' + this.cache.getNone('projectCode');
  }

}
