import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STRes } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { AutoscalerEditComponent } from './edit.component';
import { AdminUiAngularServiceAutoscalerService } from '../services/admin-ui-angular-service-autoscaler.service';
@Component({
  selector: 'admin-ui-angular-service-autoscaler-root',
  templateUrl: './admin-ui-angular-service-autoscaler.component.html'
})
export class AdminUiAngularServiceAutoscalerComponent implements OnInit {

  url: string;
  params: any = { name: '' };

  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '服务', index: 'service.serviceName', default: '-' },
    { title: '版本', index: 'version' },
    { title: 'CPU指标', index: 'autoscale.cpuPercent', format: (item: any) => `${item.autoscale.cpuPercent} %`, },
    { title: '最小实例数', index: 'autoscale.minPod' },
    { title: '最大实例数', index: 'autoscale.maxPod' },
    // { title: '状态', index: 'autoscale.enable', format: (item: any) => (item.autoscale.enable ? `启用` : `禁用`), },
    { title: '启用状态', render: 'customStatus' },

    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          modal: {
            component: AutoscalerEditComponent,
          },
          click: (_record, modal) => this.st.reload()
        },
        {
          text: '删除',
          type: 'del',
          click: item => this.delete(item),
        },
      ],
    },
  ];
  // 定义返回的参数
  res: STRes = {
    reName: {
      list: 'data'
    }
  };

  create(): void {
    this.modal.create(AutoscalerEditComponent, { isEdit: false }, { size: 'md' }).subscribe(res => {
      this.st.reload();
    });
  }

  delete(item) {
    this.autoscalerService.delete(item).subscribe(() => {
      this.message.success('删除成功');
      this.st.reload();
    });
  }

  ngOnInit() {
  }

  constructor(
    private modal: ModalHelper,
    private message: NzMessageService,
    private autoscalerService: AdminUiAngularServiceAutoscalerService
  ) {
    this.url = this.autoscalerService.url;
  }

}
