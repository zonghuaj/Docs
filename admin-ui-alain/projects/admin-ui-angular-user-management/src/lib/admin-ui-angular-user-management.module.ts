import {NgModule} from '@angular/core';

import {AdminUiAngularUserManagementRoutingModule} from './admin-ui-angular-user-management-routing.module';
import {UserListLayoutComponent} from "./features/user/list.component";
import {GroupListLayoutComponent} from "./features/group/list.component";
import {RoleListEditComponent} from "./features/role/edit.component";
import {SharedModule} from "admin-ui-angular-common";
import {UserListEditComponent} from "./features/user/edit.component";
import {AccountComponent} from "./features/account/account.component";
import {GroupListEditComponent} from "./features/group/edit.component";
import {UserListResetPasswordComponent} from "./features/user/resetPwd.component";
import {UserListBindGroupComponent} from "./features/user/bindGroup.component";

const COMPONENTS = [
  UserListLayoutComponent,
  GroupListLayoutComponent,
  RoleListEditComponent,
  AccountComponent,
  GroupListEditComponent,
  UserListResetPasswordComponent,
  UserListBindGroupComponent
];
const COMPONENTS_ENTRY = [
  UserListEditComponent,
  UserListResetPasswordComponent,
  UserListBindGroupComponent,
  GroupListEditComponent
];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_ENTRY],
  imports: [
    AdminUiAngularUserManagementRoutingModule,
    SharedModule
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: []
})
export class AdminUiAngularUserManagementModule {
}
