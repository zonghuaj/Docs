import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'admin-ui-angular-itest-platform-root',
  template: `
    <div class="itest-wrapper">
      <iframe width="100%" height="100%" src="../../iautotest/" style="border: 0;"></iframe>
    </div>
  `,
  styles: [`
    .itest-wrapper {
      border: 0;
      /* see .content_wrapper padding */
      margin: -20px 0 0 -24px;
      width: calc(100% + 48px);
      height: calc(100% + 32px);
    }
  `]
})
export class AdminUiAngularItestPlatformComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

}
