import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {ArtifactoryService} from "../artifactory.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'artifactory-create',
  template: `
    <p>是否开启传送门？VID={{vid}}</p>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button class="mr-sm" nz-button nzType="default" type="button" (click)="cancel()">取消
      </button>
      <button nz-button nzType="primary" type="button"
              (click)="submit()"
              [nzLoading]="loading">保存
      </button>
    </div>
  `,
  providers: [ArtifactoryService]
})
export class ArtifactoryFlowStartComponent implements OnInit {
  loading: boolean;

  @Input() vid: string;

  constructor(private modal: NzModalRef,
              private msg: NzMessageService,
              private artifService: ArtifactoryService) {
  }

  ngOnInit(): void {
  }

  submit() {
    this.loading = true;
    this.artifService.startFlowInstance(this.vid).subscribe(res => {
      this.loading = false;
      this.msg.success('启动成功');
      this.modal.close({});
    }, err => {
      this.loading = false;
      this.msg.error('启动失败');
    });
  }

  cancel() {
    this.modal.close();
  }
}
