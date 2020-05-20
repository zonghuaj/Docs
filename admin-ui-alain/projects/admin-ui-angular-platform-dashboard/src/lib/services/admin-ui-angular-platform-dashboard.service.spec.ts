import { TestBed } from '@angular/core/testing';

import { AdminUiAngularPlatformDashboardService } from './admin-ui-angular-platform-dashboard.service';

describe('AdminUiAngularPlatformDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularPlatformDashboardService = TestBed.get(AdminUiAngularPlatformDashboardService);
    expect(service).toBeTruthy();
  });
});
