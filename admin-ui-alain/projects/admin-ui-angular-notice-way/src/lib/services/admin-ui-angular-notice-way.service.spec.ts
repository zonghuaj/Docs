import { TestBed } from '@angular/core/testing';

import { AdminUiAngularNoticeWayService } from './admin-ui-angular-notice-way.service';

describe('AdminUiAngularNoticeWayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularNoticeWayService = TestBed.get(AdminUiAngularNoticeWayService);
    expect(service).toBeTruthy();
  });
});
