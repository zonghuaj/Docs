import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CacheService } from '@delon/cache';
import { DeployEnvComponent } from '../deploy-env/deploy-env.component';
import { DeployEnvDeployComponent } from '../deploy-env-deploy/deploy-env-deploy.component';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'admin-ui-angular-deploy-env-container',
  templateUrl: './deploy-env-container.component.html',
  styles: [`customcard .ant-card-extra {
    position: absolute;
    right: 47px;
  }`]
})
export class DeployEnvContainerComponent implements OnInit {

  tabIndex = 0;

  deploysettings: any;

  basicsettings: any;

  // tslint:disable-next-line: variable-name
  _stageForm: any;



  @Input() name: string; 
  
  @Input() set stageForm(s) {
    this._stageForm = {...s};
  }

  get stageForm() {
    return this._stageForm;
  }

  @ViewChild('deployBasic')
  deployBasic: DeployEnvComponent;

  @ViewChild('deployDetail')
  deployDetail: DeployEnvDeployComponent;

  constructor(private cache: CacheService, private nzdrawer: NzDrawerRef) {
    this.tabIndex = this.cache.getNone<number>('deploy-env-container-tab') || 0;
    
  }

  ngOnInit() {
  }

  onTabChanged(index: number) {
    this.cache.set('deploy-env-container-tab', index);
  }

  submitF() {// this method is not use now , will be used in future.
   const formBackList = { formOption: {runtime: this.basicsettings , deploysetting: this.deploysettings}, name: ''};
   this.nzdrawer.close(formBackList);
  }

  getDetailData(data) {
    this.deploysettings = data;
  }

  getBasicData(data) {
    this.basicsettings = data;
  }

}
