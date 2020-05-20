import { TestBed } from '@angular/core/testing';

import { AdminUiAngularItestPlatformService } from './admin-ui-angular-itest-platform.service';

describe('AdminUiAngularItestPlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularItestPlatformService = TestBed.get(AdminUiAngularItestPlatformService);
    expect(service).toBeTruthy();
  });
});
