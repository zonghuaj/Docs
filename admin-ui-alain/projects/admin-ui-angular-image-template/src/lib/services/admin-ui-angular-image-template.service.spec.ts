import { TestBed } from '@angular/core/testing';

import { AdminUiAngularImageTemplateService } from './admin-ui-angular-image-template.service';

describe('AdminUiAngularImageTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularImageTemplateService = TestBed.get(AdminUiAngularImageTemplateService);
    expect(service).toBeTruthy();
  });
});
