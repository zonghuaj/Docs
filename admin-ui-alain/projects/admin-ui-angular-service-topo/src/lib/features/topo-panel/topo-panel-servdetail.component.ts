import {
  Component, Input,
} from '@angular/core';
import {TPNodeDetail, TPNode} from "./topo-panel.entities";

@Component({
  selector: 'service-topo-panel-servdetail',
  template: `
    <service-topo-panel [title]="'服务详情'">
      <ul>
        <li>
          <span class="key singleline">名称</span>
          <span class="val singleline">{{serv.name}}</span>
        </li>
        <li>
          <span class="key singleline">类型</span>
          <span class="val singleline">{{serv.type}}</span>
        </li>
        <li *ngIf="serv.sla">
          <span class="key singleline">可用性</span>
          <span class="val singleline">{{serv.sla + '%'}}</span>
        </li>
        <li *ngIf="serv.latency">
          <span class="key singleline">平均延时</span>
          <span class="val singleline">{{serv.latency + ' ms'}}</span>
        </li>
        <li *ngIf="serv.cpm">
          <span class="key singleline">CPM</span>
          <span class="val singleline">{{serv.cpm}}</span>
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
      width: 60px;
      font-size: 0.9em;
      color: #AFB3B0;
    }

    .val {
      display: inline-block;
      width: 130px;
      float: right;
      text-align: right;
      font-size: 0.9em;
      color: #444444;
    }
  `]
})
export class TopoPanelServDetailComponent {
  _keys = Object.keys;
  @Input() serv: TPNodeDetail;

  constructor() {
  }
}
