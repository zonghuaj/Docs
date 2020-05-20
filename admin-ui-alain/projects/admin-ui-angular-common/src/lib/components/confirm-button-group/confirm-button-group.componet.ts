import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'z-confirm-button-group',
  template: `
    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button nz-button nzType="default" type="default" class="mr-sm" *ngIf="!onlySubmit"
              [disabled]="negativeDisable" (click)="negativeClicked$.emit()">
        {{negativeConf ? negativeConf.text : '返回'}}
      </button>
      <button nz-button nzType="primary" type="submit"
              [nzLoading]="naturalLoading"
              [disabled]="naturalDisable" (click)="naturalClicked$.emit()">
        {{naturalConf ? naturalConf.text : '提交'}}
      </button>
    </div>
  `,
  styles: [],
})
export class ConfirmButtonGroupComponet {
  @Output() negativeClicked$ = new EventEmitter();
  @Output() naturalClicked$ = new EventEmitter();

  @Input() naturalConf: BtnConf;
  @Input() negativeConf: BtnConf;

  @Input() negativeDisable = false;
  @Input() naturalDisable = false;

  @Input() naturalLoading = false;

  @Input() onlySubmit = false;

  constructor() {
  }
}

export interface BtnConf {
  text?: string;
}
