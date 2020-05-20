import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  OnInit, ViewChild,
} from '@angular/core';
import {ArtifactoryService} from "../../artifactory.service";
import {BaseFormComponent} from "admin-ui-angular-common";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {ArtifactoryEntity} from "../../artifactory.entities";
import {TitleService} from "@delon/theme";

@Component({
  selector: 'artifactory-detail-runtimeparams',
  template: `
    <artifactory-runtimeparams-table #initTable [title]="'启动变量'"
                                     [data]="getTableDatas('1')"
                                     [formKey]="'initParams'"></artifactory-runtimeparams-table>
    <artifactory-runtimeparams-table #envTable [title]="'环境变量'"
                                     [data]="getTableDatas('2')"
                                     [formKey]="'envParams'"></artifactory-runtimeparams-table>
    <artifactory-runtimeparams-table #confTable [title]="'配置文件'"
                                     [data]="getTableDatas('3')"
                                     [isFileParam]="true"
                                     [formKey]="'configure'"></artifactory-runtimeparams-table>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button nz-button nzType="default" type="default" class="mr-sm" (click)="back()">返回
      </button>
      <button nz-button nzType="primary" type="button" [nzLoading]="submitLoading" (click)="submitF()">提交
      </button>
    </div>
  `,
  providers: [ArtifactoryService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtifactoryDetailRuntimeparamsComponent implements OnInit {
  @ViewChild('initTable') initTable: BaseFormComponent<any>;
  @ViewChild('envTable') envTable: BaseFormComponent<any>;
  @ViewChild('confTable') confTable: BaseFormComponent<any>;

  artifactory: ArtifactoryEntity;

  submitLoading = false;

  constructor(private artifService: ArtifactoryService,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              private titleSrv: TitleService) {
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('制品详情');

    const artfId = +this.route.snapshot.parent.paramMap.get('aid');
    this.artifService.getArtifactoryDetail(artfId).subscribe(res => {
      this.artifactory = res;
      this.cdr.detectChanges();
    });
  }

  getTableDatas(type) {
    try {
      return this.artifactory.runtimeParams.filter(p => p.type === type);
    } catch (e) {
      return [];
    }
  }

  submitF() {
    const initP = this.initTable.submitForm() as [];
    const envP = this.envTable.submitForm() as [];
    const confP = this.confTable.submitForm() as [];
    if (!initP || !envP || !confP) {
      return;
    }
    const fullParams = [
      ...this.processParam(initP, '1'),
      ...this.processParam(envP, '2'),
      ...this.processParam(confP, '3')
    ];
    this.submitLoading = true;
    this.artifService.saveArtifRuntimeParams(this.artifactory.id, fullParams).subscribe(res => {
      this.submitLoading = false;
      this.msg.success('提交成功');
      this.cdr.detectChanges();
    }, err => {
      this.submitLoading = false;
      this.msg.error('提交失败');
      this.cdr.detectChanges();
    });
  }

  processParam(params: any[], type: string) {
    return params.filter(p => !!p.key)
      .map(p => ({...p, type, artifactoryId: this.artifactory.id}));
  }

  back() {
    this.router.navigateByUrl(`/artifactory/${this.artifactory.id}/info`);
  }
}
