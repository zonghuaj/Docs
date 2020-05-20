import { TestBed } from '@angular/core/testing';

import { TenantManagementService } from './tenant-management.service';

describe('TenantManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantManagementService = TestBed.get(TenantManagementService);
    expect(service).toBeTruthy();
  });
});
