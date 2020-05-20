import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminUiAngularImageTemplateListComponent} from './features/admin-ui-angular-image-template-list.component';
import {AdminUiAngularImageTemplateEditComponent} from './features/admin-ui-angular-image-template-edit.component';
import {DevelopConsoleGuard} from '@app/routes/guards/develop-console-guard';

const routes: Routes = [
  {
    path: '', component: AdminUiAngularImageTemplateListComponent,
    canActivate: [DevelopConsoleGuard]
  },
  {
    path: 'create', component: AdminUiAngularImageTemplateEditComponent,
    canActivate: [DevelopConsoleGuard]
  },
  {
    path: ':itid/edit', component: AdminUiAngularImageTemplateEditComponent,
    canActivate: [DevelopConsoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUiAngularImageTemplateRoutingModule {
}
