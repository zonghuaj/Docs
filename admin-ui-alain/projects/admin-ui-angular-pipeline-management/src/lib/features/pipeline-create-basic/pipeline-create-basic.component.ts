import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PipelineEditEntity } from "../../devops.entities";
import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PipelineDrawerPanelComponent } from './panel-component/pipeline-drawer-panel.component';
import { ModalHelper, DrawerHelper } from "@delon/theme";
import { FormDynamicComponent } from "./form-dynamic-component/form-dynamic.component";
import { DeployEnvComponent } from './deploy-env/deploy-env.component';
import { DeployEnvContainerComponent } from './deploy-env-container/deploy-env-container.component'
import { CacheService } from "@delon/cache";
import { ActivatedRoute, Router } from '@angular/router';
import { Pipeline } from './pipeline-create-entities/pipeline';
import { BaseFormComponent } from 'admin-ui-angular-common';
import { DevopsService } from "../../devops.service";

@Component({
  selector: 'app-pipeline-create-basic',
  providers: [DevopsService],
  templateUrl: './pipeline-create-basic.component.html',
  styleUrls: ['./pipeline-create-basic.component.less']
})
export class PipelineCreateBasicComponent extends BaseFormComponent<PipelineEditEntity> {

  submitLoading = false;
  pipeLineCodeStoreId = ''; //代码仓库ID[流水线]
  pipeLineCodeUrlId = '';  //代码地址URL[流水线]
  pipeLineCodeBranch = ''; //代码分支[流水线]
  pipeLineCodeStores: { url: string, id: number }[] = [];
  pipeLineJenkins: { url: string, id: number }[] = [];
  pipeLineCodeUrls: { ssh_url_to_repo: string, id: number }[] = [];
  pipeLineCodeBranchs: { name: string }[] = [];
  gitLoading = false;
  branchLoading = false;
  isTrigger = false;
  listOfSelectedValue = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  isTriggerdis = false;
  triggerBranch = '';
  allAvailabledata = [];
  isNeedHighLight = false;
  senceCanSee = true;
  ClickstageIndex = '';
  errorArray = [];

  // save data to api
  pipelineSaveData: Pipeline =
    {
      name: '',
      jenkins: '',
      stages: [],
      trigger: {
        type: 'none',
        express: {
        }
      }
    };
  // {
  //   name: '',
  //   jenkins: '',
  //   stages: [
  //     {
  //       title: '源代码',
  //       type: 'CodeSource',
  //       instance: {
  //         defId: 'CodeSource_Git',
  //         name: 'Git源代码',
  //         form: {}
  //       }
  //     },
  //     {
  //       title: '单元测试',
  //       type: 'UnitTest',
  //       instance: {
  //         defId: 'UnitTest_Maven',
  //         name: 'Maven单元测试',
  //         form: {}
  //       }
  //     },
  //     {
  //       title: '构建',
  //       type: 'CodeBuild',
  //       instance: {
  //         defId: 'CodeBuild_Maven',
  //         name: 'Maven构建',
  //         form: {}
  //       }
  //     },
  //     {
  //       title: '创建镜像',
  //       type: 'DockerBuild',
  //       instance: {
  //         defId: 'DockerBuild_File',
  //         name: 'Docker文件',
  //         form: {}
  //       }
  //     },
  //     {
  //       title: '发布',
  //       type: 'Publish',
  //       instance: {
  //         defId: 'Publish_Artifact',
  //         name: '发布到制品',
  //         form: {}
  //       }
  //     }
  //   ],
  //   trigger: {
  //     type: 'none',
  //     express: {
  //       pipeLineCodeStoreId: '44'
  //     }
  //   }
  // };

