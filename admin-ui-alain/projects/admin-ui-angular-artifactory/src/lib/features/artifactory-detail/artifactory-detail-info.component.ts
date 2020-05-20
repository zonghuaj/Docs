import {
  Component,
  OnInit,
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArtifactoryService} from "../artifactory.service";
import {ArtifactoryEntity} from "../artifactory.entities";
import {ArtifactoryCreateComponent} from "../artifactory-create/artifactory-create.component";
import {ModalHelper, TitleService} from "@delon/theme";
import {ArtifactoryVersionCreateComponent} from "../artifactory-create/artifactory-version-create.component";

@Component({
  selector: 'artifactory-detail-info',
  template: `
    <nz-card *ngIf="artifactory" nzTitle="基本信息" [nzBordered]="false" [nzExtra]="infoTmp">
      <sv-container class="mb-lg" [col]="1">
        <sv label="名称">{{artifactory.name}}</sv>
        <sv label="说明">{{artifactory.comment}}</sv>
      </sv-container>

      <ng-template #infoTmp>
        <div>
          <a (click)="edit()">编辑</a>
          <nz-divider nzType="vertical"></nz-divider>
          <nz-popconfirm nzTitle="确认删除当前制品？" (nzOnConfirm)="del()">
            <a nz-popconfirm style="color: red;">删除</a>
          </nz-popconfirm>
        </div>
      </ng-template>
    </nz-card>

    <nz-card *ngIf="artifactory" nzTitle="版本信息" [nzBordered]="false" [nzExtra]="versionTmp">
      <artifactory-version-list [artif]="artifactory"
                                (versionChanged$)="getDetail(artifactory.id)"></artifactory-version-list>
      <ng-template #versionTmp>
        <div>
          <a (click)="addArtifactory()">添加版本</a>
        </div>
      </ng-template>
    </nz-card>
  `,
  providers: [ArtifactoryService]
})
export class ArtifactoryDetailInfoComponent implements OnInit {
  loading: boolean;
  artifactory: ArtifactoryEntity;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalHelper,
    private artifService: ArtifactoryService,
    private titleSrv: TitleService) {
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('制品详情');
    const artId = this.route.snapshot.parent.paramMap.get('aid');
    this.getDetail(artId);
  }

  getDetail(id) {
    this.loading = true;
    this.artifService.getArtifactoryDetail(id).subscribe(res => {
      this.loading = false;
      this.artifactory = res;
    });
  }

  edit() {
    this.modal.create(ArtifactoryCreateComponent, {artif: this.artifactory}, {
      size: 'md',
      modalOptions: {
        nzTitle: '创建制品',
      }
    }).subscribe(res => {
      if (res) this.artifactory = {
        ...this.artifactory,
        name: res.name,
        comment: res.comment
      }
    });
  }

  del() {
    this.artifService.deleteArtifactory(this.artifactory.id).subscribe(res => {
      this.router.navigateByUrl('/artifactory/list');
    });
  }

  addArtifactory() {
    this.modal.create(ArtifactoryVersionCreateComponent,
      {artifId: this.artifactory.id},
      {
        size: 'md',
        modalOptions: {
          nzTitle: '创建制品版本',
        }
      }).subscribe(res => {
      if (res) this.getDetail(this.artifactory.id);
    });
  }
}
