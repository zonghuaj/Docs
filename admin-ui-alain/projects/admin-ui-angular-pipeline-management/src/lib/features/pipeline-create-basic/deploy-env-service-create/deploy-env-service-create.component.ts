import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceManageService} from "admin-ui-angular-common";
import {NzMessageService} from "ng-zorro-antd";
import { NzDrawerRef } from 'ng-zorro-antd';
import {MpHeaderService} from "admin-ui-angular-common";
import {DevopsService} from "../../../devops.service";

export interface ServiceEntity {
  envCode?: string ;
  serviceName?: string ;
  versionName?: string ;
  appPorts?:[]
}

@Component({
  selector: 'admin-ui-angular-deploy-env-service-create',
  templateUrl: './deploy-env-service-create.component.html',
  styles: [],
  providers: [ServiceManageService, DevopsService]
})
export class DeployEnvServiceCreateComponent implements OnInit {

  loading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public nzdrawer: NzDrawerRef,
    private servManService: ServiceManageService,
    private devopsService: DevopsService,
    private msg: NzMessageService,
    private headerService: MpHeaderService,
    public location: Location
  ) {
  }

  ngOnInit() {
  }

 

  _submit(se: ServiceEntity) {
    this.loading = true;

    // this.servManService.createService(se)
    //   .subscribe(res => {
    //     this.msg.success('服务创建成功');
    //     this.router.navigate([`/service/${res.id}/detail/info`]);
    //   }, (err) => {
    //     this.loading = false;
    //     this.msg.error('创建失败');
    //   });
    this.nzdrawer.close();
    this.devopsService.saveNewService(se).subscribe(res => {
      this.msg.success('添加成功');
      this.loading = false;
      this.nzdrawer.close();
    }, (err) => {
      this.loading = false;
      this.msg.error('创建失败');
      this.nzdrawer.close();
    });
  }

}
