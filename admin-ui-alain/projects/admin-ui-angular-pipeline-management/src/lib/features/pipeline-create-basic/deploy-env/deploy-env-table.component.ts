import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation,} from '@angular/core';
import {BaseFormComponent} from "admin-ui-angular-common";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ArtifRuntimeParam} from "../pipeline-create-entities/artifactory.entities";
import {InputBoolean} from "ng-zorro-antd";

@Component({
  selector: 'deploy-env-table',
  templateUrl: './deploy-env-table.component.html',
  styleUrls: ['./deploy-env-table.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeployEnvTableComponent extends BaseFormComponent<ArtifRuntimeParam[]> {
  @Input() title;
  @Input() formKey;
  
  @Input() @InputBoolean() isFileParam = false;

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
    super();
  }

  protected initForm(): FormGroup {
    return this.fb.group({
      [this.formKey]: this.fb.array([this.newFItem()])
    });
  }

  // make sure this data set for only once
  private setOnce = true;

  protected setFormData(ps: ArtifRuntimeParam[]) {
    if (!this.setOnce) return;
    // bad design for super.setData() is not support with Array :(
    // so reconvert it here again
    ps = Object.entries(ps).map(e => e[1]);
    if (ps.length === 0) return;
    if (!this.itemControls) return;

    if (this.itemControls.length < ps.length) {
      const diff = ps.length - this.itemControls.length;
      for (let i = 0; i < diff; i++) {
        this.addFItem();
      }
    }

    const newData = {
      [this.formKey]: [
        ...ps.map(p => ({
          key: p.key,
          value: p.value,
          comment: p.comment,
        }))
      ]
    };
    super.setFormData(newData as any);
    this.setOnce = false;
  }

  addFItem() {
    this.itemControls.push(this.newFItem());
    this.cdr.detectChanges();
  }

  newFItem() {
    return this.fb.group({
      key: ['', [(control) => this.keyValidator(control)]],
      value: '',
      comment: '',
    });
  }

  keyValidator(control: FormControl): any {
    const failed = {err: ''};
    const result = control.value;
    if (result === '') return null; // return valid if this value is empty
    if (this.form && this.form.controls) {
      const allKeys = this.itemControls.controls.map(c => c.value['key']);
      const valid = allKeys.indexOf(result) < 0;
      return valid ? null : failed;
    } else {
      return failed;
    }
  }

  get itemControls() {
    return this.form.controls[this.formKey] as FormArray;
  }

  keyItem(i) {
    return (this.itemControls.controls[i] as FormGroup).controls['key'] as FormControl;
  }

  delFItem(i) {
    this.itemControls.removeAt(i);
    this.cdr.detectChanges();
  }

  _submitForm(d: any): ArtifRuntimeParam[] {
    return d[this.formKey];
  }
}
