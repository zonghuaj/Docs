import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {BaseFormComponent} from "admin-ui-angular-common";
import {MpHeaderService} from "admin-ui-angular-common";
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from "@angular/forms";
import {PipelineEditEntity} from "../../devops.entities";
import {DevopsService} from "../../devops.service";
import {ActivatedRoute} from "@angular/router";
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'pipeline-edit',
  templateUrl: `./edit.component.html`,
  providers: [DevopsService],
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineEditComponent extends BaseFormComponent<PipelineEditEntity> {

  pipelineId = 0;
  //pipelineName = '';
  pipeLineRemark = '';
  pipeLineTempId: [];
  pipeLineTemps: { name: string, id: number };
  pipeLineParms = [];
  pipeLineCodeStoes: { url: string, id: number }[] = [];
  pipeLineJenkins: { url: string, id: number }[] = [];
  pipeLineCodeUrls: { ssh_url_to_repo: string, id: number }[] = [];
  pipeLineCodeUrlId = '';
  pipeLineCodeBranchs: { name: string }[] = [];
  pipeLineJenkinsBranchs: { name: string }[] = [];
  pipeLineCodeBranch = '';
  pipeLineJenkinsId = '';
  artifactoryId = '';
  showArtifactory = 0;
  pipeLineServices: { serviceName: string, id: number }[] = [];
  pipeLineServiceRes: [] = [];
  pipeLineServiceId: '';
  pipeLineServiceVerId: '';
  pipeLineServiceVers: [] = [];
  pipeLineArtifactorys: { name: string, id: number } [] = [];
  pipeLineArtifactorysRes: [] = [];
  pipeLineArtifactoryId = '';
  pipeLineArtifactoryVers: { lastVersion: string, id: number } [] = [];
  pipeLineArtifactoryVerId = '';
  isTrigger = false;
  listOfSelectedValue = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  isTriggerdis = false;
  gitLoading = false;
  branchLoading = false;
  hhdpipeLineName = 0;
  hhdpipeLineRemark = 0;
  hhdpipeLineTempId = 0;
  hhdpipeLineCodeStoeId = 0;
  hhdpipeLineCodeUrlId = 0;
  hhdpipeLineCodeUrl = 0;
  hhdpipeLineCodeBranch = 0;
  hhdpipeLineJenkinsId = 0;
  hhdserviceVersion = 0;
  hhdgetServiceName = 0;

  constructor(private headerService: MpHeaderService,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private devopsService: DevopsService,
              private route: ActivatedRoute,
              public msg: NzMessageService,
              public router: Router,
  ) {
    super();
  }

  ngOnInit(): void {

    super.ngOnInit();
    this.getPipeLineTemps();
    this.getPipeLineCodeStoe();
    this.getPipeLineJenkins();
    this.getPipeLineService();
    this.getPipeLineArtifactory();
    this.getTrigger();
    this.headerService.setTitle('项目列表');
  }

  //获取流水线模板
  getPipeLineTemps() {
    const that = this;
    this.devopsService.getPipeLineTemps().subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        this.pipeLineTemps = res.rows;
        //this.getPipeLineInfo(this.pipelineId);
      }
    });
  }

  //获取代码库
  getPipeLineCodeStoe() {
    this.devopsService.getPipeLineCodeStoe(0, 100, 'gitlab').subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        this.pipeLineCodeStoes = res.rows;
      }
    });
  }

  //获取Jenkins库
  getPipeLineJenkins() {
    this.devopsService.getPipeLineCodeStoe(0, 100, 'jenkins').subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        this.pipeLineJenkins = res.rows;
      }
    })
  }

  //获取部署服务信息
  getPipeLineService() {
    this.devopsService.getPipeLineService().subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        this.pipeLineServices = res.rows;
        this.pipeLineServiceRes = res.rows;
      }
    });
  }

  //获取制品库信息
  getPipeLineArtifactory() {
    this.devopsService.getPipeLineArti(0, 100).subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        this.pipeLineArtifactorys = res.rows;
        this.pipeLineArtifactorysRes = res.rows;
        // console.info('!!!!!!' + res.rows.length)
      }
    }, () => {
    }, () => {
      this.route.queryParams.subscribe(params => {
        if (params && params.id) {
          this.getPipeLineInfo(params.id);
          this.pipelineId = params.id;
        }
      })
    });
  }

  getPipeLineInfo(id) {
    // console.log("/../////...getPipeLineInfo...:", id);
    this.devopsService.getPipeLineInfo(id).subscribe(res => {
      if (res) {
        this.form.get('pipeLineName').setValue(res.name); //名称
        this.form.get('pipeLineRemark').setValue(res.desc);     // 描述
        this.form.get('pipeLineTempId').setValue(res.pipelineTemplateId);   //流水线模板
        this.form.get('pipeLineCodeStoeId').setValue(res.gitlabId);  //代码仓库
        this.form.get('pipeLineCodeUrlId').setValue(res.gitlabProjectId); //代码地址ID

        this.form.get('pipeLineCodeUrl').setValue(res.gitlabProjectUrl);   //代码地址URL
        this.form.get('pipeLineCodeBranch').setValue(res.gitlabProjectBranch);   //分支

        this.form.get('pipeLineJenkinsId').setValue(res.jenkins.id);    //jenkinsId
        this.hhdpipeLineName = res.name;
        this.hhdpipeLineRemark = res.desc;
        this.hhdpipeLineTempId = res.pipelineTemplateId;
        this.hhdpipeLineCodeStoeId = res.gitlabId;
        this.hhdpipeLineCodeUrlId = res.gitlabProjectId;
        this.hhdpipeLineCodeUrl = res.gitlabProjectUrl;
        this.hhdpipeLineCodeBranch = res.gitlabProjectBranch;
        this.hhdpipeLineJenkinsId = res.jenkins.id;

        if (res.params && res.params.length > 0) this.createParm(res.params);   //流水行参数

        if (res.isDeploy) {
          this.form.get('artifactoryId').setValue(res.deployDetail.type);
          if (res.deployDetail.type == 1) {
            this.onPipeLineServiceChange(res.deployDetail.serviceId)
            this.form.get('pipeLineServiceId').setValue(res.deployDetail.serviceId);
            this.form.get('pipeLineServiceVerId').setValue(res.deployDetail.serviceVersion);
            this.hhdserviceVersion = res.deployDetail.serviceVersion;

          } else if (res.deployDetail.type == 2) {
            this.onPipeLineArtifactoryChange(res.deployDetail.artifactoryId);
            this.form.get('pipeLineArtifactoryId').setValue(res.deployDetail.artifactoryId);
            this.form.get('pipeLineArtifactoryVerId').setValue(res.deployDetail.artifactoryVersion);
          }
        }  //服务制品
        this.form.get('isTrigger').setValue(res.isAutoTrigger);
        if (res.isAutoTrigger) {
          this.isTriggerdis = true;
          this.form.get('triggerBranch').setValue(res.triggerBranch);
          this.listOfSelectedValue = res.autoTriggerEvent.split(',');
        }

        this.disableField(this.form.get('pipeLineName'),
          this.form.get('pipeLineRemark'),
          this.form.get('pipeLineTempId'),
          this.form.get('pipeLineCodeStoeId'),
          this.form.get('pipeLineCodeUrlId'),
          this.form.get('pipeLineCodeBranch'),
          this.form.get('pipeLineJenkinsId')
        );

      }
      // this.cdr.detectChanges();
    })
  }

  deleteAll(formArray: FormArray) {
    formArray.controls.splice(0);
    formArray.setValue([]);
  }

  onPipeLineTempChange(event) {
    const tempId = event;
    const that = this;
    this.devopsService.getPipeLineTempsparms(tempId).subscribe(res => {
      //  this.pipeLineParms = res.params;
      if (this.pipelineId <= 0) {
        // console.log("pipeLineParms:", res.params);
        that.createParm(res.params);
      }

    });
  }

  onPipeLineCodeStoeChange(event) {
    // console.log("onPipeLineCodeStoeChange:", event);
    this.gitLoading = true;
    this.pipeLineCodeUrls = [];
    this.pipeLineCodeBranchs = [];
    this.form.get('pipeLineCodeUrlId').setValue(null);
    this.form.get('pipeLineCodeUrlId').markAsPristine({onlySelf: true});
    this.form.get('pipeLineCodeBranch').setValue(null);
    this.form.get('pipeLineCodeBranch').markAsPristine({onlySelf: true});
    this.devopsService.getPipeLineCodeUrl(event).subscribe(res => {
      this.gitLoading = false;
      if (res && res.length > 0) {
        this.pipeLineCodeUrls = [...res];
        if (this.pipelineId > 0) this.form.get('pipeLineCodeUrlId').setValue(this.hhdpipeLineCodeUrlId);
      }
      this.cdr.detectChanges();
    });
  }

  onPipeLineCodeUrlChange(event) {
    if (event) {
      this.branchLoading = true;
      const codeStoeId = this.getFormValue('pipeLineCodeStoeId');
      const codeUrlId = event;
      this.devopsService.getPipeLineBarnch(codeStoeId, codeUrlId, 'gitlab').subscribe(res => {
        this.branchLoading = false;
        if (res && res.length > 0) {
          this.pipeLineCodeBranchs = [...res];
          if (this.pipelineId > 0) this.form.get('pipeLineCodeBranch').setValue(this.hhdpipeLineCodeBranch);
        }
        this.cdr.detectChanges();
      });
    }
  }

  onPipeLineJenkinsChange(event) {
    // const codeStoeId = this.getFormValue('pipeLineJenkinsId');
    // const codeUrlId = event;
    // this.devopsService.getPipeLineBarnch(codeStoeId, codeUrlId, 'jenkins').subscribe( res => {
    //   if ( res && res.length > 0) this.pipeLineJenkinsBranchs = res;
    // });
  }

  onPipeLineServiceChange(event) {
    const serviceId = event;
    const that = this;
    this.pipeLineServiceRes.forEach(element => {
      if (serviceId === element['id']) {
        if (element['versions']) {
          that.pipeLineServiceVers = element['versions'];
          // if(this.pipelineId > 0) this.form.get('pipeLineServiceVerId').setValue(this.hhdserviceVersion);
        }
      }
    });

  }

  onArtifactoryChange(event) {
    // console.log("onArtifactoryChange:", event)
    this.showArtifactory = event;

    if (event === '1') {
      this.setValidators('pipeLineServiceId', [Validators.required]);
      this.setValidators('pipeLineServiceVerId', [Validators.required]);
    } else {
      this.setValidators('pipeLineServiceId', []);
      this.setValidators('pipeLineServiceVerId', []);
    }

  }

  onPipeLineArtifactoryChange(event) {
    // console.log("pipeLineServiceRespipeLineServiceRes:", this.pipeLineArtifactorys)
    const artId = event;
    // console.log("event:", event);
    // console.info('@@@@@@' + this.pipeLineArtifactorys.length)
    const that = this;
    for (const element of this.pipeLineArtifactorys) {
      if (artId === element['id']) {
        if (element['versions']) {
          // console.log("version:", element['versions'])

          that.pipeLineArtifactoryVers = element['versions'];
        }
      }
    }
    // this.pipeLineArtifactorys.forEach(element => {
    //   if (artId === element['id']) {
    //     if (element['versions']) {
    //       console.log("version:", element['versions'])
    //
    //       that.pipeLineArtifactoryVers = element['versions'];
    //     }
    //   }
    // });
  }

  onTriggerChange(event) {
    this.isTriggerdis = event;
    if (!event) {
      this.listOfSelectedValue = ['']
    }
  }

  nameValidator(control: FormControl): any {
    const result = control.value;
    const valid = /^[a-z][a-z0-9-]{1,20}$/.test(result);
    return valid ? null : {name: ''};
  }

  onSutmit() {
    // console.log("onSubmit...", this.form.value.artifactoryId)
    // console.log("-----:", this.form.value);
    let _listOfSelectedValue = '';
    if (this.form.value.isTrigger) _listOfSelectedValue = this.form.value.listOfSelectedValue.join(',');
    let _isDeloy = false;
    let _deployDetail = {}
    if (this.form.value.artifactoryId == 1) {
      _isDeloy = true;
      _deployDetail["type"] = 1;
      _deployDetail["serviceId"] = this.form.value.pipeLineServiceId;
      _deployDetail["serviceName"] = this.getServiceName(this.form.value.pipeLineServiceId);
      _deployDetail["serviceVersion"] = this.form.value.pipeLineServiceVerId;
    } else if (this.form.value.artifactoryId == 2) {
      _isDeloy = true;
      _deployDetail["type"] = 2;
      _deployDetail["artifactoryId"] = this.form.value.pipeLineArtifactoryId;
      _deployDetail["artifactoryName"] = this.getServiceVerName(this.form.value.pipeLineArtifactoryId);
      _deployDetail["artifactoryVersion"] = this.form.value.pipeLineArtifactoryVerId;
    }
    let obj = {}
    if (this.pipelineId > 0) {
      let obj = {
        name: this.hhdpipeLineName,  //名称
        desc: this.hhdpipeLineRemark,   //描述
        pipelineTemplateId: this.hhdpipeLineTempId,   //流水线模板ID
        gitlabId: this.hhdpipeLineCodeStoeId,   //代码仓库ID
        gitlabProjectId: this.hhdpipeLineCodeUrlId,     //代码地址的ID
        gitlabProjectUrl: this.hhdpipeLineCodeUrl,     //代码地址URL
        gitlabProjectBranch: this.hhdpipeLineCodeBranch,   //代码分支name
        isAutoTrigger: this.form.value.isTrigger,     //是否自动触发
        autoTriggerEvent: _listOfSelectedValue,             //触发事件参数
        jenkins: this.hhdpipeLineJenkinsId,                    //jenkins
        triggerBranch: this.form.value.triggerBranch,           //分支
        params: this.form.value.pipeLineParmArr,                   //流水线参数
        isDeploy: _isDeloy,
        deployDetail: _deployDetail,

      }
      // console.log("update_obj:", obj);
      this.devopsService.putPipeLine(obj, this.pipelineId).subscribe(res => {
        // console.log("update..res:", res);
        this.msg.success('更新成功');
        this.router.navigateByUrl('/devops/pipeline/list');
      })
    } else {
      obj = {
        name: this.form.value.pipeLineName,  //名称
        desc: this.form.value.pipeLineRemark,   //描述
        pipelineTemplateId: this.form.value.pipeLineTempId,   //流水线模板ID
        gitlabId: this.form.value.pipeLineCodeStoeId,   //代码仓库ID
        gitlabProjectId: this.form.value.pipeLineCodeUrlId,     //代码地址的ID
        gitlabProjectUrl: this.getGitLabUrl(this.form.value.pipeLineCodeUrlId),     //代码地址URL
        gitlabProjectBranch: this.form.value.pipeLineCodeBranch,   //代码分支name
        isAutoTrigger: this.form.value.isTrigger,     //是否自动触发
        autoTriggerEvent: _listOfSelectedValue,             //触发事件参数
        jenkins: this.form.value.pipeLineJenkinsId,                    //jenkins
        triggerBranch: this.form.value.triggerBranch,           //分支
        params: this.form.value.pipeLineParmArr,                   //流水线参数
        isDeploy: _isDeloy,
        deployDetail: _deployDetail,

      }
      // console.log("add_obj:", obj);

      this.devopsService.postPipeLine(obj).subscribe(res => {
        this.pipeLineCodeBranchs = res;
        this.msg.success('添加成功');
        this.router.navigateByUrl('/devops/pipeline/list');
      }, (err) => {
        this.msg.error(err.message);
        this.cdr.detectChanges();
      });
    }
  }

  protected initForm(): FormGroup {
    return this.form = this.fb.group({
      pipeLineName: ['', [Validators.required, this.nameValidator]],  //名称
      pipeLineRemark: [''],  //描述
      pipeLineTempId: [''],   //流水线模板ID
      pipeLineCodeStoeId: ['', [Validators.required]],
      pipeLineCodeUrlId: ['', [Validators.required]],
      pipeLineCodeUrl: ['',],
      pipeLineCodeBranch: ['', [Validators.required]],  //分支
      pipeLineJenkinsId: ['', [Validators.required]],
      artifactoryId: [''],
      pipeLineParms: [''],
      pipeLineParmArr: this.fb.array([]),
      pipeLineServiceId: ['',],
      pipeLineServiceVerId: ['',],
      pipeLineArtifactoryId: [''],
      pipeLineArtifactoryVerId: [''],
      isTrigger: [false],
      listOfSelectedValue: [],
      triggerBranch: ['']
    });
  }

  serviceValidate() {
    if (this.showArtifactory == 1) {

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

  getGitLabUrl(codeUrlId) {
    // console.log("codeUrl:", codeUrlId)
    let url = "";
    for (let e of this.pipeLineCodeUrls) {
      // console.log("fruit：", e);
      if (e.id == codeUrlId) {
        url = e.ssh_url_to_repo;
        break;
      }
    }
    return url;
  }

  getServiceName(serviceId) {
    // console.log("serviceID:", serviceId);
    let name = "";
    for (let e of this.pipeLineServices) {
      // console.log('pipeLineServices:', e);
      if (e.id == serviceId) {
        name = e.serviceName;
        break;
      }
    }
    return name;
  }

  getServiceVerName(artifactoryId) {
    // console.log("ArtifactoryId:", artifactoryId);
    let name = "";
    for (let v of this.pipeLineArtifactorys) {
      // console.log("pipeLineArtifactorys:", this.pipeLineArtifactorys);
      if (v.id == artifactoryId) {
        name = v.name;
        break;
      }
    }
    return name;
  }

  createParm(obj) {
    // console.log("createParm_obj:", obj);
    const that = this;
    that.pipeLineParmArr.controls.splice(0);
    // that.pipeLineParmArr.setValue([]);
    obj.forEach(element => {
      let parmArr = {
        id: [element.id],
        key: [element.key],
        defValue: [element.defValue],
        label: [element.label]
      }

      that.pipeLineParmArr.push(that.fb.group(parmArr));

    });
  }

  get pipeLineParmArr() {
    // console.log("pipeLineParmarrr.")
    return this.form.controls.pipeLineParmArr as FormArray;
  }


}
