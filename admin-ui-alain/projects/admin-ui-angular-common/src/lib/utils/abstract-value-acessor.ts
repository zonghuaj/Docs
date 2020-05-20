import {forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export abstract class AbstractValueAccessor<T> implements ControlValueAccessor {
  private _zvalue: T = {} as T;
  get zvalue(): T {
    return this._zvalue;
  };

  set zvalue(v: T) {
    if (v !== this._zvalue) {
      this._zvalue = v;
      this.onChange(v);
    }
  }

  writeValue(value: T) {
    this._zvalue = value;
    // warning: comment below if only want to emit on user intervention
    this.onChange(value);
  }

  combineValue(value: any) {
    this._zvalue = {...this.zvalue, ...value};
    this.onChange(this._zvalue);
  }

  onChange = (_) => {
  };
  onTouched = () => {
  };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

export function MakeProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}
