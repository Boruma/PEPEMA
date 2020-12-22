import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSupplierPage } from './manage-supplier.page';

describe('ManageSupplierPage', () => {
  let component: ManageSupplierPage;
  let fixture: ComponentFixture<ManageSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSupplierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
