import {Component, OnInit, ViewChild, Input,} from '@angular/core';
import {STComponent, STColumn, STData, STPage} from '@delon/abc';
import {ServiceListService} from "../service-list.service";
import {format} from "date-fns";
import {RollbackHis} from "../service-list.entities";

@Component({
  selector: 'roll-back-modal',
  template: `
    <nz-spin [nzSpinning]="loading">
      <div *ngIf="!nodata else empty">
        <p>请输入本次回滚的备注信息：</p>
        <input nz-input #deployRemark
               placeholder="备注信息">
        <st #st style="margin-top: 8px"
            [size]="'small'"
            [columns]="columns"
            [data]="data"
            [loading]="loading"
            [page]="page"
            (change)="dataChanged($event)">
          <ng-template st-row="revision" let-i>
            <span>{{i.revision}}</span>
            <nz-badge *ngIf="i.status === 'DEPLOYED'" nzStatus="success"
                      nz-tooltip nzTitle="当前运行"
                      style="margin-bottom: 5px; margin-left: 4px"></nz-badge>
          </ng-template>
        </st>
      </div>

      <ng-template #empty>
        <p>当前服务从未部署过，请先部署。</p>
      </ng-template>
    </nz-spin>
  `,
  providers: [ServiceListService]
})
export class RollBackModalComponent implements OnInit {
  loading = false;
  nodata = false;
  data: STData[] = [];

  @Input() vid: number;
  @Input() sid: number;

  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    {title: '', index: 'key', type: 'radio'},
    {title: '版本', index: 'revision', render: 'revision'},
    {title: '部署时间', index: 'updated',},
    {title: '备注信息', index: 'description',},
  ];
  page: STPage = {
    show: false
  };
  @ViewChild('deployRemark') deployRemark: any;

  constructor(private service: ServiceListService) {
  }

  ngOnInit() {
    this.loading = true;
    this.service.getRollbackHistory(this.sid, this.vid)
      .subscribe((data: RollbackHis[]) => {
        if (data.length === 0) {
          this.nodata = true;
        } else {
          this.data = data.map((d: RollbackHis, idx: number) => ({
            key: idx, checked: false, ...d, updated: format(d.updated, 'YYYY-MM-DD HH:mm:ss')
          }));

          this.selectItem(0);
        }
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
  }

  dataChanged(event) {
    if (event.radio) {
      this.selectItem(event.radio.key);
    }
  }

  selectItem(idx) {
    this.data.map((d, i) => {
      d.checked = i === idx;
      return d;
    });
  }

  getRollback() {
    if (this.data.length === 0) return null;

    const revision = this.data.filter(d => d.checked)[0]['revision'];
    const description = this.deployRemark.nativeElement.value;

    return {revision, description};
  }
}
