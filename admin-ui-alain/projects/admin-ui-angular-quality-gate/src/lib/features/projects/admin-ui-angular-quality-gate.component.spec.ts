import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularQualityGateComponent } from './admin-ui-angular-quality-gate.component';

describe('AdminUiAngularQualityGateComponent', () => {
  let component: AdminUiAngularQualityGateComponent;
  let fixture: ComponentFixture<AdminUiAngularQualityGateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularQualityGateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularQualityGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
