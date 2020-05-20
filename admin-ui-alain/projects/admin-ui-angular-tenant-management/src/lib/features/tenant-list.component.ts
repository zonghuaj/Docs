import { Component, OnInit, ViewChild } from '@angular/core';

import { STColumn, STPage, STComponent, STReq, STRes } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';

import { TenantEditComponent } from './tenant-edit.component';
import { ModalHelper } from '@delon/theme';
import { TenantManagementService } from '../services/tenant-management.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tenant-management-root',
  templateUrl: './tenant-list.component.html',
  styles: []
})
export class TenantListComponent implements OnInit {
  url: string;
  params: any = { tenantName: '' };
  @ViewChild('userSt') st: STComponent;
  req: STReq = {
    reName: {
      pi: 'pageNumber',
      ps: 'pageSize'
    },
  };
  // 定义返回的参数
  res: STRes = {
    reName: {
      total: 'data.count',
      list: 'data.rows'
    }
  };
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };
  columns: STColumn[] = [
    { title: '租户名称', index: 'tenantName', width: 100 },
    { title: '描述', render: 'tenantDesc', width: 200, },
    { title: 'cpu上限(Mi)', index: 'cpuLimit' },
    { title: '内存上限(Mi)', index: 'memoryLimit' },
    { title: '存储上限(Mi)', index: 'storageLimit' },
    { title: '创建人', index: 'createBy', width: 100 },
    {
      title: '创建时间', index: 'createDate', type: 'date', dateFormat: 'YYYY-MM-DD hh:mm:ss'
    },
    {
      title: '操作',
      width: 140,
      buttons: [
        {
          text: '编辑',
          click: item => this.openEdit(item),
        },
        // fix: mp-225 ???
        // {
        //   text: '删除',
        //   type: 'del',
        //   click: item => this.delete(item.id),
        // },
      ],
    },
  ];
  record: any = {};

  constructor(
    private modal: ModalHelper,
    private message: NzMessageService,
    private tenantManagementService: TenantManagementService
  ) { }

  ngOnInit(): void {
    this.url = this.tenantManagementService.tenantUrl;
  }

  openEdit(record) {
    record.update = true;
    this.modal.create(TenantEditComponent, { record }, { size: 'md' }).subscribe(() => {
      this.st.reload();
    });
  }

  openAdd() {
    const record: any = { update: false };
    this.modal.create(TenantEditComponent, { record }, { size: 'md' }).subscribe(() => {
      this.st.reload();
    });
  }

  delete(tenantId) {
    this.tenantManagementService.deleteTenantById(tenantId).subscribe(() => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }

}
