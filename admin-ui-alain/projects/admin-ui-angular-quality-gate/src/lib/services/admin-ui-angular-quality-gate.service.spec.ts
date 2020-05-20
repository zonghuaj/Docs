import { TestBed } from '@angular/core/testing';

import { AdminUiAngularQualityGateService } from './admin-ui-angular-quality-gate.service';

describe('AdminUiAngularQualityGateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularQualityGateService = TestBed.get(AdminUiAngularQualityGateService);
    expect(service).toBeTruthy();
  });
});
