import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class BaseFormComponent<T> implements OnInit {
  form: FormGroup;

  private _data: T;
  @Input() set data(d: T) {
    if (!d) return;

    this._data = { ...d };
    this.setFormData(this._data);
  }

  get data() {
    return this._data;
  }

  @Output() submit = new EventEmitter<T>();

  ngOnInit(): void {
    this.form = this.initForm();
  }

  protected abstract initForm(): FormGroup;

  protected setFormData(d: T) {
    this.setFormVal(d);
  }

  protected assembleData(fgroup: FormGroup): T {
    return { ...this._data, ...this.form.value };
  }

  protected setFormVal(data: any) {
    Object.keys(data).forEach(k => {
      const f = this.form.get(k);
      if (f) {
        f.setValue(data[k]);
      }
    });
  }

  protected disableField(...ctrls: any[]) {
    ctrls.forEach(c => {
      if (c) c.disable({ onlySelf: true, emitEvent: true });
    });
  }

  getFormValue(key: any): string {
    const f = this.form.get(key);
    if (!f) {
      throw `Key [${key}] doesn't exist in the form`;
    }

    return <string>f.value;
  }

  /**
   * **NOTE**: ------ CAREFULLY USE THIS METHOD ------
   *           Since getValidator() is still not supported by angular itself,
   *           anyone use this method should hold its previous status(validator),
   *           and re-set them if rollback.
   *           Please tell me if there is more reasonable solution.
   * @see https://github.com/angular/angular/issues/13461
   * @param key
   * @param validators empty if clear
   */
  setValidators(key: any, validators: any[] = []) {
    const f = this.form.get(key);
    if (!f) {
      throw `Key [${key}] doesn't exist in the form`;
    }

    f.setValidators(validators);
    f.updateValueAndValidity();
  }

  checkDirtyValue(value?: string): boolean {
    if (value) {
      const fctrl = this.form.get(value);
      fctrl.markAsDirty();
      fctrl.updateValueAndValidity();

      return fctrl.invalid;
    } else {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
        // console.log(`${i} is ${this.form.controls[i].invalid ? 'invalid' : 'valid'}`);
      }

      return this.form.invalid;
    }
  }

  submitForm(): T {
    if (this.checkDirtyValue()) return;

    const d = this._submitForm(this.assembleData(this.form));
    this.submit.emit(d);

    return d;
  }

  _submitForm(d: T): T {
    return d;
  }
}
