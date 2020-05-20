import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {ArtifactoryService} from "../artifactory.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {ArtifactoryEntity} from "../artifactory.entities";

@Component({
  selector: 'artifactory-create',
  template: `
    <se-container col="1" labelWidth="100">
      <se label="名称" required>
        <input nz-input [(ngModel)]="name">
        <se-error *ngIf="!nameValid">名称为3-15个字符</se-error>
      </se>
      <se label="说明">
        <textarea nz-input [(ngModel)]="comment"></textarea>
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
export class ArtifactoryCreateComponent implements OnInit {
  name: string;
  comment: string;

  loading: boolean;

  @Input() artif: ArtifactoryEntity;

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private artifService: ArtifactoryService) {
  }

  ngOnInit(): void {
    if (this.artif) {
      this.name = this.artif.name;
      this.comment = this.artif.comment;
    }
  }

  submit() {
    this.loading = true;
    const {name, comment} = this;
    if (this.artif) {
      this.artifService.editArtifactory(this.artif.id, name, comment).subscribe(res => {
        this.loading = false;
        this.msg.success('修改成功');
        this.modal.close({name, comment});
      }, err => {
        this.loading = false;
        this.msg.error('修改失败');
      });
    } else {
      this.artifService.createArtifactory(name, comment).subscribe(res => {
        this.loading = false;
        this.msg.success('创建成功');
        this.modal.close({name, comment});
      }, err => {
        this.loading = false;
        this.msg.error('创建失败');
      });
    }
  }

  cancel() {
    this.modal.close();
  }

  get disable() {
    return !this.nameValid;
  }

  get nameValid() {
    return this.name && /^[a-zA-Z][a-zA-Z0-9-_]{2,14}$/.test(this.name);
  }
}
