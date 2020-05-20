import { TestBed } from '@angular/core/testing';

import { AdminUiAngularMonitorAllService } from './admin-ui-angular-monitor-all.service';

describe('AdminUiAngularMonitorAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularMonitorAllService = TestBed.get(AdminUiAngularMonitorAllService);
    expect(service).toBeTruthy();
  });
});
