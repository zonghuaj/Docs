import {
  Component, Input,
} from '@angular/core';
import {TPNode} from "./topo-panel.entities";

@Component({
  selector: 'service-topo-panel-servlist',
  template: `
    <service-topo-panel [title]="'所有服务'">
      <ul *ngFor="let s of servList">
        <li>
          <span class="key singleline">{{s.name}}</span>
          <span class="val singleline">{{s.count}}</span>
        </li>
      </ul>
    </service-topo-panel>
  `,
  styles: [`
    ul {
      padding: 0;
      margin: 0;
    }

    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .key {
      display: inline-block;
      width: 124px;
      font-size: 0.9em;
      color: #AFB3B0;
    }

    .val {
      display: inline-block;
      width: 80px;
      text-align: right;
      float: right;
      font-size: 0.9em;
      color: #444444;
    }
  `]
})
export class TopoPanelServlistComponent {
  @Input() servList: TPNode[] = [];

  constructor() {
    this.servList.push({name: 'USER', count: 1});
    this.servList.push({name: 'Unknown', count: 3});
    this.servList.push({name: 'H2', count: 2});
    this.servList.push({name: 'Kafka', count: 1});
    this.servList.push({name: 'Tomcat', count: 1});
    this.servList.push({name: 'Kafka-consumer', count: 3});
  }
}
