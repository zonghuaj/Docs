import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema, SFComponent } from '@delon/form';
import { ServiceManageService, ServiceListEntity } from 'admin-ui-angular-common';
import { AdminUiAngularServiceAutoscalerService } from '../services/admin-ui-angular-service-autoscaler.service';
@Component({
  selector: 'app-basic-list-edit',
  templateUrl: './edit.component.html'
})
export class AutoscalerEditComponent implements OnInit {

  isEdit = true;
  record: any = {};
  serviceVersionList = [];
  from = '';
  resourceLimit: any = { currentCpu: 0, currentMemory: 0, maxCpu: 0, maxMemory: 0 }
  @ViewChild('sf')
  sf: SFComponent;
  maxReplicaNum = 0;
  schema: SFSchema = {
    properties: {
      service: {
        type: 'string',
        title: '服务版本',
        ui: {
          widget: 'text',
        },
      },
      serviceId: { type: 'number', ui: { hidden: true } },
      versionId: { type: 'number', ui: { hidden: true } },
      cpuPercent: { type: 'number', title: 'CPU指标', minimum: 1, ui: { unit: '%' } },
      minPod: { type: 'number', title: '最小实例数', minimum: 1, },
      maxPod: { type: 'number', title: '最大实例数', minimum: 1, },
      enable: {
        type: 'boolean', title: '启用', default: true, minimum: 1, ui: {
          unit: '个',
          checkedChildren: '开',
          unCheckedChildren: '关',
        }
      },
    },
    required: ['service', 'cpuPercent', 'minPod', 'maxPod', 'enable'],

  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private servManageService: ServiceManageService,
    private autoscalerService: AdminUiAngularServiceAutoscalerService
    ) {
  }

  async save(value: any) {
    const serviceAndVersion = value.service;
    const autoscale = {
      enable: value.enable,
      maxPod: value.maxPod,
      minPod: value.minPod,
      version: value.version,
      editable: false,
      serviceId: value.serviceId,
      versionId: value.versionId,
      cpuPercent: value.cpuPercent
    };
    await this.autoscalerService.saveOrUpdateAutoscale(autoscale).subscribe(res => {
      this.msgSrv.success(res.result);
      this.modal.close(value);
    }, (err) => {
    });
  }

  getVersionData() {
    this.servManageService.getAllServices(1, 10000)
      .subscribe((res: ServiceListEntity) => {
        const dataList = [];
        res.rows.forEach((element: any) => {
          if (element.versions && element.versions.length > 0) {
            const children = [];
            element.versions.forEach(version => {
              if (version.autoscale === null || this.isEdit) {
                children.push({
                  label: version.version,
                  value: version.id,
                  parent: element.id,
                  isLeaf: true,
                  cpulimit: version.cpuLimit,
                  memoryLimit: version.memoryLimit
                });
              } else {
                children.push({
                  label: version.version,
                  value: version.id,
                  parent: element.id,
                  isLeaf: true,
                  disabled: true,
                  cpulimit: version.cpuLimit,
                  memoryLimit: version.memoryLimit
                });
              }
            });
            dataList.push({ label: element.serviceName, value: element.id, parent: 0, children });
          }
        });
        this.schema.properties.service.enum = dataList;
        this.serviceVersionList = dataList;
        if (this.isEdit) {
          this.loadEditData();
        } else {
          this.schema.properties.service.ui = { widget: 'cascader' };
        }
        this.sf.refreshSchema();
      }, (err) => {
        // this.message.error('获取列表失败');
      });
    this.servManageService.getResourceLimit().subscribe((res: any) => {
      this.resourceLimit = { ...res };
      const cpuAvailed = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu;
      const memoryAvailed = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory;
      this.maxReplicaNum = cpuAvailed / this.record.cpuLimit >= memoryAvailed / this.record.memoryLimit ?
        Math.floor(memoryAvailed / this.record.memoryLimit) : Math.floor(cpuAvailed / parseFloat(this.record.cpuLimit));
      this.schema.properties.maxPod.maximum = this.maxReplicaNum;
      if (cpuAvailed / this.record.cpuLimit >= memoryAvailed / this.record.memoryLimit) {
        this.schema.properties.maxPod.description = `受内存上限限制,该服务最大伸缩实例数为${this.maxReplicaNum}`;
      } else {
        this.schema.properties.maxPod.description = `受cpu上限限制,该服务最大伸缩实例数为${this.maxReplicaNum}`;
      }
      this.sf.refreshSchema();
    });
  }

  serviceSelect(item) {

  }

  close() {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.getVersionData();
  }

  private loadEditData() {
    if (this.record !== null && this.record !== undefined) {
      // const serviceAndVersion = this.record.service.serviceName + '/' + this.record.version;

      const service = this.serviceVersionList.find(item => item.value === this.record.serviceId);
      const serviceVersion = service.children.find(item => item.value === this.record.id);
      const serviceAndVersion = service.label + '/' + serviceVersion.label;
      this.sf.formData = {
        service: serviceAndVersion,
        version: this.record.version,
        serviceId: this.record.serviceId,
        versionId: this.record.id,
        enable: this.record.autoscale.enable,
        cpuPercent: this.record.autoscale.cpuPercent,
        minPod: this.record.autoscale.minPod,
        maxPod: this.record.autoscale.maxPod,
        editable: this.record.autoscale.editable,
      };
      this.schema.properties.service.ui = { widget: 'text' };
      this.sf.refreshSchema();
    }
  }
}
