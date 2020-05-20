import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularLogSummaryComponent } from './admin-ui-angular-log-summary.component';

describe('AdminUiAngularLogSummaryComponent', () => {
  let component: AdminUiAngularLogSummaryComponent;
  let fixture: ComponentFixture<AdminUiAngularLogSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularLogSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularLogSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
