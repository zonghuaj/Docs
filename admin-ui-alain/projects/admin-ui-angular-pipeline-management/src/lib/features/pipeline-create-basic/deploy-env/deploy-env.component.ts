import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  OnInit, ViewChild, Output, EventEmitter, Input
} from '@angular/core';
import { DevopsService } from '../../../devops.service';
import { BaseFormComponent } from 'admin-ui-angular-common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, CascaderOption, NzDrawerService } from 'ng-zorro-antd';
import { ArtifactoryEntity } from '../pipeline-create-entities/artifactory.entities';
import { TitleService } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DeployEnvServiceCreateComponent } from '../deploy-env-service-create/deploy-env-service-create.component';

@Component({
  selector: 'deploy-env',
  template: `
  <nz-card [nzTitle]="'服务'" [nzExtra]="" [nzBordered]="false">
    <nz-cascader   [nzLoadData]="loadData" [(ngModel)]="services" style="width:89%;margin-right: 10px;">
    </nz-cascader>
    <button nz-button nzType="primary" type="button" (click)="open()">创建</button>
  </nz-card>
    <deploy-env-table #initTable [title]="'启动变量'"
                                     [data]="getTableDatas('1')"
                                     [formKey]="'initParams'"></deploy-env-table>
    <deploy-env-table #envTable [title]="'环境变量'"
                                     [data]="getTableDatas('2')"
                                     [formKey]="'envParams'"></deploy-env-table>
    <deploy-env-table #confTable [title]="'配置文件'"
                                     [data]="getTableDatas('3')"
                                     [isFileParam]="true"
                                     [formKey]="'configure'"></deploy-env-table>

    <deploy-env-deploy #deploySetting [stageForm] ="stageForm"></deploy-env-deploy> 
    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button nz-button nzType="default" type="default" class="mr-sm" (click)="back()">返回
      </button>
      <button nz-button nzType="primary" type="button" [nzLoading]="submitLoading" (click)="submitF()">提交
      </button>
    </div>
  `,
  providers: [DevopsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeployEnvComponent implements OnInit {
  @ViewChild('initTable') initTable: BaseFormComponent<any>;
  @ViewChild('envTable') envTable: BaseFormComponent<any>;
  @ViewChild('confTable') confTable: BaseFormComponent<any>;
  @ViewChild('deploySetting') deploySetting: BaseFormComponent<any>;

  @Output() dataToContainer = new EventEmitter();

  _stageForm: any;

  @Input() set stageForm(s) {
    this._stageForm = { ...s };
  }

  @Input() name: string; 

  get stageForm() {
    return this._stageForm;
  }

  artifactory: ArtifactoryEntity;

  submitLoading = false;

  fullParams = [];

  tempForm = [];

  services = [];

  dataSourceTypeArray = [];

  constructor(private devopsService: DevopsService,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private nzdrawer: NzDrawerRef,
    private drawerService: NzDrawerService,
    private titleSrv: TitleService) {
    this.loadData = this.loadData.bind(this);
  }

  ngOnInit(): void {
    //this.titleSrv.setTitle('制品详情');

    //const artfId = +this.route.snapshot.parent.paramMap.get('aid');
    // this.devopsService.getArtifactoryDetail(artfId).subscribe(res => {
    //   this.artifactory = res;
    //   this.cdr.detectChanges();
    // });

    this.dataSourceTypeArray = ['env', 'services', 'versions'];

    const me = this;

    setTimeout(() => {
      me.tempForm = me.stageForm;
      if (me.stageForm.hasOwnProperty('serviceSetting')) {
        if (me.stageForm.serviceSetting.hasOwnProperty('env')) {
          me.services = me.stageForm.serviceSetting.env;
        }
      }

    },
      0);
    this.cdr.detectChanges();
  }

  getTableDatas(type) {
    try {
      return this.tempForm['runtime'].filter(p => p.type === type);
      //return this.tempForm;
    } catch (e) {
      return [];
    }

  }

  submitF() {
    const initP = this.initTable.submitForm() as [];
    const envP = this.envTable.submitForm() as [];
    const confP = this.confTable.submitForm() as [];
    const deploySP = this.deploySetting['deployPForm'].submitForm() as [];

    if (!initP || !envP || !confP || !deploySP) {
      return;
    }
    const fullParams = [
      ...this.processParam(initP, '1'),
      ...this.processParam(envP, '2'),
      ...this.processParam(confP, '3')
    ];

    this.fullParams = fullParams;
    this.dataToContainer.emit(fullParams);
    this.submitLoading = true;
    const formBackList = { formOption: { runtime: fullParams, deploysetting: deploySP, serviceSetting: { env: this.services } }, name: this.name };
    this.nzdrawer.close(formBackList);
    this.submitLoading = false;
    // this.artifService.saveArtifRuntimeParams(this.artifactory.id, fullParams).subscribe(res => {
    //   this.submitLoading = false;
    //   this.msg.success('提交成功');
    //   this.cdr.detectChanges();
    // }, err => {
    //   this.submitLoading = false;
    //   this.msg.error('提交失败');
    //   this.cdr.detectChanges();
    // });
    this.cdr.detectChanges();
  }

  processParam(params: any[], type: string) {
    return params.filter(p => !!p.key)
      .map(p => ({ ...p, type, artifactoryId: '' }));
  }

  back() {
    this.nzdrawer.close();
  }

  callServiceAsynchronous(dataSourceType) {  // Observable<any> -->
    if (dataSourceType.hasOwnProperty('children')) {
      this.dataSourceTypeArray.push(dataSourceType.type);
      return this.callServiceAsynchronous(dataSourceType.children);
    } else {
      this.dataSourceTypeArray.push(dataSourceType.type);
    }
  }

  /** load data async execute by `nzLoadData` method */
  loadData(node: CascaderOption, index: number): PromiseLike<void> {
    const me = this;
    return new Promise((resolve, reject) => {
      const type = me.dataSourceTypeArray[index === -1 ? 0 : index];
      let param = '';
      if (index !== -1) {
        param = node.value;
      }
      this.devopsService.getCascaderData(me.dataSourceTypeArray[index === -1 ? 0 : index + 1], param).subscribe(res => {
        console.log(node);
        if (res.rows.length !== 0) {
          node.children = res.rows;
        } else {
          node.isLeaf = true;
        }
        resolve();
      });
    });
  }

  // deploy to env form overlay
  open() {
    const drawerRef = this.drawerService.create<DeployEnvServiceCreateComponent>({ //DeployEnvServiceCreateComponent DeployEnvContainerComponent  DeployEnvComponent
      nzTitle: '创建服务',
      nzWidth: '550px',
      nzContent: DeployEnvServiceCreateComponent,
      nzContentParams: {}
    });


    drawerRef.afterClose.subscribe(res => {
      this.cdr.detectChanges();
    });
  }

}
