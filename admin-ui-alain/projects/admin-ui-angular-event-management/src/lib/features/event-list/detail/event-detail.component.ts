import {
  Component, Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {EventManageService} from '../../event-manage.service';

@Component({
  selector: 'event-detail-component',
  template: `
    <sv-container col="1">
      <sv label="类型">{{this.event.type}}</sv>
      <sv label="来源">{{this.event.from}}</sv>
      <sv label="创建时间">{{this.event.createAt}}</sv>
      <sv label="通知信息">{{this.event.message}}</sv>
    </sv-container>
  `,
  providers: [EventManageService]
})
export class EventDetailComponent implements OnInit {
  loading = false;
  @Input() event: any;
  constructor(private service: EventManageService) {
  }

  ngOnInit() {
    this.loading = false;
  }
}
