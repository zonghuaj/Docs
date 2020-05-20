import { TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceTrafficService } from './admin-ui-angular-service-traffic.service';

describe('AdminUiAngularServiceTrafficService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularServiceTrafficService = TestBed.get(AdminUiAngularServiceTrafficService);
    expect(service).toBeTruthy();
  });
});
