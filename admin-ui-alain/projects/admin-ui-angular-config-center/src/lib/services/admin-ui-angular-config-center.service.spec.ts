import { TestBed } from '@angular/core/testing';

import { AdminUiAngularConfigCenterService } from './admin-ui-angular-config-center.service';

describe('AdminUiAngularConfigCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularConfigCenterService = TestBed.get(AdminUiAngularConfigCenterService);
    expect(service).toBeTruthy();
  });
});
