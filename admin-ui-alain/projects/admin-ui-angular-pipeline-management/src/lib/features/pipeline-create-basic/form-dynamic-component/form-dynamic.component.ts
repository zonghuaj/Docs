import {
  Component, Input,
  OnInit, ChangeDetectorRef
} from '@angular/core';
import { TeamGroupService } from 'admin-ui-angular-user-management';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzDrawerRef } from 'ng-zorro-antd';
import { isUrl } from 'admin-ui-angular-common';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import {DevopsService} from "../../../devops.service";
import { CascaderOption } from 'ng-zorro-antd/cascader';


const provinces = [
  {
    value: 'zhejiang',
    label: 'Zhejiang'
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu'
  }
];

const cities: { [key: string]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {
  zhejiang: [
    {
      value: 'hangzhou',
      label: 'Hangzhou'
    },
    {
      value: 'ningbo',
      label: 'Ningbo',
      isLeaf: true
    }
  ],
  jiangsu: [
    {
      value: 'nanjing',
      label: 'Nanjing'
    }
  ]
};

const scenicspots: { [key: string]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {
  hangzhou: [
    {
      value: 'xihu',
      label: 'West Lake',

    }
  ],
  nanjing: [
    {
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',

    }
  ]
};



@Component({
  selector: 'form-dynamic',
  template: `
    <!-- se-container col="1" labelWidth="100">
      <se label="阶段名称" required>
        <input nz-input [(ngModel)]="stage.name">
      </se>
      <se label="部署地址" required>
        <input type="url" nz-input [(ngModel)]="stage.deployUrl">
        <se-error *ngIf="stage.deployUrl && !isUrl(stage.deployUrl)">请输入正确的Url</se-error>
      </se>
      <se label="Token">
        <input nz-input [(ngModel)]="stage.deployToken">
      </se>
      <se label="审批验证组" required>
        <nz-select class="width100" [(ngModel)]="stage.confirmGroupId">
          <nz-option *ngFor="let r of teams" [nzLabel]="r.groupName" [nzValue]="r.groupId"></nz-option>
        </nz-select>
      </se>
      <se label="部署审批组" required>
        <nz-select class="width100" [(ngModel)]="stage.deployGroupId">
          <nz-option *ngFor="let r of teams" [nzLabel]="r.groupName" [nzValue]="r.groupId"></nz-option>
        </nz-select>
      </se>
    </se-container-->
    <form
    nz-form [formGroup]="form"
    (ngSubmit)="submit()"
  >
    <se-container col="1" labelWidth="150" >
        <se label="阶段名称" [required]="true" error="此项为必填项">
          <input nz-input  [(ngModel)]="name" formControlName ="nameinput">
        </se>
        <se label="{{item.label}}" [required]="item.required" error="{{item.errorMessage?item.errorMessage:commonError}}" *ngFor="let item of formElements">
            <input nz-input  [(ngModel)]="stage[item.name]" [formControlName] ="item.name" *ngIf="item.type == 'input'">
            <textarea style="height: 200px" nz-input [(ngModel)]="stage[item.name]" [formControlName] ="item.name" *ngIf="item.type == 'textarea' || item.type == 'command' "></textarea>
            <nz-select *ngIf="item.type == 'select'" class="width100" [formControlName] ="item.name" [(ngModel)]="stage[item.name]">
              <nz-option *ngFor="let r of item.dataOptions" [nzLabel]="r.label" [nzValue]="r.value"></nz-option>
            </nz-select>
            <nz-cascader *ngIf="item.type == 'cascaderSync' || item.type == 'selectFromUri'"  [(ngModel)]="stage[item.name]"  [formControlName] ="item.name" [nzLoadData]="loadData" (ngModelChange)="onChanges(item.dataSourceType)">
            </nz-cascader>

            <nz-switch *ngIf="item.type == 'switch'" [formControlName] ="item.name" [(ngModel)]="stage[item.name]"></nz-switch>

            <!--special for doc template-->
            <nz-select (ngModelChange)="selectDockerSelfChange($event)" *ngIf="item.type == 'selectDockerTemplateFromUri'" [(ngModel)]="stage[item.name]" class="width100" [formControlName] ="item.name" >
              <nz-option *ngFor="let r of dynamicSelectDataForDocTemplate" [nzLabel]="r.label" [nzValue]="r.value"></nz-option>
            </nz-select>
        </se>

        <se label="{{item.label}}" [required]="item.required" error="此项为必填项" *ngFor="let item of dynamicFormElementForDocTemplate">
            <input nz-input  [(ngModel)]="stage[item.name]" [formControlName] ="item.name">
        </se>
    </se-container>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button class="mr-sm" nz-button nzType="default" type="button" (click)="cancel()">取消
      </button>
      <button nz-button nzType="primary" type="button" (click)="submit()" [disabled]="disable">保存
      </button>
    </div>
    </form>
  `,
  providers: [TeamGroupService, DevopsService]
})
export class FormDynamicComponent implements OnInit {

  values: string[] | null = null;
  // values: string[] = ['string', 'string', 'string'];

  commonError = '此项是必填项';
  dataSourceType: any = {};
  DockerTemplateSelf = '';
  DockerTemplateChildren = '';
  dataSourceTypeArray = [];
  @Input() name: string; // "CodeSource"
  @Input() type: string; // "CodeSource"
  @Input() id: string; // "xdifjdsifjsdkfjsd or CodeSource_Git"
  @Input() formElements: any;
  @Input()
  stage: any;

  dynamicFormElementForDocTemplate: any = [];
  dynamicSelectDataForDocTemplate: any = [];

  teams: {
    groupId: string,
    groupName: string
  }[] = [];

  form: FormGroup;

  constructor(// private modal: NzModalRef,
    private nzdrawer: NzDrawerRef,
    private teamGroupService: TeamGroupService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private devopsService: DevopsService
  ) {
    this.loadData = this.loadData.bind(this);
  }

  ngOnInit(): void {
    this.getTeamGroups();
    this.form = this.toFormGroup(this.formElements);

    this.getCascaderData();
    if (this.formElements.find(t => t.type === 'cascaderSync')) {
      this.dataSourceType = this.formElements.find(t => t.type === 'cascaderSync').dataSourceType;
      this.callServiceAsynchronous(this.dataSourceType);
    }

    if (this.formElements.find(t => t.type === 'selectFromUri')) {
      this.dataSourceType = this.formElements.find(t => t.type === 'selectFromUri').dataSourceType;
      this.callServiceAsynchronous(this.dataSourceType);
    }

    if (this.formElements.find(t => t.type === 'selectDockerTemplateFromUri')) {
      this.DockerTemplateSelf = this.formElements.find(t => t.type === 'selectDockerTemplateFromUri').dataSourceType.type;
      this.DockerTemplateChildren = this.formElements.find(t => t.type === 'selectDockerTemplateFromUri').dataSourceType.children.type;
      this.selectDockerSelf();
    }
  }

  getTeamGroups() {
    this.teamGroupService.getTeamGroup()
      .pipe(switchMap((res: any) => of(res.rows.map(r => ({ groupId: r.groupId, groupName: r.groupName })))))
      .subscribe(res => {
        this.teams = res;
      });
  }

  submit() {
    if (this.checkDirty(this.form)) return;
    const formBackList = { type: this.type, id: this.id, formOption: this.stage, name: this.name };
    this.nzdrawer.close(formBackList);
  }

  loadDataWhenOpen(event) {

  }

  checkDirty(f: FormGroup) {
    for (const i in f.controls) {
      f.controls[i].markAsDirty();
      f.controls[i].updateValueAndValidity();
    }

    return f.invalid;
  }

  findGroup(roleId) {
    return this.teams.find(t => t.groupId === roleId);
  }

  cancel() {
    this.nzdrawer.close();
  }

  isUrl(s) {
    return isUrl(s);
  }

  get disable() {
    return false;
    // const {name, deployUrl, deployToken, deployGroupId, confirmGroupId} = this.stage;
    // return !name || !deployUrl || !deployGroupId || !confirmGroupId || !isUrl(deployUrl);
  }

  toFormGroup(fields: any) {
    const group: any = {};

    fields.forEach(field => {
      group[field.name] = field.required ?
        (field.pattern ? new FormControl(field.default, [Validators.required, Validators.pattern(field.pattern)]) : new FormControl(field.default, Validators.required))
        : new FormControl(field.default);


    });

    group.nameinput = new FormControl('', Validators.required);
    return this.fb.group(group);
    // return new fb.FormGroup(group);
  }

  addFormControlToExistingForm(fields: any, existForm) {
    const group: any = {};

    fields.forEach(field => {
      // group[field.key] = property.nameChain, this.fb.control(null, Validators.required)field.required ? new FormControl(field.default, Validators.required) : new FormControl(field.default);
      existForm.addControl(field['name'], this.fb.control(null, Validators.required));
    });
    return existForm;
  }

  // get Cascader data
  getCascaderData() {
    this.devopsService.getCascaderData(0, 100).subscribe(res => {
      if (res && res.rows && res.rows.length > 0) {
        // this.pipeLineCodeStores = res.rows;
      }
    });
  }

  onChanges(values: string[]): void {
    // this.dataSourceType = values;//数据源节点

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
    return new Promise((resolve, reject) => {
      const type = this.dataSourceTypeArray[index === -1 ? 0 : index];
      let param = '';
      if (index !== -1) {
        param = node.value;
      }
      this.devopsService.getCascaderData(this.dataSourceTypeArray[index === -1 ? 0 : index + 1], param).subscribe(res => {
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

  selectDockerSelf() {
    this.dynamicSelectDataForDocTemplate = [];
    this.devopsService.getCascaderData(this.DockerTemplateSelf, '').subscribe(res => {
      if (res) {
        this.dynamicSelectDataForDocTemplate = [...res.rows];
        this.cdr.detectChanges();
      }
    });
  }

  selectDockerSelfChange(event) {

    this.dynamicFormElementForDocTemplate = [];
    if (!event) return;
    this.devopsService.getCascaderData(this.DockerTemplateChildren, event).subscribe(res => {
      if (res) {
        this.form = this.addFormControlToExistingForm([...res.rows], this.form);
        this.cdr.detectChanges();
        this.dynamicFormElementForDocTemplate = [...res.rows];

      }
    });
  }

}
