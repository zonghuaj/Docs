import {
  Component,
  OnInit,
} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'version-table',
  template: `
    <artifactory-list [simpleList]="true" (itemSelect$)="selectVersion($event)"></artifactory-list>
  `,
})
export class VersionTableComponent implements OnInit {
  constructor(private modal: NzModalRef) {
  }

  selectVersion({artf, ver}) {
    let obj = {};
    obj['data'] = ver;
    obj['name'] = artf.name;
    this.modal.close(obj);
  }

  ngOnInit(): void {
  }


  close() {
    this.modal.close();
  }
}
