import { TestBed } from '@angular/core/testing';

import { AdminUiAngularAlertAllService } from './admin-ui-angular-alert-all.service';

describe('AdminUiAngularAlertAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularAlertAllService = TestBed.get(AdminUiAngularAlertAllService);
    expect(service).toBeTruthy();
  });
});
