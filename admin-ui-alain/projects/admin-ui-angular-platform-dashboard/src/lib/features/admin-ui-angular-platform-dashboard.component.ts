import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-ui-angular-platform-dashboard-root',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card nzBordered>
      <router-outlet></router-outlet>
    </nz-card>
  `,
  styles: []
})
export class AdminUiAngularPlatformDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
