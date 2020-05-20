import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularAlertRulesComponent } from './admin-ui-angular-alert-rules.component';

describe('AdminUiAngularAlertRulesComponent', () => {
  let component: AdminUiAngularAlertRulesComponent;
  let fixture: ComponentFixture<AdminUiAngularAlertRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularAlertRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularAlertRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
