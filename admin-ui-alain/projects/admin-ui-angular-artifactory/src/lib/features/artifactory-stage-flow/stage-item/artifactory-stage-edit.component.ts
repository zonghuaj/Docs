import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {ArtifactoryService} from "../../artifactory.service";
import {StageFlowItem} from "../../artifactory.entities";
import {TeamGroupService} from "admin-ui-angular-user-management";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {NzModalRef} from "ng-zorro-antd";
import {isUrl} from "admin-ui-angular-common";

@Component({
  selector: 'artifactory-stage-edit',
  template: `
    <se-container col="1" labelWidth="100">
      <se label="阶段名称" required>
        <input nz-input [(ngModel)]="stage.name">
      </se>
      <se label="部署地址" required>
        <input type="url" nz-input [(ngModel)]="stage.deployUrl">
        <se-error *ngIf="stage.deployUrl && !isUrl(stage.deployUrl)">请输入正确的Url</se-error>
      </se>
      <se label="Token">
        <input nz-input [(ngModel)]="stage.deployToken">
      </se>
      <se label="部署审批人" required>
        <nz-select class="width100" [(ngModel)]="stage.deployGroupId">
          <nz-option *ngFor="let r of teamsDeploy" [nzLabel]="r.groupName" [nzValue]="r.groupId"></nz-option>
        </nz-select>
      </se>
      <se label="验证审批人" required>
        <nz-select class="width100" [(ngModel)]="stage.confirmGroupId">
          <nz-option *ngFor="let r of teamsApprove" [nzLabel]="r.groupName" [nzValue]="r.groupId"></nz-option>
        </nz-select>
      </se>
    </se-container>

    <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
      <button class="mr-sm" nz-button nzType="default" type="button" (click)="cancel()">取消
      </button>
      <button nz-button nzType="primary" type="button" (click)="submit()" [disabled]="disable">保存
      </button>
    </div>
  `,
  providers: [ArtifactoryService, TeamGroupService]
})
export class ArtifactoryStageEditComponent implements OnInit {
  private _stage: StageFlowItem = {} as StageFlowItem;
  @Input() set stage(s: StageFlowItem) {
    this._stage = {...s};
  }

  get stage() {
    return this._stage;
  }

  teamsDeploy: {
    groupId: string,
    groupName: string
  }[] = [];

  teamsApprove: {
    groupId: string,
    groupName: string
  }[] = [];

  constructor(private modal: NzModalRef,
              private artifService: ArtifactoryService,
              private teamGroupService: TeamGroupService) {
  }

  ngOnInit(): void {
    this.getTeamGroups();
  }

  getTeamGroups() {
    this.teamGroupService.getTeamGroup()
      .pipe(
        switchMap((res: any) => of(res.rows.map(r => ({groupId: r.groupId, groupName: r.groupName})))),
      )
      .subscribe(res => {
        this.teamsApprove = res;
        this.teamsDeploy = [...res, {groupId: 'AUTO_DEPLOY_GROUP', groupName: '[自动审批]'}];
      });
  }

  submit() {
    this.stage.confirmGroupName = this.findGroup(this.stage.confirmGroupId).groupName;
    this.stage.deployGroupName = this.findGroup(this.stage.deployGroupId).groupName;
    this.modal.close(this.stage);
  }

  findGroup(roleId) {
    return this.teamsDeploy.find(t => t.groupId === roleId);
  }

  cancel() {
    this.modal.close();
  }

  isUrl(s) {
    return isUrl(s);
  }

  get disable() {
    const {name, deployUrl, deployGroupId, confirmGroupId} = this.stage;
    return !name || !deployUrl || !deployGroupId || !confirmGroupId || !isUrl(deployUrl);
  }
}
