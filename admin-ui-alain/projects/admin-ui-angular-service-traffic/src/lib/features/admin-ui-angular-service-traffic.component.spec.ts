import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularServiceTrafficComponent } from './admin-ui-angular-service-traffic.component';

describe('AdminUiAngularServiceTrafficComponent', () => {
  let component: AdminUiAngularServiceTrafficComponent;
  let fixture: ComponentFixture<AdminUiAngularServiceTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularServiceTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularServiceTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