  defIndex = 1;
  vlvalue = 'Base_Sence';
  sencesConfirm = [];
  showType = 'L';
  tabIndex = 0;
  pipeLineJenkinsId = '';
  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder, private modalHelper: ModalHelper,
              private drawerHelper: DrawerHelper,
              public msg: NzMessageService,
              private cache: CacheService,
              private devopsService: DevopsService,
              private route: ActivatedRoute,
              public router: Router,
              private drawerService: NzDrawerService,
              private modalSrv: NzModalService) {
    super();
    this.tabIndex = this.cache.getNone<number>('pipeline-create-list-tab') || 0;
  }



  ngOnInit() {
    super.ngOnInit();
    this.getPipeLineJenkins();
    this.getPipeLineCodeStore();
    this.getAllAvailableStages();
    this.getTrigger();

    this.getEditInfo();
  }

  nameValidator(control: FormControl): any {
    const result = control.value;
    const valid = /^[a-z][a-z0-9-]{1,20}$/.test(result);
    return valid ? null : { name: '' };
  }

  protected initForm(): FormGroup {
    return this.form = this.fb.group({
      pipeLineName: ['', [Validators.required, this.nameValidator]],  // 名称
      pipeLineRemark: [''],  //描述
      pipeLineTempId: [''],   //流水线模板ID
      pipeLineCodeStoreId: [''],
      pipeLineCodeUrlId: [''],
      pipeLineCodeUrl: [''],
      pipeLineCodeBranch: [''],  //分支
      pipeLineJenkinsId: ['', [Validators.required]],
      artifactoryId: [''],
      pipeLineParms: [''],
      pipeLineParmArr: this.fb.array([]),
      isTrigger: [false],
      listOfSelectedValue: [],
      triggerBranch: [''],

      // pipeLineJenkinsId: ['', [Validators.required]],
      radioValue: ['', false],
      // isTrigger: ['', false]
    });
  }

  //获取代码库
  getPipeLineCodeStore() {
    this.devopsService.getPipeLineCodeStoe(0, 100, 'gitlab').subscribe(res => {
      if (res) {
        //this.pipeLineCodeStores = res.rows;
        this.pipeLineCodeStores = res;
      }
    });
  }
  //获取Jenkins库
  getPipeLineJenkins() {
    this.devopsService.getPipeLineCodeStoe(0, 100, 'jenkins').subscribe(res => {
      if (res) {//  && res.rows && res.rows.length > 0
        this.pipeLineJenkins = res; //res.rows
      }
    });
  }

  //查询所有可用的阶段列表
  getAllAvailableStages() {
    this.devopsService.getPipelineAvailableStages().subscribe(res => {
      this.allAvailabledata = res.rows;
    });
  }
  //节点类型抽屉
  showNodePanel(id?: number): void {
    const drawerRef = this.drawerService.create<PipelineDrawerPanelComponent>({
      nzTitle: '阶段添加',
      nzWidth: '550px',
      nzContent: PipelineDrawerPanelComponent,
      nzContentParams: { id, stagelist: this.allAvailabledata }
    });

    drawerRef.afterClose.subscribe(data => {
      if (data) {
        const formParentNode = {
          title: data.title,
          type: data.type,
          instance: {
            defId: data.id,
            name: data.name,
            index: id,
            form: {
            }
          }
        };
        //this.pipelineSaveData.stages.push(formParentNode);
        const newItem = { name: data.name, id: data.id, type: data.type, title: data.title };
        this.pipelineSaveData.stages.splice(data.index, 0, formParentNode);
        //this.dynamicError();
        this.errorArray = [];
        this.cdr.detectChanges();
      }
    });
  }

  onItemClick(stage) {
    const forminstance = this.findFormInstance(stage);
    this.edit(0, forminstance, stage);
  }

  findFormInstanceData(stage, forminstance) {
    forminstance.forEach(field => {
      if (this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form[field.name] === '' || this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form[field.name] === undefined) {
        if (field.default !== '') {
          this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form[field.name] = field.default;
        }
      }
    });
    return this.pipelineSaveData.stages[stage.stageIndex].instance.form;
  }

  findFormInstance(stage) {
    return this.allAvailabledata.find(t => t.type === stage.type).instances.find(tt => tt.id === stage.instance.defId).formElements;
  }

  edit(idx, forminstance, stage) {

    if (stage.type === 'Publish') {
      if (stage.instance.defId === 'Publish_Env') {
        this.open(idx, forminstance, stage);
        return;
      }
    }

    this.ClickstageIndex = stage.stageIndex;
    const drawerRef = this.drawerService.create<FormDynamicComponent>({
      nzTitle: '阶段配置',
      nzWidth: '550px',
      nzContent: FormDynamicComponent,
      nzContentParams: { stage: this.findFormInstanceData(stage, forminstance), formElements: forminstance, id: stage.id, type: stage.type, name: stage.instance.name }
    });

    this.isNeedHighLight = true;

    drawerRef.afterClose.subscribe(res => {
      this.ClickstageIndex = '';
      if (!res) return;
      const saveFormNode = {
        defId: stage.instance.defId,
        name: res.name,
        //index:idx
        form: res.formOption
      };
      if (this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.defId === stage.instance.defId) {

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form = res.formOption;

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.name = res.name;
      } else {

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance = saveFormNode;
      }
      this.cdr.detectChanges();
    });
  }

  // deploy to env form overlay
  open(idx, forminstance, stage) {

    this.ClickstageIndex = stage.stageIndex;
    const drawerRef = this.drawerService.create<DeployEnvContainerComponent>({ // DeployEnvContainerComponent  DeployEnvComponent
      nzTitle: '环境',
      nzWidth: '800px',
      nzContent: DeployEnvContainerComponent,
      nzContentParams: { stageForm: this.findFormInstanceData(stage, forminstance),
        formElements: forminstance, id: stage.id, type: stage.type, name: stage.instance.name }
    });

    this.isNeedHighLight = true;
    const me = this;
    drawerRef.afterClose.subscribe(res => {
      this.ClickstageIndex = '';
      if (!res) return;
      
       /***special form overlay */
      if (stage.type === 'Publish') {
        if (stage.instance.defId === 'Publish_Env') {
          // form:{runtime,deploySetting,serviceSetting}
          const saveSpecialFormNode = {
            defId: stage.instance.defId,
            name: res.name,
            form: res.formOption
          };
          if (me.pipelineSaveData.stages.find(t => t.type === stage.type).instance.defId === stage.instance.defId) {

            // me.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form = res.formOption;
           // me.pipelineSaveData.stages.find(t => t.type === stage.type).instance.name = res.name;
            me.pipelineSaveData.stages[stage.stageIndex].instance.form = res.formOption;
            me.pipelineSaveData.stages[stage.stageIndex].instance.name = res.name;
            // stage.stageIndex
          } else {
            me.pipelineSaveData.stages[stage.stageIndex].instance = saveSpecialFormNode;
          }

          me.cdr.detectChanges();
          return;
        }
      }

      /***special form overlay */
      const saveFormNode = {
        defId: stage.instance.defId,
        name: res.name,
        //index:idx
        form: res.formOption
      };
      if (this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.defId === stage.instance.defId) {

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.form = res.formOption;

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance.name = res.name;
      } else {

        this.pipelineSaveData.stages.find(t => t.type === stage.type).instance = saveFormNode;
      }
      this.cdr.detectChanges();
    });
  }


  add(i) {
    this.showNodePanel(i + 1);
  }

  remove(index) {
    this.confirmDelete(index);
    // this.cdr.detectChanges();
  }

  onTabChanged(index: number) {
    this.cache.set('pipeline-create-list-tab', index);
  }

  onPipeLineCodeStoeChange(event) {
    this.gitLoading = true;
    this.pipeLineCodeUrls = [];
    this.pipeLineCodeBranchs = [];
    // this.form.get('pipeLineCodeUrlId').setValue(null);
    // this.form.get('pipeLineCodeUrlId').markAsPristine({onlySelf: true});
    // this.form.get('pipeLineCodeBranch').setValue(null);
    // this.form.get('pipeLineCodeBranch').markAsPristine({onlySelf: true});
    this.devopsService.getPipeLineCodeUrl(event).subscribe(res => {
      this.gitLoading = false;
      if (res && res.length > 0) {
        this.pipeLineCodeUrls = [...res];
        // if (this.pipelineId > 0) this.form.get('pipeLineCodeUrlId').setValue(this.hhdpipeLineCodeUrlId);
      }
      this.cdr.detectChanges();
    });
  }

  onPipeLineCodeUrlChange(event) {
    if (event) {
      this.branchLoading = true;
      const codeStoeId = this.pipelineSaveData.trigger.express.pipeLineCodeStoreId;
      const codeUrlId = event;
      this.devopsService.getPipeLineBarnch(codeStoeId, codeUrlId, 'gitlab').subscribe(res => {
        this.branchLoading = false;
        if (res && res.length > 0) {
          this.pipeLineCodeBranchs = [...res];
          //if (this.pipelineId > 0) this.form.get('pipeLineCodeBranch').setValue(this.hhdpipeLineCodeBranch);
        }
        this.cdr.detectChanges();
      });
    }
  }

  onTriggerChange(event) {
    this.isTriggerdis = event;

    if (!event) {
      this.listOfSelectedValue = [''];
      this.pipelineSaveData.trigger.type = 'none';
      this.setValidators('pipeLineCodeUrlId');
      this.setValidators('pipeLineCodeStoreId');
      this.setValidators('listOfSelectedValue');
      this.setValidators('triggerBranch');
    } else {
      this.pipelineSaveData.trigger.type = 'event';
      this.setValidators('pipeLineCodeUrlId', [Validators.required]);
      this.setValidators('pipeLineCodeStoreId', [Validators.required]);
      this.setValidators('listOfSelectedValue', [Validators.required]);
      this.setValidators('triggerBranch', [Validators.required]);
    }
  }

  getTrigger() {
    this.listOfOption = [
      {
        label: 'Push events',
        value: 'push_events'
      },
      {
        label: 'Tag push events',
        value: 'tag_push_events'
      },
      {
        label: 'Merge requests events',
        value: 'merge_requests_events'
      }
    ]
  }

  savePipeLine() {

    if (!this.dynamicError()) return;

    this.submitLoading = true;
    if (!this.isTriggerdis) {
      this.pipelineSaveData.trigger.type = 'none';
    } else {
      this.pipelineSaveData.trigger.type = 'event';
    }

    this.devopsService.postSaveNewPipeLine(this.pipelineSaveData).subscribe(res => {
      //this.pipeLineCodeBranchs = res;
      this.msg.success('添加成功');
      this.submitLoading = false;
      this.router.navigateByUrl('/devops/pipeline/list');
    }, (err) => {
      this.submitLoading = false;
      //this.msg.error(err.message);
      //this.cdr.detectChanges();
    });
  }
  getEditInfo() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.getPipeLineData(params.id); // update mode
        this.senceCanSee = false;
        this.disableField(this.form.controls.pipeLineName);
      } else {
        this.senceCanSee = true;
        this.getPipeLineStageDataThroughSenceId('Base_Sence'); // add mode

      }
    });
  }
  getPipeLineData(id) {
    this.devopsService.getPipeLineData(id).subscribe(res => {
      // integrate
      this.pipelineSaveData = res;

      if (this.pipelineSaveData.trigger.type === 'none') {
        this.isTriggerdis = false;
        this.isTrigger = false;
      } else {
        this.isTriggerdis = true;
        this.isTrigger = true;
      }


    });
  }

  getPipeLineStageDataThroughSenceId(id) {
    this.devopsService.getPipeLineStageDataThroughSenceId(id).subscribe(res => {
      // integrate
      this.pipelineSaveData.stages = res[0].stages;
    });
  }
  saveSubmit() {
    if (this.checkDirty(this.form)) return;
    if (!this.dynamicError) return;
  }

  checkDirty(f: FormGroup) {
    for (const i in f.controls) {
      f.controls[i].markAsDirty();
      f.controls[i].updateValueAndValidity();
    }

    return f.invalid;
  }

  confirmDelete(index) {
    this.modalSrv.confirm({
      nzTitle: '确认',
      nzContent: '你确定要删除这个阶段吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => { this.pipelineSaveData.stages.splice(index, 1); this.errorArray = []; },
      nzCancelText: '取消',
    });
  }

  confirmSelect() {
    this.modalSrv.confirm({
      nzTitle: '确认',
      nzContent: '切换模板会导致编辑内容变动 !',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => { this.getPipeLineStageDataThroughSenceId(this.vlvalue); this.errorArray = []; },
      nzOnCancel: () => this.radioChooseLastAction(),
      nzCancelText: '取消',
    });
  }

  radioChooseLastAction() {
    this.form.get('radioValue').setValue(this.sencesConfirm[this.sencesConfirm.length - 2]);
  }

  radioChange() {
    this.sencesConfirm.push(this.vlvalue); // very important 
    if (this.sencesConfirm.length === 1) return;
    if (this.modalSrv.openModals.length === 0) {// if is open
      this.confirmSelect();
    }
  }

  dynamicError() {
    const errorArray = [];
    // tslint:disable-next-line: variable-name
    this.pipelineSaveData.stages.forEach((field, number) => {
      const formElements = this.allAvailabledata.find(t => t.type === field.type).instances
        .find(tt => tt.id === field.instance.defId).formElements;
      formElements.forEach(formField => {
        if (formField.required === true) {
          if (field.instance.form[formField.name] === undefined || field.instance.form[formField.name] === '') {
            if (!errorArray.includes(number)) {
              errorArray.push(number);
            }
          }
        }
      });
    });

    this.errorArray = errorArray;
    if (errorArray.length === 0) {
      return true;
    } else {
      return false;
    }
  }

}
