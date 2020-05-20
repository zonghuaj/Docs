import { TestBed } from '@angular/core/testing';

import { AdminUiAngularAlertRulesService } from './admin-ui-angular-alert-rules.service';

describe('AdminUiAngularAlertRulesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularAlertRulesService = TestBed.get(AdminUiAngularAlertRulesService);
    expect(service).toBeTruthy();
  });
});
