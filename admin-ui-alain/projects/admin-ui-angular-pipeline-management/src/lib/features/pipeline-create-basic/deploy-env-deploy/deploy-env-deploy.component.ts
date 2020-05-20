import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnInit, ViewEncapsulation,
  Output, EventEmitter, Input, ViewChild
} from '@angular/core';
import {DevopsService} from "../../../devops.service";
import {NzMessageService} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {ArtifactoryEntity} from "../../pipeline-create-basic/pipeline-create-entities/artifactory.entities";
import { BaseFormComponent } from 'admin-ui-angular-common/public-api';

@Component({
  selector: 'deploy-env-deploy',
  template: `
    <deploy-env-deploy-form #deployPForm (submit)="onSubmit($event)"
                                   [data]="deployParams"><!--deployParams stageForm.deploySetting-->
    </deploy-env-deploy-form>

    <!--div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button nz-button nzType="default" type="default" class="mr-sm" (click)="nzdrawer.close();">返回
      </button>
      <button nz-button nzType="primary" type="submit" [nzLoading]="submitLoading"
              (click)="deployPForm.submitForm()">提交
      </button>
    </div-->
  `,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  providers: [DevopsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeployEnvDeployComponent implements OnInit {
  artifactory: ArtifactoryEntity;
  submitLoading = false;
  deploySetting = {} ;

  deployTempSetting = {};

  @ViewChild('deployPForm') deployPForm: BaseFormComponent<any>;

  @Input()
  stageForm: any;
  
  @Output() dataToContainer = new EventEmitter();

  constructor(private devopsService: DevopsService,
              private msg: NzMessageService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit(): void {
    // const artfId = +this.route.snapshot.parent.paramMap.get('aid');
    // this.artfService.getArtifactoryDetail(artfId).subscribe(res => {
    //   this.artifactory = res;
    //   this.cdr.detectChanges();
    // });

    const me = this;
    
   setTimeout(function(){ 
     me.deployTempSetting = me.stageForm 
    },
    0);
    this.cdr.detectChanges();
  }

  get deployParams() {
    try {
      return this.deployTempSetting['deploysetting'];
    } catch (e) {
      return null;
    }
  }

  onSubmit(p: any) {
    this.deploySetting = p;
    this.dataToContainer.emit(this.deploySetting);
    // p.artifactoryId = this.artifactory.id;
    // this.submitLoading = true;
    // if (this.artifactory.deployParams && this.artifactory.deployParams.id) {
    //   this.artfService.updateArtifDeployParams(this.artifactory.deployParams.id, p)
    //     .subscribe(res => {
    //       this.submitLoading = false;
    //       this.msg.success('提交成功');
    //       this.cdr.detectChanges();
    //     }, err => {
    //       this.submitLoading = false;
    //       this.msg.error('提交失败');
    //       this.cdr.detectChanges();
    //     });
    // } else {
    //   this.artfService.createArtifDeployParams(p)
    //     .subscribe(res => {
    //       this.submitLoading = false;
    //       this.msg.success('提交成功');
    //       this.cdr.detectChanges();
    //     }, err => {
    //       this.submitLoading = false;
    //       this.msg.error('提交失败');
    //       this.cdr.detectChanges();
    //     });
    // }
  }

  back() {
    this.router.navigateByUrl(`/artifactory/detail/${this.artifactory.id}/info`);
  }
}
