import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularMonitorAllComponent } from './admin-ui-angular-monitor-all.component';

describe('AdminUiAngularMonitorAllComponent', () => {
  let component: AdminUiAngularMonitorAllComponent;
  let fixture: ComponentFixture<AdminUiAngularMonitorAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularMonitorAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularMonitorAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
