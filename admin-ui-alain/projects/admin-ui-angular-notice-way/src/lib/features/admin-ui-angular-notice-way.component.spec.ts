import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularNoticeWayComponent } from './admin-ui-angular-notice-way.component';

describe('AdminUiAngularNoticeWayComponent', () => {
  let component: AdminUiAngularNoticeWayComponent;
  let fixture: ComponentFixture<AdminUiAngularNoticeWayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularNoticeWayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularNoticeWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
