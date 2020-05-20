import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnInit, ViewEncapsulation,
} from '@angular/core';
import {ArtifactoryService} from "../../artifactory.service";
import {NzMessageService} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {ArtifactoryEntity} from "../../artifactory.entities";

@Component({
  selector: 'artifactory-detail-deployparams',
  template: `
    <artifactory-deployparams-form #deployPForm (submit)="onSubmit($event)"
                                   [data]="deployParams">
    </artifactory-deployparams-form>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button nz-button nzType="default" type="default" class="mr-sm" (click)="back()">返回
      </button>
      <button nz-button nzType="primary" type="submit" [nzLoading]="submitLoading"
              (click)="deployPForm.submitForm()">提交
      </button>
    </div>
  `,
  styleUrls: ['./artifactory-detail-deployparams.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ArtifactoryService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtifactoryDetailDeployparamsComponent implements OnInit {
  artifactory: ArtifactoryEntity;
  submitLoading = false;

  constructor(private artfService: ArtifactoryService,
              private msg: NzMessageService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit(): void {
    const artfId = +this.route.snapshot.parent.paramMap.get('aid');
    this.artfService.getArtifactoryDetail(artfId).subscribe(res => {
      this.artifactory = res;
      this.cdr.detectChanges();
    });
  }

  get deployParams() {
    try {
      return this.artifactory.deployParams;
    } catch (e) {
      return null;
    }
  }

  onSubmit(p: any) {
    p.artifactoryId = this.artifactory.id;
    this.submitLoading = true;
    if (this.artifactory.deployParams && this.artifactory.deployParams.id) {
      this.artfService.updateArtifDeployParams(this.artifactory.deployParams.id, p)
        .subscribe(res => {
          this.submitLoading = false;
          this.msg.success('提交成功');
          this.cdr.detectChanges();
        }, err => {
          this.submitLoading = false;
          this.msg.error('提交失败');
          this.cdr.detectChanges();
        });
    } else {
      this.artfService.createArtifDeployParams(p)
        .subscribe(res => {
          this.submitLoading = false;
          this.msg.success('提交成功');
          this.cdr.detectChanges();
        }, err => {
          this.submitLoading = false;
          this.msg.error('提交失败');
          this.cdr.detectChanges();
        });
    }
  }

  back() {
    this.router.navigateByUrl(`/artifactory/detail/${this.artifactory.id}/info`);
  }
}
