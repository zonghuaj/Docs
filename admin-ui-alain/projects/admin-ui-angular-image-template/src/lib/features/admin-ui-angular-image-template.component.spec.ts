import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUiAngularImageTemplateListComponent } from './admin-ui-angular-image-template-list.component';

describe('AdminUiAngularImageTemplateComponent', () => {
  let component: AdminUiAngularImageTemplateListComponent;
  let fixture: ComponentFixture<AdminUiAngularImageTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUiAngularImageTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUiAngularImageTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
