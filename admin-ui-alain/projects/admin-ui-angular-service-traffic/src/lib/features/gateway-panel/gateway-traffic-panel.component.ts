import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NzDrawerRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AdminUiAngularServiceTrafficService } from '../../services/admin-ui-angular-service-traffic.service';
import { CacheService } from '@delon/cache';
import { GatewayConfigEntity } from '../../entities/traffic-config.entites';

@Component({
  selector: 'traffic-service-panel',
  template: `
    <gateway-traffic-panel-form #f (submit)="_submit($event)" [data]="gateway"></gateway-traffic-panel-form>

    <div nz-row nzType="flex" nzJustify="center">
      <button nz-button nzType="danger" type="submit" class="pl-lg pr-lg"
              (click)="confirmDelete()">删除
      </button>
      <button nz-button nzType="primary" type="submit" class="pl-lg pr-lg"
              [nzLoading]="loading"
              (click)="f.submitForm()">提交
      </button>
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayTrafficPanelComponent implements OnInit {
  @Input() id = 0;

  loading = false;

  gateway;

  constructor(
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private cache: CacheService,
    private drawerRef: NzDrawerRef<string>,
    private trafficService: AdminUiAngularServiceTrafficService,
    private modalSrv: NzModalService, ) {
  }

  ngOnInit(): void {
    if (this.id) {
      this.trafficService.getGatewayInfo(this.id)
        .subscribe((res: any) => {
          if (res.id) {
            res.domains = JSON.parse(res.domains).join('\n');
            this.gateway = res;
            this.cdr.detectChanges();
          }
        });
    }
  }

  close(extra?): void {
    this.drawerRef.close(extra);
  }

  deleteGateway(extra?): void {
    const id = this.id;
    this.trafficService.deleteGateway(id)
      .subscribe(res => {
        this.msg.success('删除成功');
        this.drawerRef.close(extra);
      }, err => {
        this.msg.error('删除失败');
        this.loading = false;
        this.cdr.detectChanges();
      });
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

  _submit(gw: GatewayConfigEntity) {
    // fuck anyi
    gw.domains = JSON.stringify(gw.domains.split('\n'));
    gw.projectCode = this.cache.getNone('projectCode');
    gw.tenantCode = this.cache.getNone('tenantId');

    this.loading = true;
    if (gw.id > 0) {
      this.trafficService.updateGateway(gw)
        .subscribe(res => {
          this.msg.success('修改成功');
          this.close();
        }, err => {
          this.msg.error('修改失败');
          this.loading = false;
          this.cdr.detectChanges();
        });
    } else {
      this.trafficService.createGateway(gw)
        .subscribe(res => {
          this.msg.success('创建成功');
          this.close('success');
        }, err => {
          this.msg.error('创建失败');
          this.loading = false;
          this.cdr.detectChanges();
        });
    }
  }
}
