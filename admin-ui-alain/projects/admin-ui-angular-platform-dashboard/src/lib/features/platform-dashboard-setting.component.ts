import {
  Component, OnInit,
} from '@angular/core';
import {TitleService} from '@delon/theme';

@Component({
  selector: 'platform-dashboard-setting',
  template: `
    <h1>SETTING SETTING SETTING</h1>
  `,
})
export class PlatformDashboardSettingComponent implements OnInit {

  constructor(private titleService: TitleService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('告警设置');
  }
}
