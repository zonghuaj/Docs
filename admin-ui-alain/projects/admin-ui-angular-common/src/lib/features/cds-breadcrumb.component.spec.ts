import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdsBreadcrumbComponent } from './cds-breadcrumb.component';

describe('AdminUiAngularCommonComponent', () => {
  let component: CdsBreadcrumbComponent;
  let fixture: ComponentFixture<CdsBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CdsBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdsBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
