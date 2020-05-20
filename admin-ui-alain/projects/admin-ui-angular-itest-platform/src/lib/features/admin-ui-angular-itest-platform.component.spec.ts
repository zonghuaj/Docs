import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularItestPlatformComponent } from './admin-ui-angular-itest-platform.component';

describe('AdminUiAngularItestPlatformComponent', () => {
  let component: AdminUiAngularItestPlatformComponent;
  let fixture: ComponentFixture<AdminUiAngularItestPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularItestPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularItestPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
