import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierPage } from './edit-supplier.page';

describe('EditSupplierPage', () => {
  let component: EditSupplierPage;
  let fixture: ComponentFixture<EditSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSupplierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
