import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BaseFormComponent} from 'admin-ui-angular-common';
import {ImageTemplate} from '../entities/image-template.entity';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {parseCustomParameters} from '../image-parser.utils';

import 'codemirror/mode/dockerfile/dockerfile';

@Component({
  selector: 'admin-ui-angular-image-template-form',
  template: `
    <form nz-form [formGroup]="form" [nzLayout]="'vertical'">
      <nz-card nzTitle="基本信息" [nzBordered]="false">
        <se-container col="1" labelWidth="100">
          <se label="模板名称" required>
            <input nz-input formControlName="name" placeholder="请输入名称">
            <se-error *ngIf="name.dirty && name.errors">
              名称为3-30个字符
            </se-error>
          </se>
          <se label="模板描述">
            <textarea nz-input formControlName="description" placeholder="请输入模板描述"></textarea>
          </se>
          <se label="模板脚本" required>
            <ngx-codemirror #codeeditor className="scrollbar"
                            (ngModelChange)="onScriptCodeChanged($event)"
                            formControlName="script"
                            [options]="this.option"></ngx-codemirror>
            <se-error *ngIf="script.dirty && script.errors">
              请输入镜像脚本
            </se-error>
          </se>
        </se-container>
      </nz-card>

      <nz-card nzTitle="模板参数" [nzBordered]="false" *ngIf="paramF.controls && paramF.controls.length> 0">
        <nz-table #tb [nzData]="paramF.value" [nzShowPagination]="false" [nzFrontPagination]="false"
                  formArrayName="params">
          <thead>
          <tr>
            <th>变量名</th>
            <th>标签<label stlye="margin-left: 2px" class="ant-form-item-required"></label></th>
            <th>默认值</th>
            <th>提示信息</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let p of paramF.controls; let i = index" [formGroupName]="i">
            <td style="vertical-align: top">{{getParamVal(i, 'key')}}</td>
            <td style="vertical-align: top">
              <input nz-input formControlName="label">
              <label style="display: block; color: red" *ngIf="!getParamVal(i, 'label')">必填项</label>
            </td>
            <td style="vertical-align: top"><input nz-input formControlName="defValue"></td>
            <td style="vertical-align: top"><input nz-input formControlName="promptMessage"></td>
          </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </form>
  `,
  styleUrls: ['./admin-ui-angular-image-template-form.component.less'],
})
export class AdminUiAngularImageTemplateFormComponent extends BaseFormComponent<ImageTemplate> implements AfterViewInit {
  loading = false;

  @ViewChild('codeeditor') private codeEditor;
  scriptChange$: Subject<string> = new Subject<string>();
  disableScriptChangeListen; // script change listen should be disabled when setFormVals()

  data0; // for raw data saving

  option: any = {
    lineNumbers: true,
    mode: 'dockerfile',
    theme: 'material'
  };

  constructor(private fb: FormBuilder) {
    super();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit();

    this.listenScriptChange();
  }

  ngAfterViewInit(): void {
    const editor = this.codeEditor.codeMirror;
    editor.setSize('100%', '400px');
  }

  protected setFormData(d: ImageTemplate) {
    this.data0 = d;
    try {
      const formedParams = d.params.map(p => ({
        id: p.id,
        key: p.key,
        label: p.label,
        defValue: p.defValue,
        promptMessage: p.promptMessage
      }));
      d.params = formedParams;
      this.resetParamF(formedParams);

      // disable change listen when set form data
      this.disableScriptChangeListen = true;
    } catch (e) {
      this.resetParamF([]);
    }
    super.setFormData(d);

    setTimeout(() => this.disableScriptChangeListen = false);
  }

  initForm(): FormGroup {
    return this.form = this.fb.group({
      name: ['', [Validators.required, this.nameValidator]],
      description: '',
      script: ['', Validators.required],
      params: this.fb.array([])
    });
  }

  nameValidator(control: FormControl) {
    const result = control.value;
    const valid = /^[^]{3,30}$/.test(result);
    return valid ? null : {name: ''};
  }

  get name() {
    return this.form.controls.name;
  }

  get script() {
    return this.form.controls.script;
  }

  get paramF() {
    return this.form.controls.params as FormArray;
  }

  getParamVal(i, key) {
    return (this.paramF.controls[i] as FormGroup).controls[key].value;
  }

  resetParamF(params) {
    this.paramF.controls = this.parseParamsFCtrl(params);
  }

  parseParamsFCtrl(params): any[] {
    return params.map(p => {
      const {id, key, label, defValue, promptMessage} = p;
      return this.fb.group({
        id: [id],
        key: [key],
        label: [label, [Validators.required]],
        defValue: [defValue],
        promptMessage: [promptMessage]
      });
    });
  }

  onScriptCodeChanged(code) {
    if (this.disableScriptChangeListen) return;

    this.scriptChange$.next(code);
  }

  listenScriptChange() {
    this.scriptChange$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(script => {
      const result = parseCustomParameters(script);
      const params = result.map(p => {
        let id = null;
        const key = p;
        let label = '';
        let defValue = '';
        let promptMessage = '';

        // find original param and reset
        const orgP = this.paramF.value.find(pp => pp.key === p);
        if (orgP) {
          id = orgP.id;
          label = orgP.label;
          defValue = orgP.defValue;
          promptMessage = orgP.promptMessage;
        }

        return {id, key, label, defValue, promptMessage};
      });

      this.resetParamF(params);
    });
  }
}
