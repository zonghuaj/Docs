import {NgModule} from '@angular/core';

import {AdminUiAngularImageTemplateRoutingModule} from './admin-ui-angular-image-template-routing.module';
import {AdminUiAngularImageTemplateListComponent} from './features/admin-ui-angular-image-template-list.component';
// import {SharedModule} from 'admin-ui-angular-common/src/lib/shared.module';
import {SharedModule} from 'admin-ui-angular-common';
import {AdminUiAngularImageTemplateEditComponent} from './features/admin-ui-angular-image-template-edit.component';
import {AdminUiAngularImageTemplateFormComponent} from './features/admin-ui-angular-image-template-form.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';

@NgModule({
  declarations: [
    AdminUiAngularImageTemplateListComponent,
    AdminUiAngularImageTemplateFormComponent,
    AdminUiAngularImageTemplateEditComponent
  ],
  imports: [
    SharedModule, CodemirrorModule,
    AdminUiAngularImageTemplateRoutingModule,
  ],
  exports: [
    AdminUiAngularImageTemplateListComponent,
    AdminUiAngularImageTemplateFormComponent,
    AdminUiAngularImageTemplateEditComponent
  ]
})
export class AdminUiAngularImageTemplateModule {
}
