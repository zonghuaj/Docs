import { TestBed } from '@angular/core/testing';

import { AdminUiAngularLogSummaryService } from './admin-ui-angular-log-summary.service';

describe('AdminUiAngularLogSummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularLogSummaryService = TestBed.get(AdminUiAngularLogSummaryService);
    expect(service).toBeTruthy();
  });
});
