import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { ConfigMapEntity } from '../entities/service.entities';
import { AdminUiAngularConfigCenterService } from '../services/admin-ui-angular-config-center.service';
import {DESC_K8S_PLACEHOLDER, REGEX_K8S_NAME} from "admin-ui-angular-common";
@Component({
  selector: 'admin-ui-angular-config-center-root',
  templateUrl: './admin-ui-angular-config-center.component.html',
  styleUrls: ['./admin-ui-angular-config-center.component.less'],
})
export class AdminUiAngularConfigCenterComponent implements OnInit {
  namePlaceHolder = DESC_K8S_PLACEHOLDER;

  get nameValid() {
    return this.configMapName && REGEX_K8S_NAME.test(this.configMapName);
  }

  immutable = true;
  jenkinsEdit = false;
  isAddConfigMapVisible = false;
  isEditConfigMapVisible = false;
  editName = '';
  configMapList: any[] = [];
  configEditCache: { [key: string]: any } = {};
  configItemEditCache: { [key: string]: any } = {};
  newConfigItem: { key: string, value: string }[] = [{ key: '', value: '' }];
  loading = false;
  updateConfigMapDatakeys: any[] = [];
  configMapName: string;
  configMapData: string;
  warnFlag = false;
  updateData: any;
  updateConfigMapName: string;
  updateConfigItem: { key: string, value: string }[] = [];
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
  };

  constructor(
    private serviceGovernanceService: AdminUiAngularConfigCenterService,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.updateEditItemCache();
  }

  submitFilter() {
    this.loading = true;
    this.getData();
  }

  startEdit() {
    this.immutable = false;
    this.jenkinsEdit = true;
  }

  startJenkinsEdit(data: any): void {
    this.isEditConfigMapVisible = true;
    this.editName = data.metadata.name;
    this.updateData = data;
    this.updateConfigMapName = this.updateData.metadata.name;
    this.cdr.detectChanges();
    this.updateJenkinsConfig();
  }

  showJenkinsfileModal() {
    this.isAddConfigMapVisible = true;
  }

  cancelJenkinsfileEdit(name: string): void {
    const index = this.configMapList.findIndex(item => item.name === name);
    this.configEditCache[name] = {
      data: { ...this.configMapList[index] },
      edit: false
    };
  }

  updateEditCache(): void {
    this.configMapList.forEach(item => {
      this.configEditCache[item.metadata.name] = {
        edit: false,
        data: { ...item }
      };
      this.editName = item.metadata.name;
    });
    this.loading = false;
  }

  updateEditItemCache(): void {
    this.newConfigItem.forEach(item => {
      this.configItemEditCache[item.key] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  saveConfigEdit(name: string): void {
    const configMap: ConfigMapEntity = new ConfigMapEntity();
    configMap.name = this.updateData.metadata.name;
    configMap.data = this.updateConfigMapDatakeys;
    this.updateConfigMapDatakeys.forEach(i => {
      if (i.value.includes('=') && !i.value.endsWith('\n')) {
        i.value += '\n';
      }
    });
    this.serviceGovernanceService.updateConfigMap(configMap)
      .subscribe(res => {
        this.msg.success('修改成功');
        this.getData();
        this.location.forward();
        this.cdr.detectChanges();
      }, (err) => {
        this.loading = false;
        this.msg.error('修改失败');
        this.cdr.detectChanges();
      });
    this.updateConfigMapDatakeys = [];
    this.isEditConfigMapVisible = false;
  }

  delConfigMap(name: string): void {
    this.serviceGovernanceService.delCofigMap(name).subscribe(res => {
      this.msg.success('删除成功');
      this.location.forward();
      this.getData();
      this.cdr.detectChanges();
    }, (err) => {
      this.loading = false;
      this.msg.error('删除失败!');
      this.cdr.detectChanges();
    });
  }

  getData() {
    const { pi, ps, name } = this.q;
    this.serviceGovernanceService.getCofigMapList(pi, ps, name).subscribe((res: any) => {
      // 1. set data
      this.configMapList = [...res];
      // 2. update edit cache
      this.updateEditCache();
      // 2. detect changes
      this.cdr.detectChanges();
    });
  }

  showConfigMapModal(): void {
    this.isAddConfigMapVisible = true;
  }

  createConfigMap(): void {
    const configMap: ConfigMapEntity = new ConfigMapEntity();
    configMap.name = this.configMapName;
    configMap.data = this.newConfigItem;
    this.newConfigItem.forEach(i => {
      if (i.value.includes('=') && !i.value.endsWith('\n')) {
        i.value += '\n';
      }
    });
    this.serviceGovernanceService.createConfigMap(configMap).subscribe(res => {
      this.msg.success('创建成功');
      this.location.forward();
      this.getData();
      this.cdr.detectChanges();
    }, (err) => {
      this.loading = false;
      this.msg.error('创建失败');
      this.cdr.detectChanges();
    });
    this.isAddConfigMapVisible = false;
    this.configMapName = null;
    this.configMapData = null;
    this.newConfigItem = [{ key: '', value: '' }];

  }

  get enableSubmit() {
    return this.nameValid;
  }

  addConfigItem() {
    if (this.newConfigItem.length === 0 || this.newConfigItem[this.newConfigItem.length - 1].key) {
      this.newConfigItem = [...this.newConfigItem, { key: '', value: '' }];
    } else {
      this.warnFlag = true;
    }
    this.cdr.detectChanges();
  }

  deleteAdddateItem(item: any) {
    const index = this.newConfigItem.indexOf(item);
    this.newConfigItem.splice(index, 1);
    if (this.newConfigItem.length === 0) {
      this.newConfigItem.push({ key: '', value: '' });
    }
    this.cdr.detectChanges();
  }

  deleteUpdateItem(item: any) {
    const index = this.updateConfigMapDatakeys.indexOf(item);
    this.updateConfigMapDatakeys.splice(index, 1);
    this.cdr.detectChanges();
  }


  addUpdateConfigItem() {
    // 如果数组最后一个为的key为空，不允许添加
    this.warnFlag = false;
    this.updateConfigMapDatakeys = [...this.updateConfigMapDatakeys, { key: '', value: '' }];
    this.cdr.detectChanges();
  }

  updateJenkinsConfig() {
    const item = this.configEditCache[this.editName].data.data;
    Object.keys(item).forEach(i => {
      this.updateConfigMapDatakeys.push({ key: i, value: item[i] });
    });
    this.cdr.detectChanges();
  }

  handleJenkinsConfigCancel(): void {
    this.immutable = true;
    this.jenkinsEdit = false;
  }

  addhandleConfigMapCancel(): void {
    this.isAddConfigMapVisible = false;
    this.configMapName = null;
    this.configMapData = null;
  }


  edithandleConfigCancel(): void {
    this.updateConfigItem = [];
    this.updateConfigMapDatakeys = [];
    this.isEditConfigMapVisible = false;
  }


  data2Json(object) {
    if (!object) {
      return '';
    }
    return JSON.stringify(object);
  }

  getValue(object, key) {
    if (!key) {
      return '';
    }
    return object.data[key];
  }

}
