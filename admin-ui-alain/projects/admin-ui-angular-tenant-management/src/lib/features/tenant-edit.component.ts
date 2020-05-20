import { Component, ViewChild, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema, SFComponent } from '@delon/form';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TenantManagementService } from '../services/tenant-management.service';
import {DESC_K8S_PLACEHOLDER, REGEX_K8S_NAME} from "admin-ui-angular-common";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-tenant-edit',
  templateUrl: './tenant-edit.component.html',
})
export class TenantEditComponent implements OnInit {

  record: any = {};
  update: false;
  @ViewChild('sf') sf: SFComponent;
  freeNodeList: { ip: string, comment: string }[] = [];
  machineEnum: { label: string, value: string }[] = [];

  schema: SFSchema = {
    properties: {
      // REGEX_K8S_NAME? contains '/' so no use here
      tenantName: { type: 'string', title: '租户名称', pattern: `^[a-z]([-a-z0-9]{0,13}[a-z0-9])$`,
        ui: {
          errors: {
            pattern: DESC_K8S_PLACEHOLDER
          }
        }
      },
      tenantDesc: {
        type: 'string', title: '描述', ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
      adminAccount: { type: 'string', title: '管理员账号' },

      hasMachine: {
        type: 'boolean', default: false, title: '是否分配主机', ui: {
          checkedChildren: '是',
          unCheckedChildren: '否',
        }
      },
      cpuLimit: {
        type: 'number',
        title: 'cpu上限(Mi)',
        default: 10,
        minimum: 0,
        ui: { visibleIf: { hasMachine: [false] } }
      },
      memoryLimit: {
        type: 'number',
        title: '内存上限(Mi)',
        default: 20480,
        minimum: 0,
        ui: { visibleIf: { hasMachine: [false] } }
      },
      storageLimit: {
        type: 'number',
        title: '存储上限(Mi)',
        default: 40960,
        minimum: 0,
        ui: { visibleIf: { hasMachine: [false] } }
      },
      machine: {
        type: 'string',
        title: '选择主机',
        ui: {
          visibleIf: { hasMachine: [true] },
          widget: 'select',
          mode: 'tags',
          notFoundContent: '没有找到游离状态主机',
          allowClear: true,
          placeholder: '可多选',
          asyncData: () =>
            of(this.machineEnum).pipe(delay(100)),
        },
        default: null,
      },
    },
    required: ['tenantName', 'tenantCode', 'cpuLimit', 'memoryLimit', 'storageLimit', 'adminAccount'],
    ui: {
      spanLabelFixed: 120,
      grid: { span: 18 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private tenantManagementService: TenantManagementService) {
  }

  save(value: any) {
    const tenant = value;
    this.tenantManagementService.updateTenant(this.sf.value, tenant.update).subscribe(() => {
      this.msgSrv.success(tenant.update ? '更新成功' : '保存成功');
      this.modal.close(value);
      delete tenant.update;
    }, () => {
        this.msgSrv.error(tenant.update ? '更新租户失败' : '创建租户失败');
        delete tenant.update;
    });
  }

  ngOnInit(): void {
    this.getFreeNodeList();
  }

  close() {
    this.modal.destroy();
  }

  private getFreeNodeList() {
    this.tenantManagementService.getFreeNodeList().subscribe((result: any) => {
      this.freeNodeList = result.rows;
      this.freeNodeList.forEach(res => {
        this.machineEnum.push({ label: res.ip, value: res.ip });
      });
    });
  }
}
