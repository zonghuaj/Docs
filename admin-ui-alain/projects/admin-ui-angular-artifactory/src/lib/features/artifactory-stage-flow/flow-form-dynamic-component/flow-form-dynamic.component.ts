import {
  Component, Input,
  OnInit, ChangeDetectorRef
} from '@angular/core';
import { ArtifactoryService } from '../../artifactory.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { NzModalRef, NzDrawerRef } from 'ng-zorro-antd';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CascaderOption } from 'ng-zorro-antd/cascader';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'flow-form-dynamic',
  template: `
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
            <nz-cascader *ngIf="item.type == 'cascaderSync' || item.type == 'selectFromUri'"  [(ngModel)]="stage[item.name]"  [formControlName] ="item.name" [nzLoadData]="loadData">
            </nz-cascader>

            <nz-switch *ngIf="item.type == 'switch'" [formControlName] ="item.name" [(ngModel)]="stage[item.name]"></nz-switch>

            
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
  providers: [ArtifactoryService]
})
export class FlowFormDynamicComponent implements OnInit {
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

  form: FormGroup;

  constructor(// private modal: NzModalRef,
    private nzdrawer: NzDrawerRef,
    private artifService: ArtifactoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.loadData = this.loadData.bind(this);
  }

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formElements);

    if (this.formElements.find(t => t.type === 'selectFromUri')) {
      this.dataSourceType = this.formElements.find(t => t.type === 'selectFromUri').dataSourceType;
      this.callServiceAsynchronous(this.dataSourceType);
    }

    if (this.formElements.find(t => t.type === 'cascaderSync')) {
      this.dataSourceType = this.formElements.find(t => t.type === 'cascaderSync').dataSourceType;
      this.callServiceAsynchronous(this.dataSourceType);
    }
  }

  toFormGroup(fields: any) {
    const group: any = {};
    fields.forEach(field => {
      group[field.name] = field.required ?
        (field.pattern ? new FormControl(field.default, [Validators.required, Validators.pattern(field.pattern)]) :
        new FormControl(field.default, Validators.required))
        : new FormControl(field.default);
    });
    group.nameinput = new FormControl('', Validators.required);
    return this.fb.group(group);
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
      this.artifService.getCascaderData(this.dataSourceTypeArray[index === -1 ? 0 : index + 1], param).subscribe(res => {
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

  cancel() {
    this.nzdrawer.close();
  }

  submit() {
    if (this.checkDirty(this.form)) return;
    const formBackList = { type: this.type, id: this.id, formOption: this.stage, name: this.name };
    this.nzdrawer.close(formBackList);
  }

  checkDirty(f: FormGroup) {
    for (const i in f.controls) {
      f.controls[i].markAsDirty();
      f.controls[i].updateValueAndValidity();
    }

    return f.invalid;
  }

  get disable() {
    return false;
    // const {name, deployUrl, deployToken, deployGroupId, confirmGroupId} = this.stage;
    // return !name || !deployUrl || !deployGroupId || !confirmGroupId || !isUrl(deployUrl);
  }
  
}
