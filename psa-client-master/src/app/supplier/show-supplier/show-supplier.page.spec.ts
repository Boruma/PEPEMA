import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSupplierPage } from './show-supplier.page';

describe('ShowSupplierPage', () => {
  let component: ShowSupplierPage;
  let fixture: ComponentFixture<ShowSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSupplierPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
