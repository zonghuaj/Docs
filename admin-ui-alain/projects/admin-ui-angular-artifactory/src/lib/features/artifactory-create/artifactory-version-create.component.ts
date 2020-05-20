import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {ArtifactoryService} from "../artifactory.service";
import {NzMessageService, NzModalRef} from "ng-zorro-antd";

@Component({
  selector: 'artifactory-version-create',
  template: `
    <se-container col="1" labelWidth="100">
      <se label="名称" required>
        <input nz-input [(ngModel)]="name">
        <se-error *ngIf="!nameValid">名称为3-15个字符</se-error>
      </se>
    </se-container>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button class="mr-sm" nz-button nzType="default" type="button" (click)="cancel()">取消
      </button>
      <button nz-button nzType="primary" type="button"
              (click)="submit()"
              [disabled]="disable"
              [nzLoading]="loading">保存
      </button>
    </div>
  `,
  providers: [ArtifactoryService]
})
export class ArtifactoryVersionCreateComponent implements OnInit {
  name: string;

  loading: boolean;

  @Input() artifId;

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private artifService: ArtifactoryService) {
  }

  ngOnInit(): void {
  }

  submit() {
    this.loading = true;
    const {artifId, name} = this;
    this.artifService.createArtVersion(artifId, name).subscribe(res => {
      this.loading = false;
      this.msg.success('创建成功');
      this.modal.close({});
    }, err => {
      this.loading = false;
      this.msg.error('创建失败');
    });
  }

  cancel() {
    this.modal.close();
  }

  get disable() {
    return !this.nameValid;
  }

  get nameValid() {
    return this.name && /^[^]{2,30}$/.test(this.name);
  }
}
