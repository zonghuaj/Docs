import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AdminUiAngularQualityGateService} from '../../../services/admin-ui-angular-quality-gate.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {zip} from 'rxjs';
import {TitleService} from "@delon/theme";

@Component({
  selector: 'qgate-project-detail',
  templateUrl: './qgate-project-detail.component.html',
  styleUrls: ['./qgate-project-detail.component.less'],
  providers: [AdminUiAngularQualityGateService],
  encapsulation: ViewEncapsulation.None
})
export class QGateProjectDetailComponent implements OnInit {
  loading: boolean;

  @Input() boarded = true;
  @Input() projectKey: string;
  project: any;
  lastCheckedDate: Date;
  measures: any;

  overviews: any[] = [];

  constructor(private route: ActivatedRoute,
              private msg: NzMessageService,
              private qgService: AdminUiAngularQualityGateService,
              private headerService: TitleService) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('项目详情');

    if (!this.projectKey) {
      this.projectKey = this.route.snapshot.params.key;
    }
    this.lastCheckedDate = this.route.snapshot.queryParams.lastCheckedDate;
    this.loading = true;

    zip(
      this.qgService.getQualityGateProjectDetailMetric(this.projectKey),
      this.qgService.getQualityGateMetrics()
    ).subscribe(([res, METRICS]) => {
      this.loading = false;

      const component = (res as any).component as any;
      this.project = component;
      this.measures = component.measures.map((m: any) => {
        const M = METRICS.metrics.find(me => me.key === m.metric);

        return {
          _metric: M,
          metric: m.metric,
          value: m.periods ? m.periods[0].value : m.value,
          name: M.name,
        };
      });

      this.overviews = component.projectStatus
        .filter(ps => ps.status === 'ERROR')
        .map((m: any) => {
          const M = METRICS.metrics.find(me => me.key === m.metricKey);

          return {
            _metric: M,
            metric: m.metricKey,
            value: m.actualValue,
            comparator: m.comparator,
            status: m.status,
            errorThreshold: m.errorThreshold
          };
        });
    }, err => {
      this.loading = false;
    });
  }

  get qualityGateStatus() {
    return this.getMetric('alert_status').value;
  }

  getMetric(key) {
    let met = {metric: key, value: null};
    try {
      const m = this.measures.find(me => me.metric === key);
      if (m) met = m; // in index-item page, some index still showed even value not exists
    } catch (e) {
    }

    return met;
  }
}
