import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularPlatformDashboardComponent } from './admin-ui-angular-platform-dashboard.component';

describe('AdminUiAngularPlatformDashboardComponent', () => {
  let component: AdminUiAngularPlatformDashboardComponent;
  let fixture: ComponentFixture<AdminUiAngularPlatformDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularPlatformDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularPlatformDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
