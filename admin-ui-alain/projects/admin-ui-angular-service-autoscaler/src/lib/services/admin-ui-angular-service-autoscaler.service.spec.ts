import { TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceAutoscalerService } from './admin-ui-angular-service-autoscaler.service';

describe('AdminUiAngularServiceAutoscalerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminUiAngularServiceAutoscalerService = TestBed.get(AdminUiAngularServiceAutoscalerService);
    expect(service).toBeTruthy();
  });
});
