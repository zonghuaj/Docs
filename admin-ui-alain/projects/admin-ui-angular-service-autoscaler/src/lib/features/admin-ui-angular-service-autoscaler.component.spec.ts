import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceAutoscalerComponent } from './admin-ui-angular-service-autoscaler.component';

describe('AdminUiAngularServiceAutoscalerComponent', () => {
  let component: AdminUiAngularServiceAutoscalerComponent;
  let fixture: ComponentFixture<AdminUiAngularServiceAutoscalerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularServiceAutoscalerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularServiceAutoscalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
