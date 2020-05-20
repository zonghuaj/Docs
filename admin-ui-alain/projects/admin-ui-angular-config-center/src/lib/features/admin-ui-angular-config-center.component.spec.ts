import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularConfigCenterComponent } from './admin-ui-angular-config-center.component';

describe('AdminUiAngularConfigCenterComponent', () => {
  let component: AdminUiAngularConfigCenterComponent;
  let fixture: ComponentFixture<AdminUiAngularConfigCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularConfigCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularConfigCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
