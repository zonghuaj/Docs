import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserListLayoutComponent} from "./features/user/list.component";
import {GroupListLayoutComponent} from "./features/group/list.component";
import {TenantConsoleGuard} from "@app/routes/guards/tenant-console-guard";
import {ProjectConsoleGuard} from "@app/routes/guards/project-console-guard";
import {AccountComponent} from "./features/account/account.component";

const routes: Routes = [
  {
    path: 'user', component: UserListLayoutComponent,
    canActivate: [TenantConsoleGuard]
  },
  {
    path: 'group', component: GroupListLayoutComponent,
    canActivate: [ProjectConsoleGuard]
  },
  {
    path: 'role', component: GroupListLayoutComponent,
    canActivate: [ProjectConsoleGuard]
  },
  {path: 'account', component: AccountComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularUserManagementRoutingModule {
}
