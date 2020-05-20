import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';

@Component({
  selector: 'admin-ui-angular-login-loading',
  templateUrl: './login-loading.component.html',
  styleUrls: ['./login-loading.less']
})
export class LoginLoadingComponent implements OnInit {
  projectList: Array<ProjectInfo>;
  envList: Array<EnvInfo>;
  constructor(
    private msg: NzMessageService,
    private cache: CacheService
  ) { }

  ngOnInit() {
    this.getEnvList();
    this.getProjectList();
  }

  checkChange(list, id) {
    this.deSelectList(list);
    if (list === 'project') {
      this.projectList.forEach(item => {
        if (item.projectId === id) {
          item.checked = true;
        }
      });
    }
    if (list === 'env') {
      this.envList.forEach(item => {
        if (item.environmentId === id) {
          item.checked = true;
        }
      });
    }
  }

  deSelectList(list: string) {
    if (list === 'project') {
      this.projectList.forEach(item => item.checked = false);
    }
    if (list === 'env') {
      this.envList.forEach(item => item.checked = false);
    }
  }

  getProjectList() {
    const httpRst: Array<ProjectInfo> = [
      {
        projectId: '123',
        projectName: '项目一',
        status: '1'
      },
      {
        projectId: '456',
        projectName: '项目二',
        status: '2'
      },
      {
        projectId: '789',
        projectName: '项目三',
        status: '2'
      }
    ];
    httpRst.forEach(item => {
      item.checked = false;
    });
    this.projectList = [... httpRst];
  }

  getEnvList() {
    const httpRst: Array<EnvInfo> = [
      {
        environmentId: 'string',
        environmentName: '环境一',
        environmentStatus: 'string',
        environmentIdentify: 'string',
        environmentServiceNum: 'string',
        environmentCluster: 'string',
        environmentStorage: 'string'
      }
    ];
    httpRst.forEach(item => {
      item.checked = false;
    });
    this.envList = [...httpRst];
  }

  checkListSelected(arr: Array<any>) {
    let checked = false;
    arr.forEach(item => {
      if (item.checked) {
        checked = true;
      }
    });
    return checked;
  }

  doLogin() {
    if (this.checkListSelected(this.projectList) && this.checkListSelected(this.envList)) {
      // TODO
      this.cache.set('project', '');
      this.cache.set('env', '');
      console.log('进行跳转');
    } else {
      this.msg.error('请选择一个项目以及一个环境进行登录');
    }

  }

}

export interface EnvInfo {
  environmentId: string;
  environmentName: string;
  environmentStatus: string;
  environmentIdentify: string;
  environmentServiceNum: string;
  environmentCluster: string;
  environmentStorage: string;
  checked?: boolean;
}

export interface ProjectInfo {
  projectId: string;
  projectName: string;
  status: string;
  checked?: boolean;
}
