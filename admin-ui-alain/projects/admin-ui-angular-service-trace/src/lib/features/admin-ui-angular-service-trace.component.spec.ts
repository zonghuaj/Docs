import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceTraceComponent } from './admin-ui-angular-service-trace.component';

describe('AdminUiAngularServiceTraceComponent', () => {
  let component: AdminUiAngularServiceTraceComponent;
  let fixture: ComponentFixture<AdminUiAngularServiceTraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularServiceTraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularServiceTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
