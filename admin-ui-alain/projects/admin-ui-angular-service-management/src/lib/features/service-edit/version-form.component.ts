import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnDestroy,
  ViewChild
} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from "@angular/forms";
import {PlatformManageService} from "admin-ui-angular-platform-os";
import {AdminUiAngularConfigCenterService as ServiceGovernanceService} from "admin-ui-angular-config-center";
import {VersionEntity, BaseFormComponent, ServiceManageService} from "admin-ui-angular-common";
import {PlatformIntegrationService} from "admin-ui-angular-project-management";
import {PipelineTemplateService} from "admin-ui-angular-pipeline-management";
import {Router} from "@angular/router";
import {VersionTableComponent} from './version-table.component';
import {ModalHelper} from '@delon/theme';
import {STComponent} from '@delon/abc';
import {throttleTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {DESC_K8S_PLACEHOLDER, k8sNameFormValidor} from "admin-ui-angular-common";

@Component({
  selector: 'version-form',
  templateUrl: './version-form.component.html',
  styles: [`
      .huge-button {
          width: 360px;
          height: 200px;
          font-size: 36px;
      }

      .input100 {
          width: 100%;
      }
  `],
  providers: [PlatformManageService, ServiceGovernanceService, PlatformIntegrationService, PipelineTemplateService, ServiceManageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionFormComponent extends BaseFormComponent<VersionEntity> implements OnDestroy {
  namePlaceHolder = DESC_K8S_PLACEHOLDER;

  id = 0;
  sourceType = 0;
  cpuError = '';
  memoryError = '';
  @ViewChild('groupsSt')
  st: STComponent;
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
  };
  resourceLimit: any = {currentCpu: 0, currentMemory: 0, maxCpu: 0, maxMemory: 0};
  scriptEnv = [];
  buildEnv = [];
  configInfo: { name: string, itemName: any }[] = [];
  cpuAvailed = 0;
  memoryAvailed = 0;
  jenkinsList;
  pipelineTemplates;
  selectedPipelineTemplate;

  envInfo: { name: string, ifConfigMap: boolean, value: string, configName: string, configItem: string }[] = [];
  mountTypes = [
    {value: 'ReadWriteOnce', label: 'ReadWriteOnce'},
    {value: 'ReadOnlyMany', label: 'ReadOnlyMany'},
    {value: 'ReadWriteMany', label: 'ReadWriteMany'}
  ];
  env_rdo: [] = [];
  configMapList: any[] = [];
  configMapListRefresh$ = new Subject();

  cpuUnit = (value: number) => `${value}`;
  cpuParse = (value: string) => value.replace(' ms', '');
  memoryUnit = (value: number) => `${value}`;
  memoryParse = (value: string) => value.replace(' mib', '');
  mountUnit = (value: number) => `${value}`;
  mountParse = (value: string) => value.replace(' mib', '');

  constructor(private fb: FormBuilder,
              public router: Router,
              private cdr: ChangeDetectorRef,
              private modal: ModalHelper,
              private platformManageService: PlatformManageService,
              private serviceGovernanceService: ServiceGovernanceService,
              private serviceManageService: ServiceManageService,
              private platformIntegrationService: PlatformIntegrationService,
              private pipelineTemplateService: PipelineTemplateService) {
    super();
  }

  dependenciesValidator(control: FormControl): any {
    if (control.value) {
      let dependencies: string[] = control.value.split(',');
      let judge: boolean = true;
      for (let i = 0; i < dependencies.length; i++) {
        judge = dependencies[i].length > 0;
      }
      return judge ? null : {dependencies: ''};
    }
  }

  cpuLimitValidator(control: FormControl): any {
    if (this.resourceLimit.maxCpu != 0) {
      if (control.value) {
        let cpuMargin = 0;
        if (this.data) {
          cpuMargin = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu - control.value * this.replica.value + parseFloat(this.data.cpuLimit + "") * this.replica.value;
        } else {
          cpuMargin = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu - control.value * this.replica.value
        }
        this.cpuError = 'cpu使用核数超过项目配额';
        return cpuMargin >= 0 ? null : {cpulimit: ''};
      } else {
        this.cpuError = '请输入CPU使用核数';
        return {cpulimit: ''}
      }
    }
  }

  memoryLimitValidator(control: FormControl): any {
    if (this.resourceLimit.maxCpu != 0) {
      if (control.value) {
        let memoryMargin = 0;
        if (this.data) {
          memoryMargin = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory - control.value * this.replica.value + parseFloat(this.data.memoryLimit + "") * this.replica.value;
        } else {
          memoryMargin = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory - control.value * this.replica.value;
        }
        this.memoryError = '内存使用数超过项目配额';
        return memoryMargin >= 0 ? null : {memoryLimit: ''};
      } else {
        this.memoryError = '请输入内存数值';
        return {memoryLimit: ''}
      }
    }
  }

  getJenkinsConfigs() {
    this.pipelineTemplateService.getAllTemplates(1, 100, '', '', true)
      .subscribe((res: any) => {
        this.pipelineTemplates = res.rows;
      });

    this.platformIntegrationService.getIntegratedList('jenkins')
      .subscribe((res: any) => {
        this.jenkinsList = res.rows.map(j => ({id: j.id, name: j.url}));
        this.setFormVal({jenkinsId: this.jenkinsList[0].id});
      });
  }

  onPipelineTemplateSelected(e) {
    if (!this.pipelineTemplates) return;

    this.selectedPipelineTemplate = this.pipelineTemplates.find(t => t.id === e);
    const params = this.selectedPipelineTemplate.params;
    if (params) {
      this.pipelineParams = this.fb.group(
        params.reduce((c, p) => ({
          ...c,
          [p.key]: new FormControl(p.defValue)
        }), {}));
    }
  }

  getOperatingEnv() {
    const {pi, ps, name} = this.q;

    this.platformManageService.getDockerfiles(pi, ps, '').subscribe((res: any) => {
      this.scriptEnv = res.rows.map(i => ({value: i.projectType, label: i.projectType}));
      // this.setFormVal({"operatingEnv": this.scriptEnv[0].label});
      this.cdr.detectChanges();
    });
    this.platformManageService.getJenkinsfiles(pi, ps, '')
      .subscribe((res: any) => {
        this.buildEnv = res.rows.map(i => ({value: i.projectType, label: i.projectType}));
        // this.setFormVal({"buildType": this.buildEnv[0].label});
        this.cdr.detectChanges();
      });

    this.serviceManageService.getResourceLimit().subscribe((res: any) => {
      this.resourceLimit = {...res};
      this.cpuAvailed = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu;
      this.memoryAvailed = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory;
      this.cdr.detectChanges();
    });

    this.configMapListRefresh$
      .pipe(throttleTime(2000))
      .subscribe(() => {
      // 1. set data
      this.serviceGovernanceService.getCofigMapList(1, 1000, '')
        .subscribe((res: any) => {
          // 1. set data
          this.configMapList = [...res];
          // 2. build
          this.buildList();
          // 3. detect changes
          this.cdr.detectChanges();
        });
    });
    this.getConfigMap();
  }

  getConfigMap() {
    this.configMapListRefresh$.next();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getOperatingEnv();
    this.getJenkinsConfigs();
    this.setFormVal({
      replica: 1,
      cpuLimit: 0.4,
      memoryLimit: 1024,
      packagePath: '.',
    });
  }

  ngOnDestroy(): void {
    this.configMapListRefresh$.complete();
    this.configMapListRefresh$.unsubscribe();
  }

  initForm(): FormGroup {
    return this.fb.group({
      version: ['', [Validators.required, k8sNameFormValidor]],
      versionDesc: ['', []],
      gitUrl: ['', [Validators.required]],
      gitBrunch: ['', [Validators.required]],
      // 构建参数
      operatingEnv: ['NANA', [Validators.required]],
      buildType: ['NANA', [Validators.required]],
      packagePath: ['NANA', []],
      targetFile: ['NANA', []],
      // 构建参数 end
      replica: ['', [Validators.required]],
      appArgs: ['', []],
      jvmArgs: ['', []],
      mountPath: ['', []],
      cpuLimit: ['', [Validators.required, (control) => this.cpuLimitValidator(control)]],
      memoryLimit: ['', [Validators.required, (control) => this.memoryLimitValidator(control)]],
      mountType: ['', []],
      mountLimit: ['', []],
      dependencies: ['', [this.dependenciesValidator]],
      env: ['', []],
      testPath: ['', []],
      imageTag: ['', []],
      imageAddr: ['', []],
      jenkinsId: ['', []],
      imageTemplateParam: ['', []],
      pipelineTemplateId: ['', []],
      pipelineParams: this.fb.group({}),
      arti: ['', []],
      artiVer: ['', []],
      env_rdo: ['', []],
      envInfo_new: this.fb.array([]),
      configInfo_new: this.fb.array([])
    });
  }

  get configInfo_new() {
    return this.form.controls.configInfo_new as FormArray;
  }

  get envInfo_new() {
    return this.form.controls.envInfo_new as FormArray;
  }

  get immutable() {
    return !!this.data;
  }

  get version() {
    return this.form.controls.version;
  }

  get versionDesc() {
    return this.form.controls.versionDesc;
  }

  get gitUrl() {
    return this.form.controls.gitUrl;
  }

  get gitBrunch() {
    return this.form.controls.gitBrunch;
  }

  get operatingEnv() {
    return this.form.controls.operatingEnv;
  }

  get buildType() {
    return this.form.controls.buildType;
  }

  get replica() {
    return this.form.controls.replica;
  }

  get appArgs() {
    return this.form.controls.appArgs;
  }

  get jvmArgs() {
    return this.form.controls.jvmArgs;
  }

  get packagePath() {
    return this.form.controls.packagePath;
  }

  get mountPath() {
    return this.form.controls.mountPath;
  }

  get memoryLimit() {
    return this.form.controls.memoryLimit;
  }

  get mountLimit() {
    return this.form.controls.mountLimit;
  }

  get cpuLimit() {
    return this.form.controls.cpuLimit;
  }

  get mountType() {
    return this.form.controls.mountType;
  }

  get env() {
    return this.form.controls.env;
  }

  get dependencies() {
    return this.form.controls.dependencies;
  }

  get targetFile() {
    return this.form.controls.targetFile;
  }

  get imageAddr() {
    return this.form.controls.imageAddr;
  }

  get imageTag() {
    return this.form.controls.imageTag;
  }

  get jenkinsId() {
    return this.form.controls.jenkinsId;
  }

  set pipelineParams(fg: FormGroup) {
    this.form.controls.pipelineParams = fg;
    this.cdr.detectChanges();
  }

  get pipelineTemplateId() {
    return this.form.controls.pipelineTemplateId;
  }

  get pipelineParams() {
    return this.form.controls.pipelineParams as FormGroup;
  }

  get showPipelineParams() {
    return Object.keys(this.pipelineParams.controls).length > 0;
  }

  get pipelineTemplateItems() {
    if (this.data) {
      return this.data.pipelineParams;
    } else {
      if (typeof this.selectedPipelineTemplate !== 'undefined') return this.selectedPipelineTemplate.params;
    }
    return null;
    //return this.data ? this.data.pipelineParams : this.selectedPipelineTemplate.params;
  }

  get imageTemplateParam() {
    return this.form.controls.imageTemplateParam;
  }

  onTypeSelected(type) {
    this.sourceType = type;
    this.setDefValue();
  }

  setDefValue() {
    if (this.sourceType === 3) { // from pipeline
      this.setFormVal({
        imageAddr: 'NANA',
        imageTag: 'NANA'
      });
    } else { // from image
      this.setFormVal({
        gitBrunch: 'NANA',
        gitUrl: 'NANA',
        operatingEnv: "NANA",
        buildType: "NANA",
        jvmArgs: "NANA"
      });
    }
  }

  setFormData(d: VersionEntity) {
    const data = JSON.parse(JSON.stringify(d));
    this.sourceType = data.sourceType;
    this.id = data.id;
    if (data.sourceType === 3) {
      this.disableField(this.jenkinsId, this.pipelineTemplateId);
      const params = data.pipelineParams;
      if (params) {
        this.pipelineParams = this.fb.group(
          params.reduce((c, p) => ({
            ...c,
            [p.key]: new FormControl(p.value)
          }), {}));
      }
      if (data.pipelineParams) {
        data.pipelineParams = data.pipelineParams.reduce((c, p) => ({...c, [p.key]: p.value}), {});
      }
    }
    super.setFormData(data);
    if (data.configInfo) {
      this.configInfo = JSON.parse(data.configInfo);
    }
    if (data.env) {
      this.envInfo = JSON.parse(data.env);
    }
    // this.setFormVal({env: envStr2Form(data.env)});
    this.setDefValue();
    this.disableField(this.version, this.mountType, this.mountLimit);
  }

  assembleData(fgroup: FormGroup): VersionEntity {
    const res = super.assembleData(fgroup);
    const params = this.pipelineTemplateItems;
    //let pipelineParams = null;
    // if(typeof params !== 'undefined' && params) {
    //   pipelineParams = Object.keys(res.pipelineParams).map(k => {
    //     const p = params.find(p => p.key === k);
    //     return {
    //       "id": p.id,
    //       "key": k,
    //       "value": res.pipelineParams[k],
    //       "label": p.label,
    //       "defValue": p.defValue,
    //       // "isRequired": "1",
    //       // "type": "TEXT",
    //       "promptMessage": p.promptMessage
    //     }
    //   });
    // }

    let result = {
      ...res,
      mountLimit: +res.mountLimit,
      sourceType: this.sourceType,
      configInfo: this.validateConfigList(),
      env: this.validateEnvList(),
      pipelineParams: []
    };

    if (this.sourceType === 3) {
      // reformat pipeline parameters
      result.pipelineParams = Object.keys(res.pipelineParams).map(k => {
        const p = this.pipelineTemplateItems.find(p => p.key === k);
        return {
          "id": p.id,
          "key": k,
          "value": res.pipelineParams[k],
          "label": p.label,
          "defValue": p.defValue,
          // "isRequired": "1",
          // "type": "TEXT",
          "promptMessage": p.promptMessage
        }
      });
    }

    return result;
  }

  validateConfigList() {
    if (this.configInfo && this.configInfo.length !== 0) {
      if (this.configInfo[0].name) {
        return JSON.stringify(this.configInfo);
      }
    }
    return '';
  }

  validateEnvList() {
    if (this.envInfo && this.envInfo.length !== 0) {
      if (this.envInfo[0].name) {
        this.envInfo.forEach(item => {
          item.name = item.name.replace(" ", "");
          item.name = item.name.replace(",", "");
          item.value = item.value.replace(" ", "");
          item.value = item.value.replace(",", "");
        });
        return JSON.stringify(this.envInfo);
      }
    }
    return '';
  }


  addConfig() {
    if (this.configInfo.length == 0 || this.configInfo[this.configInfo.length - 1].name) {
      this.configInfo.push({name: '', itemName: {configName: "", configItemName: ""}});
    } else {
    }
  }

  addEvnItem() {
    if (this.envInfo.length == 0 || this.envInfo[this.envInfo.length - 1].name) {
      this.envInfo.push({
        name: '', ifConfigMap: false, value: '', configName: '', configItem: ''
      });
    } else {
    }
  }

  addEvnItemC() {
    if (this.envInfo.length == 0 || this.envInfo[this.envInfo.length - 1].name) {
      this.envInfo.push({
        name: '', ifConfigMap: true, value: '', configName: '', configItem: ''
      });
    } else {
    }
  }

  delConfig(item) {
    const index = this.configInfo.indexOf(item);
    this.configInfo.splice(index, 1);
    // if (this.configInfo.length == 0) {
    //   this.configInfo.push({name: '', itemName: ''})
    // }
    this.cdr.detectChanges();
  }

  delEnvItem(item) {
    const index = this.envInfo.indexOf(item);
    this.envInfo.splice(index, 1);
    // if (this.envInfo.length == 0) {
    //   this.envInfo.push({
    //     name: '', ifConfigMap: false, value: '', configName: '', configItem: ''
    //   })
    // }
    this.cdr.detectChanges();
  }

  configMapName = [];
  configItems: { [configName: string]: string[] } = {};

  configNameChange(value: string, item: any, type: number): void {
    if (type === 1) {
      item.itemName.configItemName = this.configItems[value]? this.configItems[value][0] : '' ;
    }else {
      item.configItem = this.configItems[value]? this.configItems[value][0] : '' ;
    }
  }


  onConfigNameNewOpen(o) {
    if (o) this.getConfigMap();
  }

  private buildList() {
    this.configMapName = [];
    this.configMapList.forEach(
      res => {
        this.configMapName.push(res.metadata.name);
        if (res.data) {
          let itemNameList = Object.keys(res.data);
          this.configItems[res.metadata.name] = [...itemNameList];
        }
      }
    )
  }

  onEnvChange(v) {
  }

  createParm(obj) {
    const that = this;
    that.envInfo_new.controls.splice(0);
    that.envInfo_new.setValue([]);
    obj.forEach(element => {
      let parmArr = {
        flag: 0,
        name: [element.name],
        value: [element.value],
        configName: [element.configName],
        configItem: [element.configItem]
      }
      that.envInfo_new.push(that.fb.group(parmArr));
    });
  }

  createConfigParm(obj) {
    const that = this;
    that.configInfo_new.controls.splice(0);
    that.configInfo_new.setValue([]);
    obj.forEach(element => {
      let parmArr = {
        flag: 0,
        name: [element.name],
        data: [element.data],
        configName: [element.configName],
        configItem: [element.configItem]
      }
      that.configInfo_new.push(that.fb.group(parmArr));
    })
  }

  openArtiSelect(e) {
    this.modal.create(VersionTableComponent, {size: 'md'}).subscribe(res => {
      if (typeof res.data.id !== 'undefined' && typeof res.data.artifactoryId !== 'undefined') {
        this.serviceManageService.getArtiVer(res.data.artifactoryId, res.data.id).subscribe((resdata: any) => {
          if (resdata) {
            this.setFormVal({
              arti: res.name,
              artiVer: res.data.lastVersion,
              imageAddr: resdata.imageAddr,
              imageTag: resdata.imageTag,
              mountPath: resdata.mountPath,
              mountType: resdata.mountType,
              mountLimit: resdata.mountLimit,
              cpuLimit: resdata.cpuLimit,
              memoryLimit: resdata.memoryLimit
            });

            this.createParm(resdata.env);
            let arr_config: any = [];
            for (let i = 0; i < resdata.configInfo.length; i++) {
              let obj = new Object();
              obj['name'] = resdata.configInfo[i].name;
              obj['path'] = resdata.configInfo[i].path;
              obj['data'] = resdata.configInfo[i].data;
              obj['itemName'] = {configName: '', configItemName: ''}
              arr_config.push(obj);
            }
            //this.configInfo = arr_config;
            this.createConfigParm(arr_config);
          }
        });
      }
    });
  }


  checkEnvAndConfigInfo(): boolean {
    return this.checkEnvInfo() || this.checkConfigInfo();
  }

  checkEnvInfo(): boolean {
    let eIndex = -1;
    if (this.envInfo) {
      eIndex = this.envInfo.findIndex(e => {
        if (e.ifConfigMap) {
          return this.checkEnvInfoItem(e);
        }
        return false;
      });
    }
    return eIndex > -1;
  }

  checkEnvInfoItem(e): boolean{
    console.log(this.envInfo_new.controls.length);
    if (!e.name) {
      return true;
    }
    if (e.ifConfigMap) {
      return !e.configName || !e.configItem;
    }
    return false
  }

  checkConfigInfo(): boolean {
    let cIndex = -1;
    if (this.configInfo && this.configInfo.length > 0) {
      cIndex = this.configInfo.findIndex(c => {
        return this.checkConfigInfoItem(c);
      });
    }
    return cIndex > -1;
  }

  checkConfigInfoItem(c): boolean{
    if (!c.name) {
      return true;
    }
    return !c.itemName.configItemName || !c.itemName.configName;
  }

  checkNewItem(c): boolean{
    const data = c.controls;
    if (data.flag.value === '2') {
      return !data.configName.value || !data.configItem.value;
    }
    return false;
  }
  configNameChange_new(value: string, item: any): void {
    item.configName = value;
  }
  checkDirtyValue(value?: string): boolean {
    const b1 = this.checkEnvAndConfigInfo();
    const b2 = this.checkNewInfo();
    const b3 = super.checkDirtyValue(value);
    return b1 || b2 || b3;
  }

  checkNewInfo(): boolean{
    const eArray = this.envInfo_new.controls;
    const cArray = this.configInfo_new.controls;
    eArray.concat(cArray);
    const index = eArray.findIndex(e => this.checkNewItem(e));
    return index >= 0;
  }
}

