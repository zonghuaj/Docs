import { TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceTraceService } from './admin-ui-angular-service-trace.service';

describe('AdminUiAngularServiceTraceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularServiceTraceService = TestBed.get(AdminUiAngularServiceTraceService);
    expect(service).toBeTruthy();
  });
});
