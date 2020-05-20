import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularAlertAllComponent } from './admin-ui-angular-alert-all.component';

describe('AdminUiAngularAlertAllComponent', () => {
  let component: AdminUiAngularAlertAllComponent;
  let fixture: ComponentFixture<AdminUiAngularAlertAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularAlertAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularAlertAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
