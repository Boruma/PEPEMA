import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierPage } from './add-supplier.page';

describe('AddSupplierPage', () => {
  let component: AddSupplierPage;
  let fixture: ComponentFixture<AddSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupplierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
