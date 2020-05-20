import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ServiceEntity, VersionEntity } from 'admin-ui-angular-common';

@Component({
  selector: 'version-select',
  template: `
    <nz-select
      nzShowSearch
      nzAllowClear
      nzPlaceHolder="请选择版本"
      [(ngModel)]="val"
      (ngModelChange)="onSelected()"
      style="width: 100%"
    >
      <nz-option *ngFor="let s of verNames; let idx = index"
                 [nzLabel]="s" [nzValue]="idx"></nz-option>
    </nz-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionSelectComponent {
  val = 0;
  @Input() name: string = null;
  _versions: VersionEntity[];
  @Input() set versions(vs: VersionEntity[]) {
    if (!vs || vs.length === 0) return;

    this.val = 0;
    this.verNames = ['全部', ...vs.map(v => v.version)];
    this._versions = vs;
  }

  get versions() {
    return this._versions;
  }

  @Input() service: ServiceEntity;

  verNames: string[];

  @Output() select$: EventEmitter<VersionEntity> = new EventEmitter<VersionEntity>();

  constructor(private cdr: ChangeDetectorRef) {
    this.verNames = ['全部'];
  }

  onSelected() {
    const ver = this.val <= 0 ? {} as VersionEntity : this.versions[this.val - 1];
    this.select$.emit(ver);
  }
}
