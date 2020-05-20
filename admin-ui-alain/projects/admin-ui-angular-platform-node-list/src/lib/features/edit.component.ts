import {Component, ViewChild, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {SFSchema, SFComponent, FormProperty, PropertyGroup} from '@delon/form';

import {zpost, zput, surlWithoutProject} from '@app/services/services.util';
import {_HttpClient} from '@delon/theme';

@Component({
  selector: 'app-node-list-edit',
  templateUrl: './edit.component.html',
})
export class NodeListEditComponent implements OnInit {

  record: any = {};
  update: false;
  isConnectSucc = false;
  loading = false;

  @ViewChild('sf')
  sf: SFComponent;

  schema: SFSchema = {
    properties: {
      ip: {type: 'string', title: 'ip', format: 'ipv4'},
      port: {type: 'string', title: 'SSH端口号'},
      username: {type: 'string', title: '用户名'},
      password: {type: 'string', title: '密码'},
      comment: {
        type: 'string', title: '备注', maxLength: 20, ui: {
          widget: 'textarea',
          autosize: {minRows: 2, maxRows: 6},
        },
      },
      ifFree: {
        type: 'boolean', title: '是否共享', default: false, ui: {
          optionalHelp: '游离为否时，该节点只有分配给租户时，才会自动分配POD。',
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
      }
    },
    required: ['port', 'ip', 'username', 'password'],
    ui: {
      spanLabelFixed: 120,
      grid: {span: 18},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private http: _HttpClient) {
  }

  save(value: any) {
    const user = value;
    if (user.update) {
      delete user.update;
      zput(this.http, `${surlWithoutProject('node')}`, this.sf.value).subscribe(result => {
        this.msgSrv.success('更新成功');
        this.modal.close(value);
      });
    } else {
      delete user.update;
      zpost(this.http, `${surlWithoutProject('node')}`, user).subscribe(result => {
        console.log("result..save.", result);
        if (result === 1) {
          this.msgSrv.success('保存成功');
          this.modal.close(value);
        } else if (result === -2) {
          this.msgSrv.error('此IP地址已存在');
        }
      });
    }
  }

  test(value: any) {
    console.log("test....", value);
    const url = 'nodetest';
    this.loading = true;
    const objdata = {
      ip: value.ip,
      port: value.port,
      username: value.username,
      password: value.password
    }
    zpost(this.http, url, objdata).subscribe((result: any) => {
      console.log('result..', result);
       if( result === 1 ) {
          this.msgSrv.success('连接成功');
          this.isConnectSucc = true;
       }else{
        this.msgSrv.error('连接失败');
        this.isConnectSucc = false;
       }
       this.loading = false;
    });
    // this.nodeService.getNodeTestInfo(url).subscribe((result: any) => {
    //   console.log("result....onTest:", result);
    // })
  }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
