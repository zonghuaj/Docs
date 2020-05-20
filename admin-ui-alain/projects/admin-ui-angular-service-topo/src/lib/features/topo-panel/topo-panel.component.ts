import {
  Component, Input, TemplateRef,
} from '@angular/core';

@Component({
  selector: 'service-topo-panel',
  templateUrl: './topo-panel.component.html',
  styleUrls: ['./topo-panel.component.less']
})
export class ServiceTopoPanelComponent {
  @Input() title: string;
  @Input() actionRef: TemplateRef<void>;

  constructor() {
  }
}
