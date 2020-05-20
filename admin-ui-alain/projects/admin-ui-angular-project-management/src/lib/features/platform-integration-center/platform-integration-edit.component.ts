import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {PlatformConfigItem, PlatformEntity} from "./platform-integration.entity";
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {PlatformIntegrationService} from "./platform-integration.service";

@Component({
  selector: 'platform-integration-edit',
  template: `
    <se-container col="1" labelWidth="200">
      <se *ngFor="let c of platformFields" [label]="c.name" [required]="c.required">
        <ng-container [ngSwitch]="c.type">
          <label *ngSwitchCase="'checkbox'" nz-checkbox [(ngModel)]="item[c.key]"></label>
          <input *ngSwitchDefault nz-input [placeholder]="c.desc" [pattern]="c.reg" [(ngModel)]="item[c.key]">
        </ng-container>
        <se-error style="color: #f5222d" *ngIf="item[c.key] && c.reg && !regtest(item[c.key], c.reg)">数据格式不正确</se-error>
      </se>
    </se-container>
    <div nz-row nzType="flex" nzJustify="center" class="mt-md">
      <button class="mr-sm" nz-button nzType="primary" type="button"
              [disabled]="!enableSubmit"
              (click)="submitForm()"
              [nzLoading]="submitLoading">保存
      </button>
      <button nz-button nzType="default" type="button" (click)="cancel()">取消
      </button>
    </div>
  `,
  providers: [PlatformIntegrationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformIntegrationEditComponent implements OnInit {
  get title() {
    return this.item ? '集成中心 - 编辑' : '集成中心 - 添加';
  }

  @Input() platform: PlatformEntity;
  @Input() item ? = {} as any;

  submitLoading = false;

  constructor(private piService: PlatformIntegrationService,
              private modal: NzModalRef,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef) {
  }

  get platformFields() {
    return this.platform.config ? this.platform.config.fields : null;
  }

  ngOnInit(): void {
    if (!this.item.id) { // create
      this.platform.config.fields.forEach(f => {
        this.item[f.key] = f.def;
      });
      this.cdr.detectChanges();
    }
  }

  submitForm() {
    this.submitLoading = true;
    if (this.item.id) {
      this.piService.editPlatform(this.platform.type, this.item).subscribe(res => {
        this.submitLoading = false;
        this.msg.success('修改成功');
        this.modal.close(true);
        this.cdr.detectChanges();
      }, err => {
        this.msg.error('修改失败');
        this.submitLoading = false;
        this.cdr.detectChanges();
      });
    } else {
      this.piService.createPlatform(this.platform.type, this.item).subscribe(res => {
        this.submitLoading = false;
        this.msg.success('添加成功');
        this.modal.close(true);
        this.cdr.detectChanges();
      }, err => {
        this.msg.error(err);
        this.submitLoading = false;
        this.cdr.detectChanges();
      });
    }
  }

  cancel() {
    this.modal.close();
  }

  get enableSubmit() {
    if (!this.platformFields) return false;

    return this.platformFields.every((k: PlatformConfigItem) => {
      const val = this.item[k.key];
      const requiredCheck = k.required ? !!val : true;
      const regCheck = !!k.reg ? k.reg && new RegExp(k.reg).test(val) : true;

      return requiredCheck && regCheck;
    });
  }

  regtest(val, reg) {
    return new RegExp(reg).test(val);
  }
}
