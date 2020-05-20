import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {MpHeaderService} from "admin-ui-angular-common";
import {BaseFormComponent} from "admin-ui-angular-common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectEntity} from "../project.entities";
import {ProjectManageService} from "../project-manage.service";
import {DESC_K8S_PLACEHOLDER, k8sNameFormValidor} from "admin-ui-angular-common";

@Component({
  selector: 'project-form',
  templateUrl: `./project-form.component.html`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectFormComponent extends BaseFormComponent<ProjectEntity> {
  readonly namePlaceHolder = DESC_K8S_PLACEHOLDER;

  resourceLimit: any = {currentCpu: 0, currentMemory: 0, maxCpu: 0, maxMemory: 0}
  cpuError = '';
  memoryError = '';
  cpuAvailed = 0;
  memoryAvailed = 0;
  csCpu = 0;
  csMemory = 0;
  passwordVisible = false;
  harborInfoDetail: { addr: string, username: string, password: string }[] = [{addr: '', username: '', password: ''}];

  // harborMessage: {show: boolean, message: string} ={show: false, message: ''};

  constructor(private headerService: MpHeaderService,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private projectManageService: ProjectManageService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getTenantLimit();
    this.headerService.setTitle('项目列表');
  }

  protected setFormData(d: ProjectEntity) {
    if (!d.harborInfo) {
      d.harborInfo = [{addr: '', username: '', password: ''}];
    }
    this.harborInfoDetail = d.harborInfo;
    super.setFormData(d);
  }

  getTenantLimit() {
    this.projectManageService.getTenantLimit().subscribe((res: any) => {
      this.resourceLimit = {...res};
      this.cpuAvailed = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu;
      this.memoryAvailed = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory;
      this.cdr.detectChanges();
    })
  }

  cpuLimitValidator(control: FormControl): any {
    if (this.resourceLimit.maxCpu != 0) {
      if (control.value) {
        let cpuMargin = 0;
        if (this.data) {
          cpuMargin = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu - control.value + parseFloat(this.data.cpuLimit + "");
        } else {
          cpuMargin = this.resourceLimit.maxCpu - this.resourceLimit.currentCpu - control.value
        }
        this.cpuError = 'cpu使用核数超过租户配额'
        return cpuMargin >= 0 ? null : {cpulimit: ''};
      } else {
        this.cpuError = '请输入CPU使用核数'
        return {cpulimit: ''}
      }
    }
  }

  memoryLimitValidator(control: FormControl): any {
    if (this.resourceLimit.maxCpu != 0) {
      if (control.value) {
        let memoryMargin = 0;
        if (this.data) {
          memoryMargin = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory - control.value + parseFloat(this.data.memoryLimit + "");
        } else {
          memoryMargin = this.resourceLimit.maxMemory - this.resourceLimit.currentMemory - control.value
        }
        this.memoryError = '内存使用数超过租户配额'
        return memoryMargin >= 0 ? null : {memoryLimit: ''};
      } else {
        this.memoryError = '请输入内存数值'
        return {memoryLimit: ''}
      }
    }
  }

  protected initForm(): FormGroup {
    return this.form = this.fb.group({
      projectCode: ['', [Validators.required, k8sNameFormValidor]],
      projectName: ['', [Validators.required]],
      projectDesc: ['', []],

      cpuLimit: [8, [(control) => this.cpuLimitValidator(control)]],
      memoryLimit: [4096, [(control) => this.memoryLimitValidator(control)]],
      // cpuLimit: [8, []],
      // memoryLimit: [4096, []],
      storageLimit: [0, [Validators.required]],

      dockerRegistry: ['', []],
      dockerUsername: ['', []],
      dockerPassword: ['', []],

      skywalkingCpu: [0.5, [Validators.required]],
      skywalkingMemory: [2048, [Validators.required]],
      esAddress: ['', [Validators.required]],
      esShards: [3, [Validators.required]],
      esReplicas: [2, [Validators.required]],
      skywalkingEnabled: ['', []],

      harborInfo: [this.harborInfoDetail, [this.harborInfoValidator]]
    });
  }

  harborInfoValidator(control: FormControl): any {
    const result = control.value;
    let b = true;
    if (result) {
      result.forEach(r => {
        if (!r.addr || !r.username || !r.password) {
          b = false;
        }
      });
    } else {
      b = false;
    }
    return b ? null : {name: ''};
  }

  get projectCode() {
    return this.form.controls.projectCode;
  }

  get projectName() {
    return this.form.controls.projectName;
  }

  get projectDesc() {
    return this.form.controls.projectDesc;
  }

  get cpuLimit() {
    return this.form.controls.cpuLimit;
  }

  get memoryLimit() {
    return this.form.controls.memoryLimit;
  }

  get storageLimit() {
    return this.form.controls.storageLimit;
  }

  get dockerRegistry() {
    return this.form.controls.dockerRegistry;
  }

  get dockerUsername() {
    return this.form.controls.dockerUsername;
  }

  get dockerPassword() {
    return this.form.controls.dockerPassword;
  }

  get skywalkingCpu() {
    return this.form.controls.skywalkingCpu;
  }

  get skywalkingMemory() {
    return this.form.controls.skywalkingMemory;
  }

  get esAddress() {
    return this.form.controls.esAddress;
  }

  get esShards() {
    return this.form.controls.esShards;
  }

  get esReplicas() {
    return this.form.controls.esReplicas;
  }

  get harborInfo() {
    return this.form.controls.harborInfo;
  }

  addHarborInfo() {
    if (this.harborInfoDetail.length == 0 ||
      (this.harborInfoDetail[this.harborInfoDetail.length - 1].addr &&
        this.harborInfoDetail[this.harborInfoDetail.length - 1].username &&
        this.harborInfoDetail[this.harborInfoDetail.length - 1].password)) {
      this.harborInfoDetail.push({addr: '', username: '', password: ''});
    }
  }

  delHarborItem(item) {
    const index = this.harborInfoDetail.indexOf(item);
    this.harborInfoDetail.splice(index, 1);
    this.cdr.detectChanges();
  }

  isError(item) {
    const b = !item.addr || !item.username || !item.password;
    return b;
  }

  _submitForm(d: ProjectEntity): ProjectEntity {
    d.harborInfo = this.harborInfoDetail;
    return super._submitForm(d);
  }

}
