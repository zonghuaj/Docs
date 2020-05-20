import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, } from '@angular/core';
import {ArtifactoryEntity, ArtifactoryVersion, StageFlow, StageFlowItem} from "../artifactory.entities";
import { ModalHelper, TitleService } from '@delon/theme';
import { Location } from '@angular/common';
import { ArtifactoryService } from '../artifactory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService, NzDrawerService } from 'ng-zorro-antd';
import { mergeMap, tap } from 'rxjs/operators';
import { ArtifactoryStageFlowDrawerPanelComponent } from './rightpanel-component/artifactory-stage-flow-drawer-panel.component';
import { FlowFormDynamicComponent } from './flow-form-dynamic-component/flow-form-dynamic.component'; 
import { ArtifactoryStageApproveComponent } from '../artifactory-stage-flow/artifactory-stage-approve.component';

@Component({
  selector: 'artifactory-stage-list',
  template: `
    <cds-breadcrumb></cds-breadcrumb>
    <nz-card [nzTitle]="title" [nzExtra]="">

      <ng-template #extraTemplate *ngIf=false >
          <nz-radio-group [(ngModel)]="vlvalue" (ngModelChange)="radioChange()">
              <label nz-radio nzValue="Base_Sence">开发</label>
              <label nz-radio nzValue="Micropaas_Sence">测试</label>
              <label nz-radio nzValue="Npm_Sence">生产</label>
          </nz-radio-group>
      </ng-template>

      <div class="stage-list" *ngFor="let item of ArtifactoryFlowSaveData.stages; let i = index">
        <artifactory-stage-item [stage]="item" [stageIndex]="i" [parent]="ArtifactoryFlowSaveData.stages"
                                (itemClick$)="onItemClick($event)"
                                (addAt$)="add($event)"
                                (removeAt$)="remove($event)"
                                [errorArray] ="errorArray"
                                [isNeedHighLight]="false"
                                [stageIndex]="i"
                                [ClickstageIndex]="ClickstageIndex"
                                [editable]="editMode"></artifactory-stage-item>
        <span *ngIf="i < ArtifactoryFlowSaveData.stages.length - 1" class="arrow"></span>
      </div>

      <div *ngIf="artfVersion && stageList" class="prompt">
        <!--span class="current-version">当前制品：<strong>{{artifactory.name}}</strong></span>
        <br/>
        <span class="current-version">当前版本：<strong>{{artfVersion.lastVersion}}</strong></span>
        <br/>
        <span class="version-desc" *ngIf="editMode"><em>注意：修改审批流程会导致重置所有历史状态。</em></span-->
      </div>

      <nz-divider *ngIf="editMode" nzType="horizontal"></nz-divider>

      <div *ngIf="editMode && ArtifactoryFlowSaveData.stages" nz-row nzType="flex" nzJustify="center" class="mt-lg">
        <button nz-button nzType="default" type="default" class="mr-sm" (click)="back()">返回
        </button>
        <button nz-button nzType="primary" type="submit" [nzLoading]="submitLoading"
                (click)="submit()">提交
        </button>
      </div>
    </nz-card>
  `,
  styleUrls: ['./artifactory-stage-list.component.less'],
  providers: [ArtifactoryService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtifactoryStageListComponent implements OnInit {
  title = '';
  submitLoading = false;

  defIndex = 1;

  vid: number;
  artifactory: ArtifactoryEntity;
  artfVersion: ArtifactoryVersion;
  stageList: StageFlowItem[];
  errorArray = [];
  vlvalue = 'Base_Sence';
  sencesConfirm = [];
  ClickstageIndex = '';
  isNeedHighLight = false;

  ArtifactoryFlowSaveData =
  {
        name: '',
        jenkins: '',
        stages: []
  };
  // save data to api
  // ArtifactoryFlowSaveData =
  //   {
  //     name: '',
  //     jenkins: '',
  //     stages: [{
  //       'form': {
  //         'approveType': 'deployed'
  //       },
  //       'name': '审批',
  //       'defId': 'approve'
  //     },
  //     {
  //       'form': {},
  //       'name': '部署制品',
  //       'defId': 'deployedArtifact'
  //     },
  //     {
  //       'form': {},
  //       'name': '自动化测试',
  //       'defId': 'autoTest'
  //     },
  //     {
  //       'form': {
  //         'approveType': 'confirm'
  //       },
  //       'name': '审批',
  //       'defId': 'approve'
  //     }],
  // };
    allAvailabledata = [];
    // allAvailabledata = [
    //   {
    //     'id': 'approve',
    //     'name': '审批',
    //     'formElements': [
    //       {
    //         'index': 0,
    //         'name': 'approveType',
    //         'label': '审批类型',
    //         'type': 'select',
    //         'required': true,
    //         'placeholder': '请选择',
    //         'default': '',
    //         'dataSourceType': {},
    //         'dataOptions': [
    //           {
    //             'label': '部署审批',
    //             'value': 'deployed'
    //           },
    //           {
    //             'label': '验证审批',
    //             'value': 'confirm'
    //           }
    //         ]
    //       },
    //       {
    //         'index': 1,
    //         'name': 'approver',
    //         'label': '审批人',
    //         'type': 'cascaderSync',
    //         'required': true,
    //         'placeholder': '请选择',
    //         'default': '',
    //         'dataSourceType': {
    //           'type': 'Approver'
    //         },
    //         'dataOptions': []
    //       }
    //     ]
    //   },
    //   {
    //     'id': 'deployedArtifact',
    //     'name': '部署制品',
    //     'formElements': [
    //       {
    //         'index': 0,
    //         'name': 'deployedArtifact',
    //         'label': '部署制品版本',
    //         'type': 'input',
    //         'required': true,
    //         'placeholder': '请输入部署地址',
    //         'default': '',
    //         'dataSourceType': {},
    //         'dataOptions': []
    //       }
    //     ]
    //   },
    //   {
    //     'id': 'autoTest',
    //     'name': '自动化测试',
    //     'formElements': [
    //       {
    //         'index': 0,
    //         'name': 'autoTestJob',
    //         'label': '测试任务',
    //         'type': 'cascaderSync',
    //         'required': true,
    //         'placeholder': '请选择',
    //         'default': '',
    //         'dataSourceType': {
    //           'type': 'Autotest'
    //         },
    //         'dataOptions': []
    //       }
    //     ]
    //   },
    //   {
    //     'id': 'pipeline',
    //     'name': '流水线',
    //     'formElements': [
    //       {
    //         'index': 0,
    //         'name': 'pipeline',
    //         'label': '流水线',
    //         'type': 'cascaderSync',
    //         'required': true,
    //         'placeholder': '请选择',
    //         'default': '',
    //         'dataSourceType': {
    //           'type': 'Pipeline'
    //         },
    //         'dataOptions': []
    //       }
    //     ]
    //   }
    // ];

  editMode;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private location: Location,
              private modal: NzModalService,
              private modalHelper: ModalHelper,
              private artfService: ArtifactoryService,
              private titleSrv: TitleService,
              private drawerService: NzDrawerService,
              private modalSrv: NzModalService,
              private msg: NzMessageService) {}

  ngOnInit(): void {
    this.editMode = this.router.url.indexOf('flow-edit') > 0;
    this.title = this.editMode ? '编辑流程' : '审批流程';
    this.titleSrv.setTitle(this.title);

    this.vid = +this.route.snapshot.paramMap.get('vid');
    this.getData();

    this.getAllAvailableStages();
  }

  getData() {
    this.artfService.getArtVersionDetail(this.vid)
      .pipe(
        tap(res => this.artfVersion = res),
        mergeMap((res: ArtifactoryVersion) => this.artfService.getArtifactoryDetail(res.artifactoryId)))
      .subscribe((res: ArtifactoryEntity) => {
        this.artifactory = res;
        this.cdr.detectChanges();
      });

    if (this.editMode) {
      this.getVersionEditStage(this.vid);
    } else {
      this.getVersionFlow(this.vid);
    }
  }

  getVersionEditStage(vid) {
    this.artfService.getWorkFlow(vid).subscribe((res: StageFlow) => {
      if (res && res.stages.length > 0) {
        //this.stageList = res.stages;
        this.ArtifactoryFlowSaveData.stages = res.stages;
        this.showEditWillResetPrompt();
      } else {
        this.stageList = [];
        this.getArtifactoryFlowDataThroughSenceId('defaultScenes');
        //this.add(0);
      }

      this.cdr.detectChanges();
    });
  }

  getVersionFlow(vid) {
    this.artfService.getWorkFlowInstance(vid).subscribe((res: StageFlow) => {
      //this.stageList = res.stages;
      this.ArtifactoryFlowSaveData.stages = res.stages;
      this.cdr.detectChanges();
    });
  }

  // see feature mp-200
  showEditWillResetPrompt() {
    this.modal.info({
      nzTitle: '温馨提示',
      nzContent: '<p>修改审批流程会导致重置所有历史状态，请注意检查之前流程的运行和保存。</p>',
      nzOnOk: () => {
      }
    });
  }

  add(i) {
    // const newItem = {name: `STAGE${this.defIndex++}`} as StageFlowItem;
    // this.stageList.splice(i, 0, newItem);
    // this.cdr.detectChanges();
    this.showRightNodePanel(i);
  }

  remove(i) {
    this.confirmDelete(i);
    // this.stageList.splice(i, 1);
    this.cdr.detectChanges();
  }

  back() {
    this.location.back();
  }

  submit() {
    let errIdx = -1;

    // for (let i = 0; i < this.stageList.length; i++) {
    //   if (!this.artfService.checkStageAvailable(this.stageList[i])) {
    //     errIdx = i;
    //     break;
    //   }
    // }

    // if (errIdx >= 0) {
    //   this.modal.error({
    //     nzTitle: '参数错误',
    //     nzContent: `请检查 [${this.stageList[errIdx].name}] 中的参数`
    //   });
    //   return;
    // }

    this.submitLoading = true;
    this.artfService.editArtVersionFlows(this.vid, this.ArtifactoryFlowSaveData.stages) // this.stageList
      .subscribe(res => {
        this.submitLoading = false;
        this.msg.success('保存成功');
        this.location.back();
      }, err => {
        this.submitLoading = false;
        this.msg.success('保存失败');
      });
  }

  // onItemClick(idx) {
  //   if (this.editMode) {
  //     this.edit(idx);
  //   } else {
  //     this.audit(idx);
  //   }
  // }

  //edit(idx) {
  //   this.modalHelper.create(ArtifactoryStageEditComponent,
  //     { stage: this.stageList[idx] },
  //     {
  //       size: 'md',
  //       modalOptions: {
  //         nzTitle: '流程编辑',
  //       }
  //     }).subscribe(res => {
  //       if (!res) return;

  //       this.stageList[idx] = res;
  //       this.cdr.detectChanges();
  //     });
  // }

  audit(idx) {
    const stage = this.ArtifactoryFlowSaveData.stages[idx];
    // do nothing when stage is pending
    if (stage.stageStatus === 'PENDING' || stage.stageStatus === 'APPROVED' || stage.stageStatus === 'RUNNING') return;

    this.modalHelper.create(ArtifactoryStageApproveComponent,
      { vid: this.vid, stage },
      {
        size: 'md',
        modalOptions: {
          nzTitle: '流程审批',
        }
      }).subscribe(res => {
        if (res) {
          this.getData();
        }
      });
  }

  showRightNodePanel(id?: number): void {


    const drawerRef = this.drawerService.create<ArtifactoryStageFlowDrawerPanelComponent>({
      nzTitle: '流程添加',
      nzWidth: '350px',
      nzContent: ArtifactoryStageFlowDrawerPanelComponent,
      nzContentParams: { id, stagelist: this.allAvailabledata }
    });

    drawerRef.afterClose.subscribe(data => {
      if (data) {
        const formParentNode = {
          defId: data.id,
          name: data.name,
          index: id,
          form: {
          }
        };

        const newItem = { name: data.name, id: data.id, type: data.type, title: data.title };
        this.ArtifactoryFlowSaveData.stages.splice(data.index, 0, formParentNode);

        this.errorArray = [];
        this.cdr.detectChanges();
      }
    });
  }

  //查询所有可用的编辑流程
  getAllAvailableStages() {
    this.artfService.getArtifactoryFlowAvailableStages().subscribe(res => {
      this.allAvailabledata = res;
    });
  }

  savePipeLine() {

    //if (!this.dynamicError())return;

    this.submitLoading = true;

    this.artfService.postSaveNewArtifactoryFlow(this.ArtifactoryFlowSaveData).subscribe(res => {
      //this.pipeLineCodeBranchs = res;
      this.msg.success('添加成功');
      this.submitLoading = false;
      this.router.navigateByUrl('/devops/pipeline/list');
    }, (err) => {
      this.submitLoading = false;
      //this.msg.error(err.message);
    });
  }

  getEditInfo() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.getPipeLineData(params.id); // update mode
        //this.senceCanSee = false;
      } else {
        //this.senceCanSee = true;
        this.getArtifactoryFlowDataThroughSenceId('Base_Sence'); // add mode

      }
    });
  }

  getPipeLineData(id) {
    this.artfService.getArtifactoryFlowDataById(id).subscribe(res => {
      // integrate
      this.ArtifactoryFlowSaveData = res;

    });
  }

  getArtifactoryFlowDataThroughSenceId(id) {
    this.artfService.getArtifactoryFlowDataThroughSenceId(id).subscribe(res => {
      // integrate
      this.ArtifactoryFlowSaveData.stages = res;
      this.cdr.detectChanges();
    });
  }

  confirmDelete(index) {
    this.modalSrv.confirm({
      nzTitle: '确认',
      nzContent: '你确定要删除这个阶段吗？',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {this.deleteFunc(index); },
      nzCancelText: '取消',
    });
  }

  deleteFunc(index) {
    this.ArtifactoryFlowSaveData.stages.splice(index, 1);
    this.errorArray = [];
    this.cdr.detectChanges();
  }
  confirmSelect() {
    this.modalSrv.confirm({
      nzTitle: '确认',
      nzContent: '切换模板会导致编辑内容变动 !',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => { this.getArtifactoryFlowDataThroughSenceId(this.vlvalue); this.errorArray = []; },
      nzOnCancel: () => this.radioChooseLastAction(),
      nzCancelText: '取消',
    });
  }

  radioChooseLastAction() {
    this.vlvalue =  this.sencesConfirm[this.sencesConfirm.length - 2];
  }

  radioChange() {
    this.sencesConfirm.push(this.vlvalue); // very important
    if (this.sencesConfirm.length === 1) return;
    if (this.modalSrv.openModals.length === 0) {// if is open
      this.confirmSelect();
    }
  }

  onItemClick(stage) {
    const forminstance = this.findFormInstance(stage);
    if (this.editMode) {
      this.edit(0, forminstance, stage);
    } else {
      this.audit(stage.stageIndex);
    }
    
  }

  findFormInstanceData(stage) {
    return this.ArtifactoryFlowSaveData.stages[stage.stageIndex].form;
  }

  findFormInstance(stage) {
    return this.allAvailabledata.find(t => t.id === stage.defId).formElements;
  }

  edit(idx, forminstance, stage) {

    this.ClickstageIndex = stage.stageIndex;
    const drawerRef = this.drawerService.create<FlowFormDynamicComponent>({
      nzTitle: '阶段配置',
      nzWidth: '550px',
      nzContent: FlowFormDynamicComponent,
      nzContentParams: {  stage: this.findFormInstanceData(stage),
                          formElements: forminstance, id: stage.id,
                          type: '', name: stage.name
                        }
    });

    this.isNeedHighLight = true;

    drawerRef.afterClose.subscribe(res => {
      this.ClickstageIndex = '';
      if (!res) return;
      const saveFormNode = {
        defId: stage.defId,
        name: res.name,
        form: res.formOption
      };
      this.ArtifactoryFlowSaveData.stages[stage.stageIndex] = saveFormNode;
      this.cdr.detectChanges();
    });
  }

}
