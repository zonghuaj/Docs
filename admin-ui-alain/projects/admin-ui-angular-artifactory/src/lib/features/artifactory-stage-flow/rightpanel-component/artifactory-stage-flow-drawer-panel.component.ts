import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'admin-ui-angular-pipe-drawer-panel',
  template: `
  <nz-card [nzBordered]="false" *ngFor="let dx of stagelist" nzTitle="{{dx.name}}">
    <div nz-row nzType="flex">
      <button  nz-button nzType="default" type="submit" class="ant-btn-lg" style="margin-bottom: 15px;"
              (click)="setParent(dx.id,dx.name,dx.id,dx.name)">{{dx.name}}
      </button>
    </div>
  </nz-card>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtifactoryStageFlowDrawerPanelComponent implements OnInit {
  @Input() id = 0;
  @Input() stagelist: any;
  loading = false;

  buttonArray = [{
    label: 'git',
    data: [{
      buttonlabel: 'a'
    }, {
      buttonlabel: 'aaa'
    }]
  }, {
    label: 'git2',
    data: [{
      buttonlabel: 'a'
    }, {
      buttonlabel: 'aaa'
    }]
  }];

  gateway;

  constructor(
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private cache: CacheService,
    private drawerRef: NzDrawerRef,
    private modalSrv: NzModalService, ) {
  }

  ngOnInit(): void {
    if (this.id) {
    }
  }

  close(extra?): void {
    this.drawerRef.close('cancel');
  }

  deleteGateway(extra?): void {
    const id = this.id;
  }

  setParent(type , title , id , name) {
    const para = {index: this.id , type , title , id , name} ;
    this.drawerRef.close(para);
  }

  confirmDelete() {
    this.modalSrv.confirm({
      nzTitle: '删除网关',
      nzContent: '一旦删除将无法恢复，确定删除当前网关吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteGateway(),
      nzCancelText: '取消',
    });
  }

}
