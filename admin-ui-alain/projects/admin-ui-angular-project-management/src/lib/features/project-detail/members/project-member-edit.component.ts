import {Component, Input} from '@angular/core';
import {PMember, Role} from "./project-membert.entities";

@Component({
  selector: 'project-detail-container',
  template: `
    <sv-container col="1">
      <sv label="用户名">{{member.username}}</sv>
      <sv label="权限">
        <nz-select class="width100"
                   [(ngModel)]="selectedRids"
                   (ngModelChange)="onRoleSelected($event)"
                   [nzPlaceHolder]="'请选择角色'"
                   [nzShowSearch]="true"
                   nzMode="multiple">
          <nz-option *ngFor="let r of roles" [nzLabel]="r.name" [nzValue]="r.id"></nz-option>
        </nz-select>
      </sv>
    </sv-container>
  `,
  styles: [``],
})
export class ProjectMemberEditComponent {
  _member: PMember;
  @Input() set member(e: PMember) {
    this._member = e;
    this.selectedRids = this._member.roles.map(r => r.roleId);
  }

  get member() {
    return this._member;
  }

  @Input() roles: Role[];
  selectedRids: string[];

  constructor() {
  }

  onRoleSelected(rids: string[]) {
    this.member.roles = rids.map(rid => {
      const r = this.roles.find(r => r.id === rid);
      return {
        userId: this.member.id,
        roleId: r.id,
        roleName: r.name
      };
    });
  }
}
