import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSetupPage } from './supplier-setup.page';

describe('SupplierSetupPage', () => {
  let component: SupplierSetupPage;
  let fixture: ComponentFixture<SupplierSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSetupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
